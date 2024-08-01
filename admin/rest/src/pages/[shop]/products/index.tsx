import Card from "@components/common/card";
import Search from "@components/common/search";
import ProductList from "@components/product/product-list";
import SolitaireProductList from "@components/product/solitaire-product-list";
import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import { useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ShopLayout from "@components/layouts/shop";
import { useRouter } from "next/router";
import LinkButton from "@components/ui/link-button";
import { adminOwnerAndStaffOnly } from "@utils/auth-utils";
import { useShopQuery } from "@data/shop/use-shop.query";
import { useSolitaireProductsQuery } from "@data/product/solitaire-products.query";
import { useNonSolitaireProductsQuery } from "@data/product/nonsolitaire-products.query";
import { useProductsQuery } from "@data/product/products.query";
import { SortOrder } from "@ts-types/generated";
import CategoryTypeFilter from "@components/product/category-type-filter";
import cn from "classnames";
import { ArrowDown } from "@components/icons/arrow-down";
import { ArrowUp } from "@components/icons/arrow-up";
import { useModalAction } from "@components/ui/modal/modal.context";
import { MoreIcon } from "@components/icons/more-icon";
import Button from "@components/ui/button";

export default function ProductsPage() {
  const {
    query: { shop },
  } = useRouter();
  const { data: shopData, isLoading: fetchingShop } = useShopQuery(
    shop as string
  );
  const shopId = shopData?.shop?.id!;
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [solitairePage, setSolitairePage] = useState(1);
  const [orderBy, setOrder] = useState("created_at");
  const [solitaireOrderBy, setSolitaireOrder] = useState("created_at");
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [solitaireSortedBy, setSolitaireColumn] = useState<SortOrder>(SortOrder.Desc);
  const [visible, setVisible] = useState(false);
  const { openModal } = useModalAction();

  const toggleVisible = () => {
    setVisible((v) => !v);
  };

  const {
    data:solitaireProducts,
    isLoading: solitaireloading,
    error:solitaireError,
  } = useSolitaireProductsQuery(
    {
      text: searchTerm,
      limit: 10,
      shop_id: Number(shopId),
      type:"ceseare",
      orderBy:solitaireOrderBy,
      sortedBy:solitaireSortedBy,
      page:solitairePage,
    },
    {
      enabled: Boolean(shopId),
    }
  );

  const {
    data,
    isLoading:loading,
    error
  } = useNonSolitaireProductsQuery(
    {
      text: searchTerm,
      limit: 10,
      shop_id: Number(shopId),
      type,
      category,
      orderBy,
      sortedBy,
      page,
    },
    {
      enabled: Boolean(shopId),
    }
  );
  
  function handleImportModal() {
    openModal("EXPORT_IMPORT_PRODUCT", shopId);
  }
  function handleImportNSModal() {
    openModal("EXPORT_IMPORT_NS_PRODUCT", shopId);
  }

  function clearBeforeAdd()
  {
    localStorage.clear();
		localStorage.setItem("counterMulti","0");
		localStorage.setItem("multiDiamondArr",JSON.stringify([]));
  }

  if (loading || fetchingShop)
    return <Loader text={t("common:text-loading")} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
  }
  function handlePagination(current: any) {
    setPage(current);
  }
  function handleSolitairePagination(current: any) {
    setSolitairePage(current);
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

          <div className="w-full md:w-3/4 flex flex-col md:flex-row items-center">
            <div className="w-full flex items-center">
              <Search onSearch={handleSearch} />
              <LinkButton
                href={`/${shop}/products/create`}
                className="h-12 ms-4 md:ms-6"
              >
                <span onClick={clearBeforeAdd} className="hidden md:block">
                  + {"Add Product"}
                </span>
                <span onClick={clearBeforeAdd} className="md:hidden">
                + {"Add Product"}
                </span>
              </LinkButton>
            </div>

            <Button
              onClick={handleImportNSModal}
              className="h-12 ms-4 md:ms-6"
            >
              {t("common:text-export-import")}
            </Button>

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
          <button
              onClick={handleImportModal}
              className="hidden md:flex w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 items-center justify-center flex-shrink-0 ms-5 transition duration-300"
            >
              <MoreIcon className="w-3.5 text-body" />
            </button>
            </div>
          </Card>
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
  permissions: adminOwnerAndStaffOnly,
};
ProductsPage.Layout = ShopLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["table", "common", "form"])),
  },
});
