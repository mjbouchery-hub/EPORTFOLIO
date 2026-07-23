(function () {
  /* ========================
     DOM ELEMENTS
  ======================== */

  const form = document.querySelector("#search-form");
  const searchInput = document.querySelector("#search-input");
  const sortSelect = document.querySelector("#sort-select");
  const resultsHeading = document.querySelector("#results-heading");

  /* ========================
     APP STATE
  ======================== */

  let currentMovies = [];
  let currentQuery = searchInput.value.trim();

  /* ========================
     EVENT LISTENERS
  ======================== */

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();

    if (!query) {
      movieUi.setStatus("Type a movie title to start searching.", "notice");
      searchInput.focus();
      return;
    }

    loadMovies(query);
  });

  sortSelect.addEventListener("change", () => {
    renderSortedMovies();
  });

  /* ========================
     INITIAL MOVIE LOAD
  ======================== */

  loadMovies(currentQuery);

  /* ========================
     FETCH / DISPLAY MOVIES
  ======================== */

  async function loadMovies(query) {
    currentQuery = query;
    currentMovies = [];
    resultsHeading.textContent = ` Results for "${query}"`;
    movieUi.setStatus("Loading movies...");
    movieUi.renderSkeletons(6);

    try {
      currentMovies = await movieApi.searchMovies(query);
      movieUi.setStatus(
        ` ${currentMovies.length} match${currentMovies.length === 1 ? "" : "es"} found.`,
      );
      renderSortedMovies();
    } catch (error) {
      movieUi.renderMovies([]);
      const isEmptySearch = error.message.includes("No movies match");
      movieUi.setStatus(error.message, isEmptySearch ? "notice" : "error");
    }
  }

  /* ========================
     SORTED RENDER
  ======================== */

  function renderSortedMovies() {
    const sortedMovies = [...currentMovies].sort(sortMovies);
    movieUi.renderMovies(sortedMovies);
  }

  /* ========================
     SORTING RULES
  ======================== */

  function sortMovies(a, b) {
    switch (sortSelect.value) {
      case "rating-desc":
        return b.rating - a.rating;
      case "rating-asc":
        return a.rating - b.rating;
      case "date-desc":
        return b.releaseTime - a.releaseTime;
      case "date-asc":
        return a.releaseTime - b.releaseTime;
      default:
        return 0;
    }
  }
})();
