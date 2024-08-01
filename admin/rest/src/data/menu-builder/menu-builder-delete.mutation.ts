import { useMutation, useQueryClient } from "react-query";
import MenuBuilder from "@repositories/menu-builders";
import { API_ENDPOINTS } from "@utils/api/endpoints";

export const useDeleteMenuBuilderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (id: string) => MenuBuilder.delete(`${API_ENDPOINTS.MENU_BUILDERS}/${id}`),
    {
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.MENU_BUILDERS);
      },
    }
  );
};
