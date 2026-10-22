import { Link } from "react-router-dom";

function MovieCard({ movie }) {
  return (
    <article className="movie-card">
      <Link to={`/movies/${movie.imdbID}`}>
        {movie.Poster && movie.Poster !== "N/A" ? (
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
        ) : (
          <div className="skeleton poster" aria-label="Poster unavailable" />
        )}

        <div className="movie-content">
          <div className="movie-heading">
            <h3>{movie.Title}</h3>
            <span>{movie.Year}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default MovieCard;