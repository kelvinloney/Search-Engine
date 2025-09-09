import React from "react";

// Summary: MovieCard component to display individual movie details such as title, rating, poster, release year, and language
const MovieCard = ({
  movie: { title, vote_average, poster_path, release_date, original_language }, // Receives a movie object as prop and destructures it to get title, rating, poster, release year, and language
}) => {
  return (
    <div className="movie-card">
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500/${poster_path}`
            : `/no-movie.png`
        }
        alt={title}
      />
      <div className="mt-4">
        <h3>{title}</h3> {/* Movie title */}
      </div>

      {/* Movie details: rating, language, and release year */}
      <div className="content">
        <div className="rating">
          <img src="./star.svg" alt="Star Icon" />
          <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>{" "}
          {/* The movie’s average vote/rating (to one decimal place, or "N/A" if not available) */}
        </div>
        <span>•</span>
        <p className="lang">{original_language}</p>{" "}
        {/* Movie original language */}
        <span>•</span>
        <p className="year">
          {release_date ? release_date.split("-")[0] : "N/A"}{" "}
          {/* Movie release year (extracted from release_date or "N/A" if not available) */}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
