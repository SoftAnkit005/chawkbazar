import { UpdateMenuBuilder } from "@ts-types/generated";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import MenuBuilder from "@repositories/menu-builders";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { useTranslation } from "next-i18next";

export interface IMenuBuilderUpdateVariables {
  variables: { id: number; input: UpdateMenuBuilder };
}

export const useUpdateMenuBuilderMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(
    ({ variables: { id, input } }: IMenuBuilderUpdateVariables) =>
    MenuBuilder.update(`${API_ENDPOINTS.MENU_BUILDERS}/${id}`, input),
    {
      onSuccess: () => {
        toast.success(t("common:successfully-updated"));
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.MENU_BUILDERS);
      },
    }
  );
};
