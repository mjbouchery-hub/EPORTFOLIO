import { useProfileContext } from "@/context/profileContext";
import { Movie } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { myListQueryKey } from "./useFetchMyList";

const useAddToMyList = () => {
  const queryClient = useQueryClient();
  const { activeProfileId } = useProfileContext();

  return useMutation({
    mutationFn: async (movie: Movie) => {
      await axios.post("/api/my-list", {
        profileId: activeProfileId,
        movieId: movie.id,
      });
    },
    onMutate: async (movie: Movie) => {
      const key = myListQueryKey(activeProfileId ?? "");
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<Movie[]>(key);
      queryClient.setQueryData<Movie[]>(key, (old = []) => [...old, movie]);

      return { previous, key };
    },
    onError: (_err, _movie, context) => {
      if (!context) return;

      // If logout cleared this query while the mutation was in flight,
      // do not recreate old-account cache data.
      if (queryClient.getQueryState(context.key) === undefined) return;

      if (context.previous !== undefined) {
        queryClient.setQueryData<Movie[]>(context.key, context.previous);
      }
    },
    onSettled: (_data, _error, _movie, context) => {
      if (!context) return;

      if (queryClient.getQueryState(context.key) === undefined) return;

      queryClient.invalidateQueries({ queryKey: context.key });
    },
  });
};

export default useAddToMyList;
