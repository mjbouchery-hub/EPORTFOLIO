(function () {
  /* ========================
     API SETTINGS
  ======================== */

  const API_KEY = "bb006640";
  const API_URL = "https://www.omdbapi.com/";

  /* ========================
     API REQUEST HELPER
  ======================== */

  async function requestOmdb(params) {
    const url = new URL(API_URL);
    url.search = new URLSearchParams({
      apikey: API_KEY,
      ...params,
    }).toString();

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("The movie service is unavailable right now.");
    }

    const data = await response.json();

    if (data.Response === "False") {
      const message =
        data.Error === "Movie not found!"
          ? "No movies found. Try another title."
          : data.Error || "No movies found. Try another title.";

      throw new Error(message);
    }

    return data;
  }

  /* ========================
     MOVIE SEARCH
  ======================== */

  async function searchMovies(query) {
    const data = await requestOmdb({
      s: query,
      type: "movie",
      page: "1",
    });

    const firstSix = data.Search.slice(0, 6);
    const details = await Promise.all(
      firstSix.map((movie) =>
        requestOmdb({
          i: movie.imdbID,
          plot: "short",
        })
      )
    );

    return details.map(normalizeMovie);
  }

  /* ========================
     MOVIE DATA CLEANUP
  ======================== */

  function normalizeMovie(movie) {
    const rottenTomatoes = movie.Ratings?.find(
      (rating) => rating.Source === "Rotten Tomatoes"
    )?.Value;

    return {
      id: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      released: movie.Released,
      releaseTime: Date.parse(movie.Released) || 0,
      rating: Number.parseFloat(movie.imdbRating) || 0,
      rottenTomatoes: rottenTomatoes || "N/A",
      runtime: movie.Runtime,
      genre: movie.Genre,
      plot: movie.Plot,
      poster: movie.Poster !== "N/A" ? movie.Poster : "",
    };
  }

  /* ========================
     PUBLIC API
  ======================== */

  window.movieApi = {
    searchMovies,
  };
})();
