import User from "@repositories/user";
import { useQuery } from "react-query";
import { User as TUser } from "@ts-types/generated";

export const fetchUser = async (id: string) => {
  const { data } = await User.find(`/show-user-with-profile-and-address/${id}`);
  return data;
};

export const useUserQuery = (id: string) => {
  return useQuery<TUser, Error>(['show-user-with-profile-and-address', id], () =>
    fetchUser(id)
  );
};
