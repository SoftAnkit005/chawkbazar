import Card from '@components/common/card';
import Layout from "@components/layouts/admin";
import Search from '@components/common/search';
import { ArrowDown } from '@components/icons/arrow-down';
import { ArrowUp } from '@components/icons/arrow-up';
import CategoryTypeFilter from '@components/product/category-type-filter';
import BannerList from '@components/banner/banner-list';
import React, { useState } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { SortOrder } from '@ts-types/generated';
import { useBannersQuery } from '@data/banner/banners.query';
import Loader from '@components/ui/loader/loader';
import ErrorMessage from '@components/ui/error-message';
import cn from "classnames";
import { adminOnly } from '@utils/auth-utils';
import LinkButton from '@components/ui/link-button';
import { ROUTES } from '@utils/routes';

const BannerPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const [orderBy, setOrder] = useState("created_at");
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [visible, setVisible] = useState(false);

  console.log(sortedBy);

  const toggleVisible = () => {
    setVisible((v) => !v);
  };

  const {
    data,
    isLoading: loading,
    error,
  } = useBannersQuery({
    limit: 20,
    page,
    type,
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

  return (
    <>
      <Card className="flex flex-col mb-8">
        <div className="w-full flex flex-col md:flex-row items-center">
          {/* <div className="md:w-1/4 mb-4 md:mb-0">
            <h1 className="text-lg font-semibold text-heading">
              {t("form:input-label-banners")}
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
          </button> */}

        <LinkButton
              href={`${ROUTES.BANNER}/create`}
              className="h-12 md:ms-6 w-full md:w-auto"
            >
              <span className="block md:hidden xl:block">
                + {"Add Banner"}
              </span>
              <span className="hidden md:block xl:hidden">
                + {t("form:button-label-add")}
              </span>
            </LinkButton>
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
      {console.log("banners", data)}
      <BannerList
        banners={data?.banners}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  )
}

export default BannerPage

BannerPage.authenticate = {
  permissions: adminOnly,
};
BannerPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["table", "common", "form"])),
  },
});