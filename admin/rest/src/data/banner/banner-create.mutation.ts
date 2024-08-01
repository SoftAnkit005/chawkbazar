import { CreateBanner } from "@ts-types/generated";
import { ROUTES } from "@utils/routes";
import Banner from "@repositories/banner";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";

export const useCreateBannerMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(
    (input: CreateBanner) => Banner.create(API_ENDPOINTS.BANNERS, input),
    {
      onSuccess: () => {
        router.push(`/banner`);
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.PRODUCTS);
      },
    }
  );
};
