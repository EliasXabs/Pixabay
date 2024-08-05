import { useState, useEffect } from 'react';
import axios from 'axios';
import Masonry from 'react-masonry-css';
import { shuffleArray } from '../lib/shufflearray';
import SearchBar from '../components/searchbar';
import { withAuth } from '@/lib/authhelpers';
import { GetServerSideProps } from 'next';

const ExplorePage = () => {
  const [query, setQuery] = useState(''); // Query input state
  const [searchQuery, setSearchQuery] = useState(''); // State for search execution
  const [results, setResults] = useState<any[]>([]);
  const [randomResults, setRandomResults] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    mediaType: 'both',
    imageType: 'all',
    orientation: 'all',
    category: 'all',
    colors: 'all',
    order: 'popular',
    open: false,
  });

  // Fetch random images and videos on initial render
  useEffect(() => {
    const fetchRandomContent = async () => {
      try {
        const randomImageResponse = await axios.get(
          `https://pixabay.com/api/?key=${process.env.NEXT_PUBLIC_API_KEY}&per_page=30&image_type=photo`
        );
        const randomVideoResponse = await axios.get(
          `https://pixabay.com/api/videos/?key=${process.env.NEXT_PUBLIC_API_KEY}&per_page=20`
        );

        const combinedRandomResults = shuffleArray([
          ...randomImageResponse.data.hits,
          ...randomVideoResponse.data.hits.map((video: any) => ({
            ...video,
            isVideo: true,
          })),
        ]).slice(0, 50);

        setRandomResults(combinedRandomResults);
      } catch (error) {
        console.error('Error fetching random content:', error);
      }
    };

    fetchRandomContent();
  }, []);

  const fetchSearchResults = async (currentPage: number) => {
    try {
      let images: any[] = [];
      let videos: any[] = [];
      const itemsPerPage = 50;
      let imageTotalHits = 0;
      let videoTotalHits = 0;

      if (filters.mediaType !== 'videos') {
        const imageResponse = await axios.get(
          `https://pixabay.com/api/?key=${process.env.NEXT_PUBLIC_API_KEY}&q=${encodeURIComponent(
            searchQuery
          )}&image_type=${filters.imageType}&orientation=${
            filters.orientation
          }&category=${filters.category}&colors=${filters.colors}&order=${
            filters.order
          }&page=${currentPage}&per_page=${filters.mediaType === 'both' ? 35 : 50}`
        );
        images = imageResponse.data.hits;
        imageTotalHits = imageResponse.data.totalHits;
      }

      if (filters.mediaType !== 'images') {
        const videoResponse = await axios.get(
          `https://pixabay.com/api/videos/?key=${process.env.NEXT_PUBLIC_API_KEY}&q=${encodeURIComponent(
            searchQuery
          )}&video_type=all&order=${filters.order}&page=${currentPage}&per_page=${
            filters.mediaType === 'both' ? 15 : 50
          }`
        );
        videos = videoResponse.data.hits.map((video: any) => ({
          ...video,
          isVideo: true,
        }));
        videoTotalHits = videoResponse.data.totalHits;
      }

      const combinedResults = shuffleArray([...images, ...videos]).slice(0, itemsPerPage);

      setResults(combinedResults);
      setTotalPages(
        Math.ceil(
          Math.max(
            imageTotalHits / (filters.mediaType === 'both' ? 35 : 50),
            videoTotalHits / (filters.mediaType === 'both' ? 15 : 50)
          )
        )
      );
    } catch (error) {
      console.error('Error fetching data from Pixabay:', error);
    }
  };

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (query.trim() === '') return;

    setPage(1);
    setSearchQuery(query); // Update searchQuery to trigger search execution
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
      const newPage = page + 1;
      setPage(newPage);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
    }
  };

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      fetchSearchResults(page);
    }
  }, [page, searchQuery, filters]); // Only search when searchQuery changes

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-5xl mx-auto p-4">
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
            <span className="text-gray-700">
              Page {page} of {totalPages}
            </span>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  return withAuth(context);
};

export default ExplorePage;