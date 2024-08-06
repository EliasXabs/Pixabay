// src/pages/profile.tsx
import { useEffect, useState } from 'react';
import { getProfile, getFavorites, deleteFavorite } from '../api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import Masonry from 'react-masonry-css';
import MediaCard from '../components/mediacard';
import { GetServerSideProps } from 'next';
import { withAuth } from '../lib/authhelpers';

interface UserProfile {
  id: number;
  username: string;
  email: string;
}

interface Favorite {
  id: number;
  url: string;
  mediaType: 'image' | 'video';
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'favorites' | 'collections'>(
    'favorites'
  );
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const accessToken = Cookies.get('accessToken');
      if (!accessToken) {
        router.push('/auth');
        return;
      }

      try {
        const userProfile = await getProfile(accessToken);
        setProfile(userProfile);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch profile');
        setLoading(false);
      }
    };

    const fetchFavorites = async () => {
      const accessToken = Cookies.get('accessToken');
      if (!accessToken) {
        router.push('/auth');
        return;
      }

      try {
        const favoriteData = await getFavorites(accessToken);
        setFavorites(favoriteData);
      } catch (err) {
        console.error('Error fetching favorites:', err);
      }
    };

    fetchProfile();
    fetchFavorites();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleUnfavorite = async (id: number) => {
    const accessToken = Cookies.get('accessToken');
    if (!accessToken) {
      router.push('/auth');
      return;
    }

    try {
      await deleteFavorite(accessToken, id);
      setFavorites((prevFavorites) =>
        prevFavorites.filter((favorite) => favorite.id !== id)
      );
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  };

  const handleTabClick = (tab: 'favorites' | 'collections') => {
    setActiveTab(tab);
  };

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center mb-8">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <p>
          <strong>Username:</strong> {profile?.username}
        </p>
        <p>
          <strong>Email:</strong> {profile?.email}
        </p>
      </div>

      <div className="w-full max-w-md flex flex-col items-center mb-6">
        <div className="flex justify-center space-x-8">
          <div
            className={`cursor-pointer pb-2 ${
              activeTab === 'favorites'
                ? 'text-blue-500 font-semibold'
                : 'text-gray-700'
            }`}
            onClick={() => handleTabClick('favorites')}
          >
            Favorites
          </div>
          <div
            className={`cursor-pointer pb-2 ${
              activeTab === 'collections'
                ? 'text-blue-500 font-semibold'
                : 'text-gray-700'
            }`}
            onClick={() => handleTabClick('collections')}
          >
            Collections
          </div>
        </div>
        <div className="w-full flex justify-center mt-2">
          <div
            className="h-0.5 bg-blue-500"
            style={{
              width: '10%',
            }}
          ></div>
        </div>
      </div>

      <div className="w-full max-w-5xl">
        {activeTab === 'favorites' && (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex w-auto gap-4"
            columnClassName="masonry-grid_column"
          >
            {favorites.map((favorite) => (
              <MediaCard
                key={favorite.id}
                media={{
                  id: favorite.id,
                  webformatURL: favorite.url,
                  isVideo: favorite.mediaType === 'video',
                  videos: {
                    medium: {
                      url: favorite.url,
                    },
                  },
                }}
                isFavorite={true}
                toggleFavorite={() => handleUnfavorite(favorite.id)}
              />
            ))}
          </Masonry>
        )}
        {activeTab === 'collections' && (
          <div className="text-center">
            <p>Collections content goes here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    return withAuth(context);
  };

export default ProfilePage;
