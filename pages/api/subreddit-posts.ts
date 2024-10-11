import { NextApiRequest, NextApiResponse } from 'next';
import { getSubredditPosts } from '../../lib/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { subreddit } = req.query;

  if (req.method === 'GET' && typeof subreddit === 'string') {
    try {
      const posts = await getSubredditPosts(subreddit, 50);  // 获取50个帖子，然后过滤最近24小时的
      res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching subreddit posts:', error);
      res.status(500).json({ error: 'Failed to fetch subreddit posts' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}