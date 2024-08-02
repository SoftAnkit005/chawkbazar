import { useQuery } from "react-query";
import { API_ENDPOINTS } from "@framework/utils/endpoints";
import request from "@framework/utils/request";
import { ShopBanner } from "@framework/types";

const fetchMaintenance = async () => {
  const url = `${API_ENDPOINTS.SHOP_UNDER_MAINTAINANCE}/1`;
  const { data } = await request.get(url);
  return data;
};

const useMaintenanceQuery = () => {
  return useQuery<ShopBanner[], Error>(
    [API_ENDPOINTS.SHOP_UNDER_MAINTAINANCE],
    fetchMaintenance
  );
};

export { useMaintenanceQuery, fetchMaintenance };
