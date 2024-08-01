import { CustomerTypeInput } from "@ts-types/generated";
import { useMutation, useQueryClient } from "react-query";
import { Id, toast } from "react-toastify";
import CustomerType from "@repositories/customer-type";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { useTranslation } from "next-i18next";

export interface ICustomerTypeUpdateVariables {
  variables: {
    id: number | string;
    input: CustomerTypeInput;
  };
}

export const useUpdateCustomerTypeMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(
    ({ variables: { id, input } }: ICustomerTypeUpdateVariables) =>
    CustomerType.update(`${API_ENDPOINTS.CUSTOMER_TYPES}/${id}`, input),
    {
      onSuccess: () => {
        toast.success(t("common:successfully-updated"));
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.CUSTOMER_TYPES);
      },
    }
  );
};
