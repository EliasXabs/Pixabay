// pages/explore.tsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import Masonry from 'react-masonry-css';

const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const ExplorePage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [randomResults, setRandomResults] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch random images and videos on initial render
  useEffect(() => {
    const fetchRandomContent = async () => {
      setLoading(true);
      try {
        const randomImageResponse = await axios.get(
          `https://pixabay.com/api/?key=${process.env.NEXT_PUBLIC_API_KEY}&per_page=50&image_type=photo`
        );
        const randomVideoResponse = await axios.get(
          `https://pixabay.com/api/videos/?key=${process.env.NEXT_PUBLIC_API_KEY}&per_page=20`
        );

        // Combine images and videos and shuffle the array
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
      setLoading(false);
    };

    fetchRandomContent();
  }, []);

  const fetchSearchResults = async () => {
    setLoading(true);
    try {
      const imageResponse = await axios.get(
        `https://pixabay.com/api/?key=${process.env.NEXT_PUBLIC_API_KEY}&q=${encodeURIComponent(
          query
        )}&image_type=photo&page=${page}&per_page=50`
      );
      const videoResponse = await axios.get(
        `https://pixabay.com/api/videos/?key=${process.env.NEXT_PUBLIC_API_KEY}&q=${encodeURIComponent(
          query
        )}&page=${page}&per_page=15`
      );

      const combinedResults = shuffleArray([
        ...imageResponse.data.hits,
        ...videoResponse.data.hits.map((video: any) => ({
          ...video,
          isVideo: true,
        })),
      ]);

      setResults(combinedResults);
      setTotalPages(
        Math.ceil(
          Math.max(
            imageResponse.data.totalHits / 10,
            videoResponse.data.totalHits / 5
          )
        )
      );
    } catch (error) {
      console.error('Error fetching data from Pixabay:', error);
    }
    setLoading(false);
  };

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (query.trim() === '') return;

    setPage(1);
    await fetchSearchResults();
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

  const breakpointColumnsObj = {
    default: 5,
    1100: 4,
    700: 2,
    500: 1,
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-5xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Explore</h1>
        <form onSubmit={handleSearch} className="flex justify-end mb-6">
          <input
            type="text"
            placeholder="Search for images or videos"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded-l focus:outline-none max-w-xs"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600 transition-colors"
          >
            Search
          </button>
        </form>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex w-auto gap-4"
            columnClassName="masonry-grid_column"
          >
            {(results.length > 0 ? results : randomResults).map((result: any) => (
              <div
                key={result.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden mb-4"
              >
                {result.isVideo ? (
                  <video controls className="w-full h-auto">
                    <source src={result.videos.medium.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={result.webformatURL}
                    alt={result.tags}
                    className="w-full h-auto"
                  />
                )}
              </div>
            ))}
          </Masonry>
        )}

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
