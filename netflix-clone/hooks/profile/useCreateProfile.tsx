import { Profile } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

interface CreateProfileInput {
  name: string;
  isKids?: boolean;
}

const useCreateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateProfileInput): Promise<Profile> => {
      const { data } = await axios.post("/api/profiles", input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      toast.success("Profile created successfully.");
    },
    onError: (error) => {
      console.error("Error creating profile:", error);
      toast.error("Failed to create profile.");
    },
  });
};

export default useCreateProfile;
