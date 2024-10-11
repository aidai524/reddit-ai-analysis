import { NextApiRequest, NextApiResponse } from 'next';
import { getPopularSubreddits } from '../../lib/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      console.log('API环境变量:', {
        userAgent: process.env.REDDIT_USER_AGENT,
        clientId: process.env.REDDIT_CLIENT_ID,
        clientSecret: process.env.REDDIT_CLIENT_SECRET,
        username: process.env.REDDIT_USERNAME,
        password: process.env.REDDIT_PASSWORD,
      });

      const subreddits = await getPopularSubreddits(10);
      res.status(200).json(subreddits);
    } catch (error) {
      console.error('获取子版块时出错:', error);
      res.status(500).json({ error: '获取子版块失败' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}