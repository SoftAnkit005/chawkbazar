import { useQuery } from "react-query";
import { API_ENDPOINTS } from "@framework/utils/endpoints";
import request from "@framework/utils/request";
import { Tax } from "@framework/types";

const fetchTaxes = async () => {
  const url = `${API_ENDPOINTS.TAXES}`;
  const { data } = await request.get(url);
  return data;
};

const useTaxesQuery = () => {
  return useQuery<Tax[], Error>(
    [API_ENDPOINTS.TAXES],
    fetchTaxes
  );
};

export { useTaxesQuery, fetchTaxes };
