import CustomerType from "@repositories/customer-type";
import { useQuery } from "react-query";
import { CustomerType as TCustomerType } from "@ts-types/generated";
import { API_ENDPOINTS } from "@utils/api/endpoints";

export const fetchCustomerType = async (id: string) => {
  const { data } = await CustomerType.find(`${API_ENDPOINTS.CUSTOMER_TYPES}/${id}`);
  return { customer_type: data };
};

type Props = {
  customer_type: TCustomerType;
};

export const useCustomerTypeQuery = (id: string) => {
  return useQuery<Props, Error>([API_ENDPOINTS.CUSTOMER_TYPES, id], () =>
    fetchCustomerType(id)
  );
};
