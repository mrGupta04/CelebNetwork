import Link from 'next/link';
import React from 'react';

interface Celebrity {
  id: string;
  name: string;
  imageUrl?: string;
  category: string;
  country: string;
  fanbase: number;
}

interface CelebrityCardProps {
  celebrity: Celebrity;
}

const CelebrityCard: React.FC<CelebrityCardProps> = ({ celebrity }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={celebrity.imageUrl || '/images/default-avatar.jpg'}
          alt={celebrity.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-transparent to-transparent px-4 py-2">
          <h3 className="text-white text-lg font-semibold">{celebrity.name}</h3>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 space-y-3">
        {/* Category & Country */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full w-fit">
              {celebrity.category}
            </span>
            <span className="mt-1 text-gray-500 text-sm flex items-center">
              <svg
                className="w-4 h-4 mr-1 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              {celebrity.country}
            </span>
          </div>

          {/* Fanbase */}
          <div className="text-right">
            <p className="text-xs text-gray-400">Fanbase</p>
            <p className="text-indigo-600 font-semibold text-sm">
              {celebrity.fanbase.toLocaleString()}
            </p>
          </div>
        </div>

        {/* View Profile Button */}
        <Link href={`/celebrity/${celebrity.id}`}>
          <button className="w-full mt-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
            View Profile
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CelebrityCard;
