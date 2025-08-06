import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./api";

const addUser = async (newUser) => {
  const res = await api.post("/contacts", newUser);
  return res.data;
};

export const useAddUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};
