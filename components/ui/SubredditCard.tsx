import React from 'react';
import { Users } from 'lucide-react';

interface SubredditCardProps {
  name: string;
  description: string;
  subscribers: number;
}

export const SubredditCard: React.FC<SubredditCardProps> = ({ name, description, subscribers }) => {
  return (
    <div className="bg-purple-900 bg-opacity-80 shadow-lg rounded-2xl p-6 hover:shadow-xl transition-all duration-300 relative h-48 border border-pink-300 group overflow-hidden">
      <div className="absolute top-4 right-4 text-sm text-pink-300 flex items-center">
        <Users size={16} className="mr-1" />
        {subscribers.toLocaleString()}
      </div>
      <h2 className="text-xl font-bold mb-2 text-pink-200 pr-24 font-display group-hover:text-white transition-colors duration-300">{name}</h2>
      <p className="text-purple-200 line-clamp-2 h-12 overflow-hidden group-hover:text-pink-100 transition-colors duration-300">
        {description}
      </p>
      <div className="absolute bottom-4 right-4 text-sm text-pink-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold">
        点击探索 →
      </div>
    </div>
  );
};