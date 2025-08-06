import { useQuery } from "@tanstack/react-query";
import api from "./api";

const fetchUser = async () => {
  const res = await api.get("/contacts");
  return res.data;
};

export const useUsers = () =>
  useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    refetchOnWindowFocus:false
  });

  
