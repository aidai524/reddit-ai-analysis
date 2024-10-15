'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SubredditCard } from '../components/ui/SubredditCard';
import { Modal } from '../components/ui/Modal';
import { Loading } from '../components/ui/Loading';
import { useLocalSubreddits, Subreddit } from '../hooks/useLocalSubreddits';
import { Sparkles, PlusCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-500 text-white font-sans">
      {isLoading && <Loading />}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-bold text-white font-display tracking-wide flex items-center">
            <Sparkles className="mr-2" />
            Reddit 奇趣园
          </h1>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="bg-white hover:bg-gray-200 text-purple-700 font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out flex items-center transform hover:scale-105"
          >
            <PlusCircle className="mr-2" size={20} />
            添加新世界
          </button>
        </div>
        
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          className="bg-purple-900 bg-opacity-75"
        >
          <div className="bg-purple-900 p-6 rounded-lg shadow-xl border border-pink-300">
            <h2 className="text-3xl font-bold mb-4 text-pink-200 font-display">探索新天地</h2>
            <input
              type="text"
              value={newSubredditName}
              onChange={(e) => setNewSubredditName(e.target.value)}
              placeholder="输入 Subreddit 名称"
              className="bg-purple-800 text-white border-2 border-pink-300 p-3 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-purple-300"
            />
            <button 
              onClick={handleAddSubreddit} 
              className="bg-pink-500 text-white p-3 rounded-lg w-full hover:bg-pink-600 transition-colors duration-300 font-bold transform hover:scale-105"
            >
              开启冒险
            </button>
            {error && <p className="text-pink-300 mt-2 font-semibold">{error}</p>}
          </div>
        </Modal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {subreddits.map((subreddit: Subreddit) => (
            <Link href={`/subreddit/${subreddit.name}`} key={subreddit.id} className="no-underline transform hover:scale-105 transition duration-300">
              <SubredditCard
                name={subreddit.name}
                description={subreddit.description}
                subscribers={subreddit.subscribers}
              />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}