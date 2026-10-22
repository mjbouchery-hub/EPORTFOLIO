import { useOutletContext } from "react-router-dom";
import MovieCard from "../components/MovieCard";

function Home() {
  const { movies, loading, error, sortBy, setSortBy } = useOutletContext();
  

  const sortedMovies = [...movies].sort((a, b) => {
    switch (sortBy) {
      case "title-asc":
        return a.Title.localeCompare(b.Title);
      case "title-desc":
        return b.Title.localeCompare(a.Title);
      case "date-desc":
        return parseInt(b.Year, 10) - parseInt(a.Year, 10);
      case "date-asc":
        return parseInt(a.Year, 10) - parseInt(b.Year, 10);
      default:
        return 0;
    }
  });

  return (
    <>
      <section className="toolbar" id="filters" aria-label="Movie filters">
        <div>
          <p className="section-kicker">Results</p>
          <h2 id="results-heading">Search results</h2>
        </div>

        <label className="sort-control" htmlFor="sort-select">
          <span>Sort by</span>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="relevance">Best match</option>
            <option value="title-asc">Title: A to Z</option>
            <option value="title-desc">Title: Z to A</option>
            <option value="date-desc">Release date: newest</option>
            <option value="date-asc">Release date: oldest</option>
          </select>
        </label>
      </section>

      <section
        className={`status${error ? " error" : ""}`}
        id="status"
        role="status"
        aria-live="polite"
      >
        {loading
          ? "Loading movies…"
          : error
            ? error
            : movies.length > 0
              ? `${movies.length} movies displayed.`
              : "Search for a movie to get started."}
      </section>

      <section
        className="movie-grid"
        id="results"
        aria-label="Movie search results"
        aria-busy={loading}
      >
        {loading
          ? Array.from({ length: 6 }, (_, index) => (
              <div className="movie-card" key={index} aria-hidden="true">
                <div className="skeleton poster" />
                <div className="movie-content">
                  <div className="skeleton line long" />
                  <div className="skeleton line short" />
                </div>
              </div>
            ))
          : sortedMovies.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
      </section>
    </>
  );
}

export default Home;
