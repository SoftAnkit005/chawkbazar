import { useQuery } from "react-query";
import { API_ENDPOINTS } from "@framework/utils/endpoints";
import request from "@framework/utils/request";
import { ShopBanner } from "@framework/types";

const fetchBanners = async () => {
  const url = `${API_ENDPOINTS.SHOP_BANNERS}`;
  const { data } = await request.get(url);
  return data;
};

const useShopBannersQuery = () => {
  return useQuery<ShopBanner[], Error>(
    [API_ENDPOINTS.SHOP_BANNERS],
    fetchBanners
  );
};

export { useShopBannersQuery, fetchBanners };
