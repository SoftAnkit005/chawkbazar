import { CreateMenuBuilder } from "@ts-types/generated";
import MenuBuilder from "@repositories/menu-builders";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";

export const useCreateMenuBuilderMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(
    (input: CreateMenuBuilder) => MenuBuilder.create(API_ENDPOINTS.MENU_BUILDERS, input),
    {
      onSuccess: () => {
        router.push(`/menu-builders`);
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.MENU_BUILDERS);
      },
    }
  );
};
