import { useQuery } from "react-query";
import { API_ENDPOINTS } from "@framework/utils/endpoints";
import request from "@framework/utils/request";
import { MenuBuilder } from "@framework/types";

const fetchMenuBuilders = async () => {
  const url = `${API_ENDPOINTS.MENU_BUILDERS}`;
  const { data } = await request.get(url);
  return data;
};

const useMenuBuildersQuery = () => {
  return useQuery<MenuBuilder[], Error>(
    [API_ENDPOINTS.MENU_BUILDERS],
    fetchMenuBuilders
  );
};

export { useMenuBuildersQuery, fetchMenuBuilders };
