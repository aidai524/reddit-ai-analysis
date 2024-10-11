import { NextApiRequest, NextApiResponse } from 'next';
import { getSubredditPosts } from '../../lib/api';
import OpenAI from 'openai';
import { Post } from '../../lib/api';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { subreddit } = req.query;

  if (req.method === 'GET' && typeof subreddit === 'string') {
    try {
      const posts = await getSubredditPosts(subreddit);
      const analyzedPosts = await analyzePosts(posts);
      res.status(200).json(analyzedPosts);
    } catch (error) {
      console.error('Error analyzing posts:', error);
      res.status(500).json({ error: 'Failed to analyze posts' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function analyzePosts(posts: Post[]) {
  const categories = ['解决方案请求', '痛苦与愤怒', '建议请求', '金钱讨论'];
  const analyzedPosts = await Promise.all(posts.map(async (post) => {
    const prompt = `
      分析以下 Reddit 帖子的标题和内容，并确定它是否属于以下类别（回答是或否）：
      1. 解决方案请求
      2. 痛苦与愤怒
      3. 建议请求
      4. 金钱讨论

      标题: ${post.title}
      内容: ${post.selftext || ''}

      请以 JSON 格式回答，例如：
      {
        "解决方案请求": true,
        "痛苦与愤怒": false,
        "建议请求": true,
        "金钱讨论": false
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 150,
    });

    const analysis = JSON.parse(response.choices[0].message.content || '{}');
    return { ...post, analysis };
  }));

  return analyzedPosts;
}