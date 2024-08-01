import Banner from "@repositories/banner";
import { useQuery } from "react-query";
import { UpdateBanner as TBanner } from "@ts-types/generated";
import { API_ENDPOINTS } from "@utils/api/endpoints";

export const fetchBanner = async (id: string) => {
  const { data } = await Banner.find(`${API_ENDPOINTS.BANNERS}/${id}`);
  return data;
};

export const useBannerQuery = (id: string) => {
  return useQuery<TBanner, Error>([API_ENDPOINTS.BANNERS, id], () =>
    fetchBanner(id)
  );
};
