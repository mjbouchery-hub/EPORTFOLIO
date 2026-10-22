import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMovie() {
      setLoading(true);
      setError("");
      setMovie(null);

      try {
        const params = new URLSearchParams({
          apikey: import.meta.env.VITE_OMDB_API_KEY,
          i: id,
          plot: "full",
        });

        const response = await fetch(`https://www.omdbapi.com/?${params}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to reach the movie service.");
        }

        const data = await response.json();

        if (data.Response === "False") {
          throw new Error(data.Error || "Movie not found.");
        }

        if (!controller.signal.aborted) {
          setMovie(data);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setError(error.message || "Unable to load movie details.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchMovie();

    return () => controller.abort();
  }, [id]);
  return (
    <>
      <Link to="/">← Back to results</Link>

      {loading && <p role="status">Loading movie details…</p>}

      {error && <p role="alert">{error}</p>}

      {movie && (
  <article className="movie-details">
    {movie.Poster && movie.Poster !== "N/A" && (
      <img
        className="movie-details__poster"
        src={movie.Poster}
        alt={`${movie.Title} poster`}
      />
    )}

    <div className="movie-details__content">
      <h2>{movie.Title}</h2>
      <p>
        {movie.Year} · {movie.Rated} · {movie.Runtime}
      </p>

      <p>{movie.Plot}</p>

      <dl className="movie-meta">
        <div>
          <dt>Genre</dt>
          <dd>{movie.Genre}</dd>
        </div>
        <div>
          <dt>Director</dt>
          <dd>{movie.Director}</dd>
        </div>
        <div>
          <dt>Actors</dt>
          <dd>{movie.Actors}</dd>
        </div>
        <div>
          <dt>IMDb rating</dt>
          <dd>{movie.imdbRating}</dd>
        </div>
        <div>
          <dt>Awards</dt>
          <dd>{movie.Awards}</dd>
        </div>
      </dl>
    </div>
  </article>
)}
    </>
  );
}

export default MovieDetails;
