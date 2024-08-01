import Card from "@components/common/card";
import Layout from "@components/layouts/admin";
import Search from "@components/common/search";
import ProductList from "@components/product/product-list";
import SolitaireProductList from "@components/product/solitaire-product-list";
import ImportedCsvList from "@components/product/imported-csv-list";
import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import { SortOrder } from "@ts-types/generated";
import { useState } from "react";
import { useSolitaireProductsQuery } from "@data/product/solitaire-products.query";
import { useNonSolitaireProductsQuery } from "@data/product/nonsolitaire-products.query";
import { useImportedCsvsQuery } from "@data/product/imported-csvs.query";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import CategoryTypeFilter from "@components/product/category-type-filter";
import cn from "classnames";
import { ArrowDown } from "@components/icons/arrow-down";
import { ArrowUp } from "@components/icons/arrow-up";
import {adminOnly} from "@utils/auth-utils";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [solitairePage, setSolitairePage] = useState(1);
  const [importedCsvPage, setImportedCsvPage] = useState(1);
  const { t } = useTranslation();
  const [orderBy, setOrder] = useState("created_at");
  const [solitaireOrderBy, setSolitaireOrder] = useState("created_at");
  const [importedCsvOrderBy, setImportedCsvOrder] = useState("updated_at");
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [solitaireSortedBy, setSolitaireColumn] = useState<SortOrder>(SortOrder.Desc);
  const [importedCsvSortedBy, setImportedCsvColumn] = useState<SortOrder>(SortOrder.Desc);
  const [visible, setVisible] = useState(false);
  localStorage.clear();

  const toggleVisible = () => {
    setVisible((v) => !v);
  };

  const {
    data:solitaireProducts,
    isLoading: solitaireloading,
    error:solitaireError,
  } = useSolitaireProductsQuery(
    {
      limit: 10,
      type:"ceseare",
      category,
      text: searchTerm,
      orderBy:solitaireOrderBy,
      sortedBy:solitaireSortedBy,
      page:solitairePage,
    }
  );

  const {
    data:importedCsvs,
    isLoading: importedCsvsloading,
    error:importedCsvsError,
  } = useImportedCsvsQuery(
    {
      limit: 10,
      orderBy:importedCsvOrderBy,
      sortedBy:importedCsvSortedBy,
      page:importedCsvPage,
    }
  );


  const {
    data,
    isLoading: loading,
    error,
  } = useNonSolitaireProductsQuery({
    limit: 20,
    page,
    type,
    category,
    text: searchTerm,
    orderBy,
    sortedBy,
  });

  if (loading) return <Loader text={t("common:text-loading")} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }
  function handlePagination(current: any) {
    setPage(current);
  }
  function handleSolitairePagination(current: any) {
    setSolitairePage(current);
  }
  function handleImportedCsvPagination(current: any) {
    setImportedCsvPage(current);
  }
  return (
    <>
      <Card className="flex flex-col mb-8">
        <div className="w-full flex flex-col md:flex-row items-center">
          <div className="md:w-1/4 mb-4 md:mb-0">
            <h1 className="text-lg font-semibold text-heading">
              {t("form:input-label-products")}
            </h1>
          </div>

          <div className="w-full md:w-3/4 flex flex-col items-center ms-auto">
            <Search onSearch={handleSearch} />
          </div>

          <button
            className="text-accent text-base font-semibold flex items-center md:ms-5 mt-5 md:mt-0"
            onClick={toggleVisible}
          >
            {t("common:text-filter")}{" "}
            {visible ? (
              <ArrowUp className="ms-2" />
            ) : (
              <ArrowDown className="ms-2" />
            )}
          </button>
        </div>

        <div
          className={cn("w-full flex transition", {
            "h-auto visible": visible,
            "h-0 invisible": !visible,
          })}
        >
          <div className="flex flex-col md:flex-row md:items-center mt-5 md:mt-8 border-t border-gray-200 pt-5 md:pt-8 w-full">
            <CategoryTypeFilter
              className="w-full"
              onCategoryFilter={({ slug }: { slug: string }) => {
                setCategory(slug);
              }}
              onTypeFilter={({ slug }: { slug: string }) => {
                setType(slug);
              }}
            />
          </div>
        </div>
      </Card>
      <ProductList
        products={data?.products}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
          <Card className="flex flex-col mb-8 mt-8">
        <div className="w-full flex flex-col md:flex-row items-center">
          <div className="md:w-4/4 mb-4 md:mb-0">
            <h1 className="text-lg font-semibold text-heading">
              Solitaire Products
            </h1>
          </div>
            </div>
          </Card>
      <ImportedCsvList
        csvs={importedCsvs?.imported_csvs}
        onPagination={handleImportedCsvPagination}
        onOrder={setImportedCsvOrder}
        onSort={setImportedCsvColumn}
      />
      <br/>
      <SolitaireProductList
        products={solitaireProducts?.products}
        onPagination={handleSolitairePagination}
        onOrder={setSolitaireOrder}
        onSort={setSolitaireColumn}
      />
    </>
  );
}

ProductsPage.authenticate = {
  permissions: adminOnly,
};
ProductsPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["table", "common", "form"])),
  },
});
