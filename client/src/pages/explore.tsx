// pages/explore.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import Masonry from 'react-masonry-css';
import { shuffleArray } from '../lib/shufflearray';
import SearchBar from '../components/searchbar';
import MediaCard from '../components/mediacard';
import { getFavoriteIds, addFavorite, deleteFavorite } from '../api';
import Cookies from 'js-cookie';

const ExplorePage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [randomResults, setRandomResults] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});
  const [filters, setFilters] = useState({
    mediaType: 'both',
    imageType: 'all',
    orientation: 'all',
    category: 'all',
    colors: 'all',
    order: 'popular',
    open: false,
  });

  const accessToken = Cookies.get('accessToken');

  useEffect(() => {
    const fetchRandomContent = async () => {
      try {
        const randomImageResponse = await axios.get(
          `https://pixabay.com/api/?key=${process.env.NEXT_PUBLIC_API_KEY}&per_page=20&image_type=photo`
        );
        const randomVideoResponse = await axios.get(
          `https://pixabay.com/api/videos/?key=${process.env.NEXT_PUBLIC_API_KEY}&per_page=10`
        );

        const combinedRandomResults = shuffleArray([
          ...randomImageResponse.data.hits,
          ...randomVideoResponse.data.hits.map((video: any) => ({
            ...video,
            isVideo: true,
          })),
        ]);

        setRandomResults(combinedRandomResults);
      } catch (error) {
        console.error('Error fetching random content:', error);
      }
    };

    fetchRandomContent();
  }, []);

  useEffect(() => {
    const fetchFavoriteIds = async () => {
      if (!accessToken) return;
      try {
        const favoriteIds = await getFavoriteIds(accessToken);
        const favoriteMap = favoriteIds.reduce(
          (acc: { [key: number]: boolean }, id: number) => {
            acc[id] = true;
            return acc;
          },
          {}
        );
        setFavorites(favoriteMap);
      } catch (error) {
        console.error('Error fetching favorite IDs:', error);
      }
    };

    fetchFavoriteIds();
  }, [accessToken]);

  const fetchSearchResults = async () => {
    try {
      let images: any[] = [];
      let videos: any[] = [];

      if (filters.mediaType !== 'videos') {
        const imageResponse = await axios.get(
          `https://pixabay.com/api/?key=${process.env.NEXT_PUBLIC_API_KEY}&q=${encodeURIComponent(
            query
          )}&image_type=${filters.imageType}&orientation=${
            filters.orientation
          }&category=${filters.category}&colors=${filters.colors}&order=${
            filters.order
          }&page=${page}&per_page=40`
        );
        images = imageResponse.data.hits;
      }

      if (filters.mediaType !== 'images') {
        const videoResponse = await axios.get(
          `https://pixabay.com/api/videos/?key=${process.env.NEXT_PUBLIC_API_KEY}&q=${encodeURIComponent(
            query
          )}&video_type=all&order=${filters.order}&page=${page}&per_page=10`
        );
        videos = videoResponse.data.hits.map((video: any) => ({
          ...video,
          isVideo: true,
        }));
      }

      const combinedResults = shuffleArray([...images, ...videos]);

      setResults(combinedResults);
      setTotalPages(
        Math.ceil(Math.max(images.length / 40, videos.length / 10))
      );
    } catch (error) {
      console.error('Error fetching data from Pixabay:', error);
    }
  };

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (query.trim() === '') return;

    setPage(1);
    await fetchSearchResults();
  };

  const clearFilters = () => {
    setFilters({
      mediaType: 'both',
      imageType: 'all',
      orientation: 'all',
      category: 'all',
      colors: 'all',
      order: 'popular',
      open: false,
    });
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  useEffect(() => {
    if (query.trim() !== '') {
      fetchSearchResults();
    }
  }, [page]);

  useEffect(() => {
    fetchSearchResults();
  }, [filters]);

  const toggleFavorite = async (media: any) => {
    if (!accessToken) return;
    const isCurrentlyFavorite = favorites[media.id];

    try {
      if (isCurrentlyFavorite) {
        await deleteFavorite(accessToken, media.id);
      } else {
        await addFavorite(
          accessToken,
          media.id,
          media.isVideo ? 'video' : 'image',
          media.isVideo ? media.videos.medium.url : media.webformatURL
        );
      }

      setFavorites((prevFavorites) => ({
        ...prevFavorites,
        [media.id]: !isCurrentlyFavorite,
      }));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-5xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Explore</h1>
        <SearchBar
          query={query}
          setQuery={setQuery}
          handleSearch={handleSearch}
          filters={filters}
          setFilters={setFilters}
          clearFilters={clearFilters}
        />
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex w-auto gap-4"
          columnClassName="masonry-grid_column"
        >
          {(results.length > 0 ? results : randomResults).map((result: any) => (
            <MediaCard
              key={result.id}
              media={result}
              isFavorite={favorites[result.id]}
              toggleFavorite={toggleFavorite}
            />
          ))}
        </Masonry>

        {results.length > 0 && (
          <div className="flex justify-between mt-6">
            <button
              onClick={handlePreviousPage}
              disabled={page === 1}
              className={`bg-gray-500 text-white py-2 px-4 rounded ${
                page === 1
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-600'
              }`}
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className={`bg-gray-500 text-white py-2 px-4 rounded ${
                page === totalPages
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-600'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
