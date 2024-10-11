import { useState, useEffect, useCallback } from 'react';

export interface Subreddit {
  id: string;
  name: string;
  description: string;
  subscribers: number;
}

export interface AnalyzedPost {
  id: string;
  title: string;
  score: number;
  num_comments: number;
  created_utc: number;
  url: string;
  selftext: string;
  analysis: {
    '解决方案请求': boolean;
    '痛苰与愤怒': boolean;
    '建议请求': boolean;
    '金钱讨论': boolean;
  };
}

export function useLocalSubreddits() {
  const [subreddits, setSubreddits] = useState<Subreddit[]>([]);

  useEffect(() => {
    const storedSubreddits = localStorage.getItem('subreddits');
    if (storedSubreddits) {
      setSubreddits(JSON.parse(storedSubreddits));
    }
  }, []);

  const addSubreddit = async (newSubreddit: Subreddit) => {
    const updatedSubreddits = [...subreddits, newSubreddit];
    setSubreddits(updatedSubreddits);
    localStorage.setItem('subreddits', JSON.stringify(updatedSubreddits));

    // 触发新添加子版块的分析
    try {
      const response = await fetch(`/api/analyze-posts?subreddit=${newSubreddit.name}`);
      if (!response.ok) {
        throw new Error('Failed to analyze posts');
      }
      const analyzedPosts = await response.json();
      saveAnalyzedPosts(newSubreddit.name, analyzedPosts);
    } catch (error) {
      console.error('Error analyzing posts for new subreddit:', error);
    }
  };

  const checkSubredditExists = (name: string) => {
    return subreddits.some(subreddit => subreddit.name.toLowerCase() === name.toLowerCase());
  };

  const getAnalyzedPosts = useCallback((subredditName: string): AnalyzedPost[] => {
    const storedPosts = localStorage.getItem(`analyzed_posts_${subredditName}`);
    return storedPosts ? JSON.parse(storedPosts) : [];
  }, []);

  const saveAnalyzedPosts = useCallback((subredditName: string, posts: AnalyzedPost[]) => {
    localStorage.setItem(`analyzed_posts_${subredditName}`, JSON.stringify(posts));
  }, []);

  return { subreddits, addSubreddit, checkSubredditExists, getAnalyzedPosts, saveAnalyzedPosts };
}