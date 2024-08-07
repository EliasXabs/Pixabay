// pages/home.tsx
import { useEffect, useState } from 'react';
import { addFavorite, deleteFavorite, getTopFavorites } from '../api';
import MediaCard from '../components/mediacard';
import Cookies from 'js-cookie';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const HomePage = () => {
  const [topFavorites, setTopFavorites] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const accessToken = Cookies.get('accessToken');

  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) {
        console.warn('No access token found');
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        const data = await getTopFavorites(accessToken);
        console.log('Fetched top favorites data:', data);

        if (data && data.length > 0) {
          setTopFavorites(data);

          const favoriteIds = data.map((item: any) => item.mediaId);
          const favoriteMap = favoriteIds.reduce(
            (acc: { [key: number]: boolean }, id: number) => {
              acc[id] = true;
              return acc;
            },
            {}
          );
          setFavorites(favoriteMap);
        } else {
          console.warn('No top favorites found');
        }
      } catch (err) {
        console.error('Error fetching top favorites:', err);
        setError('Failed to load top favorites');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken]);

  const toggleFavorite = async (media: any) => {
    if (!accessToken) {
      console.warn('No access token found');
      return;
    }
    const isCurrentlyFavorite = favorites[media.mediaId];

    try {
      if (isCurrentlyFavorite) {
        await deleteFavorite(accessToken, media.mediaId);
      } else {
        await addFavorite(
          accessToken,
          media.mediaId,
          media.mediaUrl.includes('.mp4') ? 'video' : 'image',
          media.mediaUrl
        );
      }

      setFavorites((prevFavorites) => ({
        ...prevFavorites,
        [media.mediaId]: !isCurrentlyFavorite,
      }));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  console.log('Rendering top favorites:', topFavorites);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">Top Favorites</h1>
      <div className="w-full max-w-5xl mx-auto">
        <Carousel>
          <CarouselContent className="flex">
            {topFavorites.map((media) => (
              <CarouselItem key={media.mediaId} className="max-w-80 mx-auto">
                <MediaCard
                  media={{
                    id: media.mediaId,
                    webformatURL: media.mediaUrl,
                    isVideo: media.mediaUrl.includes('.mp4'),
                    videos: {
                      medium: {
                        url: media.mediaUrl,
                      },
                    },
                  }}
                  isFavorite={favorites[media.mediaId]}
                  toggleFavorite={toggleFavorite}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};

export default HomePage;
