import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useProfileContext } from "@/context/profileContext";
import type { Profile } from "@/types/types";
import toast from "react-hot-toast";

const useDeleteProfile = () => {
  const queryClient = useQueryClient();
  const { activeProfileId, clearActiveProfile } = useProfileContext();

  return useMutation({
    mutationFn: async (profileId: string): Promise<void> => {
      await axios.delete(`/api/profiles/${profileId}`);
    },

    onSuccess: async (_data, profileId) => {
      await queryClient.cancelQueries({ queryKey: ["profiles"] });

      queryClient.setQueryData<Profile[]>(["profiles"], (profiles) =>
        profiles?.filter((profile) => profile.id !== profileId),
      );

      if (activeProfileId === profileId) {
        clearActiveProfile();
      }

      await queryClient.invalidateQueries({ queryKey: ["profiles"] });
      toast.success("Profile deleted.");
    },
    onError: (error) => {
      console.error("Error deleting profile:", error);
      toast.error("Failed to delete profile.");
    },
  });
};

export default useDeleteProfile;