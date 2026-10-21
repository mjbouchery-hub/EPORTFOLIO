import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const Posts = () => {
  const { id: initialId } = useParams();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState(initialId ?? "");
  const [error, setError] = useState("");

  async function fetchPosts(userId) {
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.get(
        "https://jsonplaceholder.typicode.com/posts",
        { params: { userId } },
      );

      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
      setError("Unable to load posts. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function onSearch(event) {
    event.preventDefault();

    if (loading || !searchId.trim()) return;

    fetchPosts(searchId);
  }

  useEffect(() => {
    setSearchId(initialId ?? "");
    fetchPosts(initialId ?? "");
  }, [initialId]);

  return (
    <>
      <div className="post__search">
        <button onClick={() => navigate('/')}>← Back</button>

        <form className="post__search--container" onSubmit={onSearch}>
          <label htmlFor="search-id" className="post__search--label">
            Search by Id
          </label>

          <input
            id="search-id"
            type="number"
            min="1"
            value={searchId}
            onChange={(event) => setSearchId(event.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            Enter
          </button>
        </form>
      </div>

      {error && <p role="alert">{error}</p>}

      {loading
        ? new Array(10).fill(0).map((_, index) => (
            <div className="post" key={index}>
              <div className="post__title">
                <div className="post__title--skeleton"></div>
              </div>
              <div className="post__body">
                <p className="post__body--skeleton"></p>
              </div>
            </div>
          ))
        : posts.map((post) => (
            <div className="post" key={post.id}>
              <div className="post__title">{post.title}</div>
              <p className="post__body">{post.body}</p>
            </div>
          ))}
    </>
  );
};

export default Posts;