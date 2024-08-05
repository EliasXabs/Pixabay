import React from 'react';

interface FilterProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: (event: React.FormEvent) => void;
  filters: any;
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  clearFilters: () => void;
}

const SearchBar: React.FC<FilterProps> = ({
  query,
  setQuery,
  handleSearch,
  filters,
  setFilters,
  clearFilters,
}) => {
  const toggleFilterDropdown = () => {
    setFilters((prevFilters: any) => ({ ...prevFilters, open: !prevFilters.open }));
  };

  return (
    <div className="flex justify-between mb-6 items-center relative">
      <div className="flex items-center">
        <button
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
          onClick={clearFilters}
        >
          Clear Filters
        </button>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded ml-2 hover:bg-blue-600 transition-colors"
          onClick={toggleFilterDropdown}
        >
          Filters
        </button>
      </div>
      <form onSubmit={handleSearch} className="flex items-center max-w-xs ml-auto">
        <input
          type="text"
          placeholder="Search for images or videos"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded-l focus:outline-none"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600 transition-colors"
        >
          Search
        </button>
      </form>
      {filters.open && (
        <div className="absolute top-0 mt-14 left-0 bg-white p-4 rounded-lg shadow-lg z-10 w-64">
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Media Type</label>
            <select
              value={filters.mediaType}
              onChange={(e) => setFilters({ ...filters, mediaType: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="both">Both</option>
              <option value="images">Images</option>
              <option value="videos">Videos</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Image Type</label>
            <select
              value={filters.imageType}
              onChange={(e) => setFilters({ ...filters, imageType: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="all">All</option>
              <option value="photo">Photo</option>
              <option value="illustration">Illustration</option>
              <option value="vector">Vector</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Orientation</label>
            <select
              value={filters.orientation}
              onChange={(e) => setFilters({ ...filters, orientation: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="all">All</option>
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="all">All</option>
              <option value="fashion">Fashion</option>
              <option value="nature">Nature</option>
              <option value="backgrounds">Backgrounds</option>
              <option value="science">Science</option>
              <option value="education">Education</option>
              <option value="people">People</option>
              <option value="feelings">Feelings</option>
              <option value="religion">Religion</option>
              <option value="health">Health</option>
              <option value="places">Places</option>
              <option value="animals">Animals</option>
              <option value="industry">Industry</option>
              <option value="food">Food</option>
              <option value="computer">Computer</option>
              <option value="sports">Sports</option>
              <option value="transportation">Transportation</option>
              <option value="travel">Travel</option>
              <option value="buildings">Buildings</option>
              <option value="business">Business</option>
              <option value="music">Music</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Colors</label>
            <select
              value={filters.colors}
              onChange={(e) => setFilters({ ...filters, colors: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="all">All</option>
              <option value="grayscale">Grayscale</option>
              <option value="transparent">Transparent</option>
              <option value="red">Red</option>
              <option value="orange">Orange</option>
              <option value="yellow">Yellow</option>
              <option value="green">Green</option>
              <option value="turquoise">Turquoise</option>
              <option value="blue">Blue</option>
              <option value="lilac">Lilac</option>
              <option value="pink">Pink</option>
              <option value="white">White</option>
              <option value="gray">Gray</option>
              <option value="black">Black</option>
              <option value="brown">Brown</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Order</label>
            <select
              value={filters.order}
              onChange={(e) => setFilters({ ...filters, order: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="popular">Popular</option>
              <option value="latest">Latest</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
