import { useProfileContext } from "@/context/profileContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { myListQueryKey } from "./useFetchMyList";
import { Movie } from "@/types/types";

const useRemoveFromMyList = () => {
  const queryClient = useQueryClient();
  const { activeProfileId } = useProfileContext();

  return useMutation({
    mutationFn: async (movieId: string): Promise<void> => {
      await axios.delete("/api/my-list", {
        data: { movieId, profileId: activeProfileId },
      });
    },

    onMutate: async (movieId) => {
      const key = myListQueryKey(activeProfileId ?? "");
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<Movie[]>(key);
      queryClient.setQueryData<Movie[]>(key, (old = []) =>
        old.filter((m) => m.id !== movieId),
      );
      return { previous, key };
    },

    onError: (_err, _movieId, context) => {
      if (!context) return;

      // If logout cleared this query while the mutation was in flight,
      // do not recreate old-account cache data.
      if (queryClient.getQueryState(context.key) === undefined) return;

      if (context.previous !== undefined) {
        queryClient.setQueryData(context.key, context.previous);
      }
    },
    onSettled: (_data, _error, _movieId, context) => {
      if (!context) return;

      if (queryClient.getQueryState(context.key) === undefined) return;

      queryClient.invalidateQueries({ queryKey: context.key });
    },
  });
};

export default useRemoveFromMyList;
