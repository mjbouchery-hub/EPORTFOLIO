import { useState } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Nav from "./Nav";

function Layout() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("relevance");

  return (
    <>
      <header className="site-header">
        <Nav
          setMovies={setMovies}
          setLoading={setLoading}
          setError={setError}
        />
      </header>

      <main>
        <Outlet context={{ movies, loading, error, sortBy, setSortBy }} />
      </main>

      <Footer />
    </>
  );
}

export default Layout;
