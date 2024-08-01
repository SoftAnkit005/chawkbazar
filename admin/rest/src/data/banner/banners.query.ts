import {
    QueryParamsType,
    ProductsQueryOptionsType,
    BannersQueryOptionsType,
  } from "@ts-types/custom.types";
  import { mapPaginatorData, stringifySearchQuery } from "@utils/data-mappers";
  import { useQuery } from "react-query";
  import Banner from "@repositories/banner";
  import { API_ENDPOINTS } from "@utils/api/endpoints";
  
  const fetchBanners = async ({ queryKey }: QueryParamsType) => {
    const [_key, params] = queryKey;
    const {
      page,
      text,
      type,
      shop_id,
      status,
      limit = 15,
      orderBy = "updated_at",
      sortedBy = "DESC",
    } = params as BannersQueryOptionsType;
    const searchString = stringifySearchQuery({
      name: text,
      type,
      status,
      shop_id,
    });
    const url = `${API_ENDPOINTS.BANNERS}`;
    const {
      data:  data ,
    } = await Banner.all(url);
    return { banners: { data } };
  };
  
  const useBannersQuery = (
    params: BannersQueryOptionsType,
    options: any = {}
  ) => {
    return useQuery<any, Error>([API_ENDPOINTS.BANNERS, params], fetchBanners, {
      ...options,
      keepPreviousData: true,
    });
  };
  
  export { useBannersQuery, fetchBanners };
  