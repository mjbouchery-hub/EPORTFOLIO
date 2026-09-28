import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchFeaturedMovies = async () => {
  const { data } = await axios.get("/api/movies?featured=true");
  return data;
};

const useFetchFeaturedMovies = () => {
  return useQuery({
    queryKey: ["featuredMovies"],
    queryFn: fetchFeaturedMovies,
  });
};

export default useFetchFeaturedMovies;