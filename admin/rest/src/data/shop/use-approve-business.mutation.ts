import { ApproveBusinessInput } from "@ts-types/generated";
import Shop from "@repositories/shop";
import { useMutation, useQueryClient } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";
export interface IBusinessApproveVariables {
  variables: {
    input: ApproveBusinessInput;
  };
}

export const useApproveBusinessMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(
    ({ variables: { input } }: IBusinessApproveVariables) =>
      Shop.approveBusiness(API_ENDPOINTS.APPROVE_BUSINESS, input),
    {
      onSuccess: () => {
        toast.success(t("common:successfully-updated"));
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.USERS);
      },
    }
  );
};
