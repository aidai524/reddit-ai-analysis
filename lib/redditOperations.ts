import reddit from './reddit';
import Snoowrap from 'snoowrap';

export function getPopularSubreddits(limit: number = 10): Promise<Snoowrap.Subreddit[]> {
  return reddit.getPopularSubreddits({ limit });
}

export function getSubreddit(subredditName: string): Snoowrap.Subreddit {
  return reddit.getSubreddit(subredditName);
}

export function getTopPosts(subreddit: Snoowrap.Subreddit, limit: number): Promise<Snoowrap.Submission[]> {
  return subreddit.getTop({time: 'day', limit: limit});
}

export async function getSubredditTopPosts(subredditName: string, limit: number): Promise<Snoowrap.Submission[]> {
  const subreddit = getSubreddit(subredditName);
  return getTopPosts(subreddit, limit);
}
