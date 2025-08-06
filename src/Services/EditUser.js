import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./api";

const editUser = async (updaedUser) => {
  const res = await api.put(`/contacts/${updaedUser.id}`, updaedUser);
  return res.data;
};

export const useEditUSer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};
