import MenuBuilder from "@repositories/menu-builders";
import { useQuery } from "react-query";
import { UpdateMenuBuilder as TMenuBuilder } from "@ts-types/generated";
import { API_ENDPOINTS } from "@utils/api/endpoints";

export const fetchMenuBuilder = async (id: string) => {
  const { data } = await MenuBuilder.find(`${API_ENDPOINTS.MENU_BUILDERS}/${id}`);
  return data;
};

export const useMenuBuilderQuery = (id: string) => {
  return useQuery<TMenuBuilder, Error>([API_ENDPOINTS.MENU_BUILDERS, id], () =>
    fetchMenuBuilder(id)
  );
};
