import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const useDeleteMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (movieId: string) => {
      await axios.delete(`/api/movies/${movieId}`);
    },
    onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ["movies"] });
  toast.success("Movie deleted.");
},
onError: (error) => {
  console.error("Error deleting movie:", error);
  toast.error("Failed to delete movie.");
},
  });
};

export default useDeleteMovie;
