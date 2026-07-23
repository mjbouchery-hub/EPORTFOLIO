(function () {
  /* ========================
     POSTER FALLBACK
  ======================== */

  const PLACEHOLDER_POSTER =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='380' height='562' viewBox='0 0 380 562'%3E%3Crect width='380' height='562' fill='%231b2234'/%3E%3Cpath d='M86 132h208v298H86z' fill='%232f3a55'/%3E%3Ccircle cx='190' cy='255' r='54' fill='%236f7cff'/%3E%3Cpath d='M174 226l58 29-58 29z' fill='white'/%3E%3Ctext x='190' y='462' fill='%23d9defa' font-family='Arial' font-size='24' text-anchor='middle'%3ENo Poster%3C/text%3E%3C/svg%3E";

  /* ========================
     STATUS MESSAGE
  ======================== */

  function setStatus(message, tone) {
    const status = document.querySelector("#status");
    status.textContent = message || "";
    status.className = tone ? `status ${tone}` : "status";
  }

  /* ========================
     LOADING SKELETONS
  ======================== */

  function renderSkeletons(count) {
    const results = document.querySelector("#results");
    results.innerHTML = Array.from(
      { length: count },
      () => `
        <article class="movie-card skeleton-card" aria-hidden="true">
          <div class="skeleton poster"></div>
          <div class="movie-content">
            <div class="skeleton line long"></div>
            <div class="skeleton line"></div>
            <div class="skeleton line short"></div>
          </div>
        </article>
      `
    ).join("");
  }

  /* ========================
     MOVIE RESULTS
  ======================== */

  function renderMovies(movies) {
    const results = document.querySelector("#results");

    if (!movies.length) {
      results.innerHTML = "";
      setStatus("No movies found. Try another title.", "notice");
      return;
    }

    results.innerHTML = movies.map(createMovieCard).join("");
  }

  /* ========================
     MOVIE CARD TEMPLATE
  ======================== */

  function createMovieCard(movie) {
    const rating = movie.rating ? `${movie.rating.toFixed(1)}/10` : "Not rated";
    const released = movie.released && movie.released !== "N/A" ? movie.released : movie.year;

    return `
      <article class="movie-card">
        <img src="${movie.poster || PLACEHOLDER_POSTER}" alt="${escapeHtml(movie.title)} poster" loading="lazy" />
        <div class="movie-content">
          <div class="movie-heading">
            <h3>${escapeHtml(movie.title)}</h3>
            <span>${escapeHtml(movie.year)}</span>
          </div>
          <dl class="movie-meta">
            <div>
              <dt>Rating</dt>
              <dd>${rating}</dd>
            </div>
            <div>
              <dt>Tomatoes</dt>
              <dd>${escapeHtml(movie.rottenTomatoes || "N/A")}</dd>
            </div>
            <div>
              <dt>Released</dt>
              <dd>${escapeHtml(released)}</dd>
            </div>
            <div>
              <dt>Runtime</dt>
              <dd>${escapeHtml(movie.runtime || "N/A")}</dd>
            </div>
          </dl>
          <p>${escapeHtml(movie.genre || "Genre unavailable")}</p>
        </div>
      </article>
    `;
  }

  /* ========================
     HTML SAFETY HELPER
  ======================== */

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  /* ========================
     PUBLIC UI HELPERS
  ======================== */

  window.movieUi = {
    renderMovies,
    renderSkeletons,
    setStatus,
  };
})();
