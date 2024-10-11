import reddit from './reddit';
import { Snoowrap } from 'snoowrap';

export interface Subreddit {
  id: string;
  name: string;
  description: string;
  subscribers: number;
}

export interface Post {
  id: string;
  title: string;
  score: number;
  num_comments: number;
  created_utc: number;
  url: string;
  selftext: string;  // 添加帖子内容
}

export async function getPopularSubreddits(limit: number = 10): Promise<Subreddit[]> {
  if (!reddit) throw new Error('Reddit client is not initialized');
  const subreddits = await reddit.getPopularSubreddits({ limit });
  return subreddits.map((subreddit: Snoowrap.Subreddit) => ({
    id: subreddit.id,
    name: subreddit.display_name,
    description: subreddit.public_description,
    subscribers: subreddit.subscribers,
  }));
}

export async function getSubredditPosts(subredditName: string, limit: number = 50): Promise<Post[]> {
  if (!reddit) throw new Error('Reddit client is not initialized');
  const subreddit = await reddit.getSubreddit(subredditName);
  const now = Math.floor(Date.now() / 1000);
  const oneDayAgo = now - 24 * 60 * 60;

  const topPosts = await subreddit.getTop({time: 'day', limit: limit});
  
  return topPosts
    .filter((post: Snoowrap.Submission) => post.created_utc >= oneDayAgo)
    .map((post: Snoowrap.Submission) => ({
      id: post.id,
      title: post.title,
      score: post.score,
      num_comments: post.num_comments,
      created_utc: post.created_utc,
      url: post.url,
      selftext: post.selftext,
    }));
}