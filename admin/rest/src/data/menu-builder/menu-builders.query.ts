import {
    QueryParamsType,
    MenuBuildersQueryOptionsType,
  } from "@ts-types/custom.types";
  import { mapPaginatorData, stringifySearchQuery } from "@utils/data-mappers";
  import { useQuery } from "react-query";
  import MenuBuilder from "@repositories/menu-builders";
  import { API_ENDPOINTS } from "@utils/api/endpoints";
  
  const fetchMenuBuilder = async ({ queryKey }: QueryParamsType) => {
    const [_key, params] = queryKey;
    const {
      page,
      text,
      type,
      status,
      limit = 15,
      orderBy = "updated_at",
      sortedBy = "DESC",
    } = params as MenuBuildersQueryOptionsType;
    const searchString = stringifySearchQuery({
      name: text,
      type,
      status,
    });
    const url = `${API_ENDPOINTS.MENU_BUILDERS}`;
    const {
      data:  data ,
    } = await MenuBuilder.all(url);
    return { menuBuilder: { data } };
  };
  
  const useMenuBuilderQuery = (
    params: MenuBuildersQueryOptionsType,
    options: any = {}
  ) => {
    return useQuery<any, Error>([API_ENDPOINTS.MENU_BUILDERS, params], fetchMenuBuilder, {
      ...options,
      keepPreviousData: true,
    });
  };
  
  export { useMenuBuilderQuery, fetchMenuBuilder };
