import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { Movie } from "@/types/types";

interface UpdateMoviePayload {
  id: string;
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  thumbnailCloudinaryId?: string | null;
  videoUrl?: string;
  cloudinaryId?: string;
  duration?: number | null;
  releaseYear?: number | null;
  maturityRating?: string;
  isFeatured?: boolean;
  isTrending?: boolean;
}

const updateMovie = async ({
  id,
  ...data
}: UpdateMoviePayload): Promise<Movie> => {
  const response = await axios.patch(`/api/movies/${id}`, data);
  return response.data;
};

const useUpdateMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMovie,
    onSuccess: (_updatedMovie, variables) => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      queryClient.invalidateQueries({ queryKey: ["movie", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["featuredMovies"] });
      queryClient.invalidateQueries({ queryKey: ["trendingMovies"] });
    },
  });
};

export default useUpdateMovie;