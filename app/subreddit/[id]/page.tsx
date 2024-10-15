'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useLocalSubreddits, AnalyzedPost } from '../../../hooks/useLocalSubreddits';
import { Sparkles, ArrowUp, MessageSquare, Calendar } from 'lucide-react';

const categoryShortNames = {
  '解决方案请求': '方案',
  '痛苦与愤怒': '情绪',
  '建议请求': '建议',
  '金钱讨论': '金钱'
};

const categoryColors = {
  '解决方案请求': 'bg-green-500',
  '痛苦与愤怒': 'bg-red-500',
  '建议请求': 'bg-blue-500',
  '金钱讨论': 'bg-yellow-500'
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

  if (loading) return <div className="text-center py-10 text-pink-200">Loading...</div>;
  if (error) return <div className="text-center py-10 text-pink-500">Error: {error}</div>;

  const categories = ['解决方案请求', '痛苦与愤怒', '建议请求', '金钱讨论'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-500 text-white font-sans">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-white font-display flex items-center">
          <Sparkles className="mr-2" />
          r/{id}
        </h1>
        <div className="mb-6 flex border-b border-pink-300">
          <button
            className={`w-1/2 py-2 text-center ${activeTab === 'top-posts' ? 'border-b-2 border-pink-300 font-bold text-pink-200' : 'text-purple-200'}`}
            onClick={() => setActiveTab('top-posts')}
          >
            顶级帖子
          </button>
          <button
            className={`w-1/2 py-2 text-center ${activeTab === 'themes' ? 'border-b-2 border-pink-300 font-bold text-pink-200' : 'text-purple-200'}`}
            onClick={() => setActiveTab('themes')}
          >
            主题分析
          </button>
        </div>
        {activeTab === 'top-posts' && (
          <div className="overflow-x-auto bg-purple-900 bg-opacity-50 rounded-lg shadow-lg">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-purple-800 bg-opacity-50">
                  <th className="px-4 py-2 text-center text-pink-200" style={{width: '40%'}}>标题</th>
                  <th className="px-4 py-2 text-center text-pink-200" style={{width: '80px'}}>评分</th>
                  <th className="px-4 py-2 text-center text-pink-200" style={{width: '80px'}}>评论</th>
                  <th className="px-4 py-2 text-center text-pink-200" style={{width: '120px'}}>创建时间</th>
                  <th className="px-4 py-2 text-center text-pink-200" style={{width: '20%'}}>分类</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id} className="border-b border-purple-700 hover:bg-purple-800 hover:bg-opacity-50 transition-colors duration-200">
                    <td className="px-4 py-2">
                      <Link href={post.url} target="_blank" rel="noopener noreferrer" className="text-pink-300 hover:text-pink-100 transition-colors duration-200">
                        <span className="line-clamp-2">{post.title}</span>
                      </Link>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex items-center justify-center">
                        <ArrowUp className="mr-1 text-pink-300" size={16} />
                        <span>{post.score}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex items-center justify-center">
                        <MessageSquare className="mr-1 text-pink-300" size={16} />
                        <span>{post.num_comments}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex items-center justify-center">
                        <Calendar className="mr-1 text-pink-300" size={16} />
                        <span>{new Date(post.created_utc * 1000).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-center">
                      {post.analysis && Object.entries(post.analysis)
                        .filter(([, value]) => value)
                        .map(([key]) => (
                          <span 
                            key={key} 
                            className={`inline-block ${categoryColors[key as keyof typeof categoryColors]} text-purple-900 text-xs px-2 py-1 rounded-full mr-1 mb-1`}
                          >
                            {categoryShortNames[key as keyof typeof categoryShortNames]}
                          </span>
                        ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 'themes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map(category => (
              <div key={category} className="bg-purple-900 bg-opacity-50 rounded-lg shadow-lg p-6">
                <h2 className={`text-2xl font-bold mb-4 ${categoryColors[category as keyof typeof categoryColors]} text-purple-900 px-2 py-1 rounded-lg inline-block font-display`}>
                  {category}
                </h2>
                <ul className="space-y-2">
                  {posts.filter(post => post.analysis && post.analysis[category as keyof typeof post.analysis]).map(post => (
                    <li key={post.id} className="bg-purple-800 bg-opacity-50 rounded p-2 hover:bg-purple-700 transition-colors duration-200">
                      <Link href={post.url} target="_blank" rel="noopener noreferrer" className="text-pink-200 hover:text-pink-100 transition-colors duration-200">
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
    </div>
  );
}
