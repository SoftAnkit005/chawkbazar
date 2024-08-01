import { CustomerTypeInput } from "@ts-types/generated";
import { ROUTES } from "@utils/routes";
import CustomerType from "@repositories/customer-type";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";

export interface ICustomerTypeCreateVariables {
  variables: {
    input: CustomerTypeInput;
  };
}

export const useCreateCustomerTypeMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(
    ({ variables: { input } }: ICustomerTypeCreateVariables) =>
    CustomerType.create(API_ENDPOINTS.CUSTOMER_TYPES, input),
    {
      onSuccess: () => {
        router.push(`/${ROUTES.ATTRIBUTES}`);
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.CUSTOMER_TYPES);
      },
    }
  );
};
