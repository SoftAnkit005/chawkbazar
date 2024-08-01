import { QueryParamsType, QueryOptionsType } from "@ts-types/custom.types";
import { stringifySearchQuery } from "@utils/data-mappers";
import { useQuery } from "react-query";
import CustomerType from "@repositories/customer-type";
import { API_ENDPOINTS } from "@utils/api/endpoints";

const fetchCustomerTypes = async ({ queryKey }: QueryParamsType) => {
  const [_key, params] = queryKey;
  const {
    text,
    shop_id,
    orderBy = "updated_at",
    sortedBy = "desc",
  } = params as QueryOptionsType;
  const searchString = stringifySearchQuery({
    name: text,
    shop_id: shop_id,
  });
  const url = `${API_ENDPOINTS.CUSTOMER_TYPES}?search=${searchString}&orderBy=${orderBy}&sortedBy=${sortedBy}`;
  const { data } = await CustomerType.all(url);
  return { customer_type: data };
};

const useCustomerTypesQuery = (
  params: QueryOptionsType = {},
  options: any = {}
) => {
  return useQuery<any, Error>(
    [API_ENDPOINTS.CUSTOMER_TYPES, params],
    fetchCustomerTypes,
    {
      ...options,
      keepPreviousData: true,
    }
  );
};

export { useCustomerTypesQuery, fetchCustomerTypes };
