/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useLocalSubreddits, AnalyzedPost } from '../../../hooks/useLocalSubreddits';

const categoryShortNames = {
  '解决方案请求': '方案',
  '痛苦与愤怒': '情绪',
  '建议请求': '建议',
  '金钱讨论': '金钱'
};

export default function SubredditPage() {
  const params = useParams();
  const id = params?.id as string;
  const [posts, setPosts] = useState<AnalyzedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('top-posts');
  const { getAnalyzedPosts, saveAnalyzedPosts } = useLocalSubreddits();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const storedPosts = getAnalyzedPosts(id);
      if (storedPosts.length > 0) {
        setPosts(storedPosts);
        setLoading(false);
      } else {
        const response = await fetch(`/api/analyze-posts?subreddit=${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch and analyze posts');
        }
        const analyzedPosts = await response.json();
        setPosts(analyzedPosts);
        saveAnalyzedPosts(id, analyzedPosts);
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching and analyzing posts:', err);
      setError('Failed to fetch and analyze posts: ' + (err instanceof Error ? err.message : String(err)));
      setLoading(false);
    }
  }, [id, getAnalyzedPosts, saveAnalyzedPosts]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  const categories = ['解决方案请求', '痛苦与愤怒', '建议请求', '金钱讨论'];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">r/{id}</h1>
      <div className="mb-6 flex border-b border-gray-700">
        <button
          className={`w-1/2 py-2 text-center ${activeTab === 'top-posts' ? 'border-b-2 border-primary font-bold' : ''}`}
          onClick={() => setActiveTab('top-posts')}
        >
          顶级帖子
        </button>
        <button
          className={`w-1/2 py-2 text-center ${activeTab === 'themes' ? 'border-b-2 border-primary font-bold' : ''}`}
          onClick={() => setActiveTab('themes')}
        >
          主题分析
        </button>
      </div>
      {activeTab === 'top-posts' && (
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-secondary">
                <th className="px-4 py-2 text-left" style={{minWidth: '200px', maxWidth: '40%'}}>标题</th>
                <th className="px-4 py-2 text-center" style={{minWidth: '80px', maxWidth: '10%'}}>评分</th>
                <th className="px-4 py-2 text-center" style={{minWidth: '80px', maxWidth: '10%'}}>评论</th>
                <th className="px-4 py-2 text-center" style={{minWidth: '100px', maxWidth: '15%'}}>创建时间</th>
                <th className="px-4 py-2 text-center" style={{minWidth: '120px', maxWidth: '25%'}}>分类</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id} className="border-b border-gray-700">
                  <td className="px-4 py-2">
                    <Link href={post.url} target="_blank" rel="noopener noreferrer" className="text-teal-300 hover:text-teal-100 transition-colors duration-200">
                      <span className="line-clamp-2">{post.title}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-center">{post.score}</td>
                  <td className="px-4 py-2 text-center">{post.num_comments}</td>
                  <td className="px-4 py-2 text-center">{new Date(post.created_utc * 1000).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-center">
                    {Object.entries(post.analysis)
                      .filter(([, value]) => value)  // 使用解构赋值，完全忽略第一个参数
                      .map(([key]) => categoryShortNames[key as keyof typeof categoryShortNames])
                      .join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {activeTab === 'themes' && (
        <div>
          {categories.map(category => (
            <div key={category} className="mb-6">
              <h2 className="text-xl font-bold mb-2 text-primary">{category}</h2>
              <ul className="space-y-2">
                {posts.filter(post => post.analysis && post.analysis[category as keyof typeof post.analysis]).map(post => (
                  <li key={post.id}>
                    <Link href={post.url} target="_blank" rel="noopener noreferrer" className="text-teal-300 hover:text-teal-100 transition-colors duration-200">
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
