import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const useDeleteMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (movieId: string) => {
      await axios.delete(`/api/movies/${movieId}`);
    },
   onSuccess: (_data, movieId) => {
  queryClient.invalidateQueries({ queryKey: ["movies"] });
  queryClient.invalidateQueries({ queryKey: ["featuredMovies"] });
  queryClient.invalidateQueries({ queryKey: ["trendingMovies"] });
  queryClient.invalidateQueries({ queryKey: ["movie", movieId] });
  queryClient.invalidateQueries({ queryKey: ["my-list"] });

  toast.success("Movie deleted.");
},
onError: (error) => {
  console.error("Error deleting movie:", error);
  toast.error("Failed to delete movie.");
},
  });
};

export default useDeleteMovie;
