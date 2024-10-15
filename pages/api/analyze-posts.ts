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
      res.status(500).json({ 
        error: 'Failed to analyze posts', 
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function analyzePosts(posts: Post[]) {
  const analyzedPosts = await Promise.all(posts.map(async (post) => {
    const prompt = `
        Analyze the title and content of the following Reddit post and determine if it falls into one of the following categories (answer yes or no):

        1. Solution Request
        2. Pain and Anger
        3. Requests for recommendations
        4. Money discussions

        Title: ${post.title}

        Content: ${post.selftext || ''}

        Please answer in JSON format, for example:

        {
            "Solution Request": true,
            "Pain & Anger": false,
            "Suggestion Requests": true,
            "Money Discussion": false
        }
    `;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 150,
      });

      console.log('OpenAI API response:', response);

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('OpenAI response is empty');
      }

      console.log('OpenAI response content:', content);

      let analysis;
      try {
        // 尝试移除任何非 JSON 字符
        const jsonString = content.replace(/^```json\s*|\s*```$/g, '').trim();
        console.log('Cleaned JSON string:', jsonString);
        analysis = JSON.parse(jsonString);
      } catch (parseError) {
        console.error('Failed to parse OpenAI response:', content);
        throw new Error(`Failed to parse OpenAI response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
      }

      return { ...post, analysis };
    } catch (error) {
      console.error('Error analyzing post:', error);
      return { ...post, analysis: null };
    }
  }));

  return analyzedPosts;
}
