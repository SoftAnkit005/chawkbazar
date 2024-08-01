import { UpdateBanner } from "@ts-types/generated";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import Banner from "@repositories/banner";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { useTranslation } from "next-i18next";

export interface IBannerUpdateVariables {
  variables: { id: string; input: UpdateBanner };
}

export const useUpdateBannerMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(
    ({ variables: { id, input } }: IBannerUpdateVariables) =>
    Banner.update(`${API_ENDPOINTS.BANNERS}/${id}`, input),
    {
      onSuccess: () => {
        toast.success(t("common:successfully-updated"));
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.BANNERS);
      },
    }
  );
};
