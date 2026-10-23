import { Link, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";

function Nav({ setMovies, setLoading, setError }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("The Matrix");
  const activeRequest = useRef(null);

  const loadMovies = useCallback(async (query) => {
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;

    try {
      const params = new URLSearchParams({
        apikey: import.meta.env.VITE_OMDB_API_KEY,
        s: query,
        type: "movie",
      });
      const response = await fetch(`https://www.omdbapi.com/?${params}`, {
        signal: controller.signal,
      });
      if (!response.ok) {
        throw new Error("Unable to reach the movie service.");
      }
      const data = await response.json();
      if (data.Response === "False") {
        throw new Error(data.Error || "No movies found.");
      }
      if (!controller.signal.aborted) {
        setMovies(data.Search ?? []);
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        setError(error.message || "Unable to load movies. Please try again.");
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [setMovies, setLoading, setError]);

  useEffect(() => {
    loadMovies("The Matrix");
    return () => activeRequest.current?.abort();
  }, [loadMovies]);

  function handleSearch(event) {
    event.preventDefault();
    const query = searchTerm.trim();
    if (!query) return;
    setLoading(true);
    setError("");
    setMovies([]);
    navigate("/");
    loadMovies(query);
  }
  return (
    <>
      <nav className="nav" aria-label="Primary navigation">
        <Link className="logo" to="/" aria-label="MovieScope home">
          <span className="logo-mark" aria-hidden="true">
            <svg viewBox="0 0 64 48" focusable="false">
              <path className="clapper-arm" d="M11 10 50 2l3 10-39 8z" />
              <path className="clapper-arm-cut" d="M20 8 27 6l7 9-7 2z" />
              <path className="clapper-arm-cut" d="M38 4 45 3l7 9-7 1z" />
              <path className="clapper-hinge" d="M9 17h10l-6 10H7z" />
              <path className="clapper-body" d="M10 21h44v22H10z" />
              <path className="clapper-top-row" d="M10 21h44v8H10z" />
              <path className="clapper-body-cut" d="M18 21h10l-7 8H11z" />
              <path className="clapper-body-cut" d="M38 21h10l-7 8H31z" />
            </svg>
          </span>
          <span>MovieScope</span>
        </Link>

        <div className="nav-links">
          <Link to="/#results">Browse</Link>
          <Link to="/#filters">Filters</Link>
        </div>
      </nav>

      <section className="hero" aria-labelledby="hero-title">
        <p className="eyebrow">Search thousands of movies instantly.</p>

        <h1 id="hero-title">Discover your next movie</h1>

        <form className="search-form" id="search-form" onSubmit={handleSearch}>
          <label className="sr-only" htmlFor="search-input">
            Search movie title
          </label>

          <input
            id="search-input"
            name="search"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by movie title..."
            autoComplete="off"
          />

          <button type="submit" aria-label="Search movies">
            <span aria-hidden="true">Search</span>
          </button>
        </form>
      </section>
    </>
  );
}

export default Nav;
