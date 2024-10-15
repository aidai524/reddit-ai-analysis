import { getPopularSubreddits as getPopularSubredditsFromReddit, getSubredditTopPosts } from './redditOperations';
import Snoowrap from 'snoowrap';

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
  selftext: string;
}

export async function getPopularSubreddits(limit: number = 10): Promise<Subreddit[]> {
  const subreddits = await getPopularSubredditsFromReddit(limit);
  return subreddits.map((subreddit: Snoowrap.Subreddit) => ({
    id: subreddit.id,
    name: subreddit.display_name,
    description: subreddit.public_description,
    subscribers: subreddit.subscribers,
  }));
}

export async function getSubredditPosts(subredditName: string, limit: number = 50): Promise<Post[]> {
  const now = Math.floor(Date.now() / 1000);
  const oneDayAgo = now - 24 * 60 * 60;

  const topPosts = await getSubredditTopPosts(subredditName, limit);
  
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
