import { mapPaginatorData, stringifySearchQuery } from "@utils/data-mappers";
import {
  QueryParamsType,
  ImportCsvsQueryOptionsType
} from "@ts-types/custom.types";
import Product from "@repositories/product";
import { useQuery } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";

const fetchImportCsvs = async ({ queryKey }: QueryParamsType) => {
  const [_key, params] = queryKey;
  const {
    page,
    status,
    limit = 15,
    orderBy = "updated_at",
    sortedBy = "DESC",
  } = params as ImportCsvsQueryOptionsType;
  const searchString = stringifySearchQuery({
    status,
  });
  const url = `${API_ENDPOINTS.IMPORTED_CSVS}?search=${searchString}&searchJoin=and&limit=${limit}&page=${page}&orderBy=${orderBy}&sortedBy=${sortedBy}`;
  const {
    data: { data, ...rest },
  } = await Product.all(url);
  return { imported_csvs: { data, paginatorInfo: mapPaginatorData({ ...rest }) } };
};

const useImportedCsvsQuery = (
  params: ImportCsvsQueryOptionsType,
  options: any = {}
) => {
  return useQuery<any, Error>([API_ENDPOINTS.IMPORTED_CSVS, params], fetchImportCsvs, {
    ...options,
    keepPreviousData: true,
  });
};

export { useImportedCsvsQuery, fetchImportCsvs };
