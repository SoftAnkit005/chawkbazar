import {
  QueryParamsType,
  ProductsQueryOptionsType,
} from "@ts-types/custom.types";
import { mapPaginatorData, stringifySearchQuery } from "@utils/data-mappers";
import { useQuery } from "react-query";
import Product from "@repositories/product";

const fetchProducts = async ({ queryKey }: QueryParamsType) => {
  const [_key, params] = queryKey;
  const {
    page,
    text,
    type,
    category,
    shop_id,
    type_id,
    status,
    limit = 15,
    orderBy = "updated_at",
    sortedBy = "DESC",
  } = params as ProductsQueryOptionsType;
  const searchString = stringifySearchQuery({
    name: text,
    type,
    category,
    status,
    shop_id,
    type_id
  });
  const url = `nonsolitaireindex?search=${searchString}&searchJoin=and&limit=${limit}&page=${page}&orderBy=${orderBy}&sortedBy=${sortedBy}`;
  const {
    data: { data, ...rest },
  } = await Product.all(url);
  return { products: { data, paginatorInfo: mapPaginatorData({ ...rest }) } };
};

const useNonSolitaireProductsQuery = (
  params: ProductsQueryOptionsType,
  options: any = {}
) => {
  return useQuery<any, Error>([`nonsolitaireindex`, params], fetchProducts, {
    ...options,
    keepPreviousData: true,
  });
};

export { useNonSolitaireProductsQuery, fetchProducts };
