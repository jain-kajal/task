import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./api";

const deleteUser = async (id) => {
  const res = await api.delete(`/contacts/${id}`);
  return res;
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};
