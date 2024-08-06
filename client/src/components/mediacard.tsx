// components/MediaCard.tsx
import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

interface MediaCardProps {
  media: any; // You can replace 'any' with a more specific type if available
  isFavorite: boolean;
  toggleFavorite: (media: any) => void;
}

const MediaCard: React.FC<MediaCardProps> = ({
  media,
  isFavorite,
  toggleFavorite,
}) => {
  const handleFavoriteClick = () => {
    toggleFavorite(media);
  };

  return (
    <div className="relative bg-white rounded-lg shadow-sm overflow-hidden mb-4 group">
      {media.isVideo ? (
        <video controls className="w-full h-auto">
          <source src={media.videos.medium.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <img
          src={media.webformatURL}
          alt={media.tags}
          className="w-full h-auto"
        />
      )}
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-90 transition-opacity pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-90 transition-opacity pointer-events-none"></div>
      {/* Heart Icon */}
      <div
        className={`absolute top-2 right-2 cursor-pointer text-white transition-opacity ${
          isFavorite ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
        onClick={handleFavoriteClick}
      >
        {isFavorite ? (
          <FaHeart className="text-red-500" size={24} />
        ) : (
          <FaRegHeart className="text-white" size={24} />
        )}
      </div>
    </div>
  );
};

export default MediaCard;
