import React from 'react';

interface SubredditCardProps {
  name: string;
  description: string;
  subscribers: number;
}

export const SubredditCard: React.FC<SubredditCardProps> = ({ name, description, subscribers }) => {
  return (
    <div className="bg-gray-800 shadow-lg rounded-2xl p-6 hover:shadow-xl transition-shadow duration-300 relative h-48">
      <div className="absolute top-4 right-4 text-sm text-gray-400">
        订阅者: {subscribers.toLocaleString()}
      </div>
      <h2 className="text-xl font-bold mb-2 text-gray-100 pr-24">{name}</h2>
      <p className="text-gray-300 line-clamp-2 h-12 overflow-hidden">
        {description}
      </p>
    </div>
  );
};