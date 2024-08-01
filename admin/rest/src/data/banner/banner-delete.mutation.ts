import { useMutation, useQueryClient } from "react-query";
import Banner from "@repositories/banner";
import { API_ENDPOINTS } from "@utils/api/endpoints";

export const useDeleteBannerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (id: string) => Banner.delete(`${API_ENDPOINTS.BANNERS}/${id}`),
    {
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.BANNERS);
      },
    }
  );
};
