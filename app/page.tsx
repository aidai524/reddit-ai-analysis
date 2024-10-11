'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SubredditCard } from '../components/ui/SubredditCard';
import { Modal } from '../components/ui/Modal';
import { Loading } from '../components/ui/Loading';
import { useLocalSubreddits, Subreddit } from '../hooks/useLocalSubreddits';

export default function Home() {
  const { subreddits, addSubreddit, checkSubredditExists } = useLocalSubreddits();
  const [newSubredditName, setNewSubredditName] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddSubreddit = async () => {
    if (checkSubredditExists(newSubredditName)) {
      setError('该子版块已存在');
      return;
    }

    try {
      setIsModalOpen(false);
      setIsLoading(true);
      const response = await fetch(`https://www.reddit.com/r/${newSubredditName}/about.json`);
      const data = await response.json();
      
      if (data.error) {
        throw new Error('无法找到该子版块');
      }

      const newSubreddit: Subreddit = {
        id: data.data.id,
        name: data.data.display_name,
        description: data.data.public_description,
        subscribers: data.data.subscribers,
      };

      await addSubreddit(newSubreddit);
      setNewSubredditName('');
      setError('');
    } catch (err) {
      console.error('添加子版块时出错:', err);
      setError('添加子版块时出错: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {isLoading && <Loading />}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-100">可用的子版块</h1>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="btn-primary"
        >
          添加 Reddit
        </button>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4 text-gray-100">添加新的子版块</h2>
        <input
          type="text"
          value={newSubredditName}
          onChange={(e) => setNewSubredditName(e.target.value)}
          placeholder="输入子版块名称"
          className="bg-gray-700 text-gray-100 border border-gray-600 p-2 w-full mb-4 rounded"
        />
        <button 
          onClick={handleAddSubreddit} 
          className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700 transition-colors duration-300"
        >
          添加子版块
        </button>
        {error && <p className="text-red-400 mt-2">{error}</p>}
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subreddits.map((subreddit: Subreddit) => (
          <Link href={`/subreddit/${subreddit.name}`} key={subreddit.id} className="no-underline">
            <SubredditCard
              name={subreddit.name}
              description={subreddit.description}
              subscribers={subreddit.subscribers}
            />
          </Link>
        ))}
      </div>
    </main>
  );
}
