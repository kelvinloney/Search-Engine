import { useEffect, useState } from "react";
import "./App.css";
import Search from "./components/Search";
import MovieCard from "./components/MovieCard";
import Spinner from "./components/Spinner";
import { useDebounce } from "react-use";
import { updateSearchCount } from "./appwrite";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounces the searchTerm, so the app only fetches movies after the user pauses typing for half a second (500ms)
  // Also, prevents making too many API requests
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]); // uses useDebounce from react-use, After 500ms of no changes to searchTerm, setDebouncedSearchTerm(searchTerm) is called, which triggers the useEffect (below) that fetches movies

  // Summary: Function to fetch and display movies from TMDB API based on user input
  const fetchMovies = async (query = "") => {
    setIsLoading(true); // Show loading spinner
    setErrorMessage(""); // Clear any previous error

    try {
      // Decide which endpoint to use: search or discover
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      // Make the API request
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();

      // Handle TMDB error response
      if (data.Response === "False") {
        setErrorMessage(data.Error || "Failed to fetch movies");
        setMovieList([]);
        return;
      }

      // Set the movie list with results
      setMovieList(data.results || []);

      // Optionally update search count in Appwrite if searching
      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage("Failed to fetch movies. Please try again later.");
    } finally {
      setIsLoading(false); // Hide loading spinner
    }
  };

  // Fetch movies when the debounced search term changes
  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  // Render the main application UI
  // This includes the search bar, search term, movie list, loading spinner and any error messages
  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <br />
        <h1 className="text-white">{searchTerm}</h1>
        <br />

        {searchTerm && (
          <style>{`
            .popular-movies-header {
              display: none !important;
            }
          `}</style>
        )}

        <section className="all-movies">
          <h2 className="popular-movies-header">Popular Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}

          {!isLoading && searchTerm && movieList.length === 0 && (
            <p className="text-red-500 text-2xl font-bold mt-6">
              No matches for “{searchTerm}”
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
