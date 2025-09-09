import React from "react";

// Summary: Search component for user to input movie search terms
const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search">
      <div>
        <img src="search.svg" alt="search" />
        <input
          type="text"
          placeholder="Search movies"
          value={searchTerm} // Shows the current searchTerm as its value
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term state on input change
        />
      </div>
    </div>
  );
};

export default Search;
