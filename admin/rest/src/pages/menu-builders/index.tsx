import Card from '@components/common/card';
import Layout from "@components/layouts/admin";
import CategoryTypeFilter from '@components/product/category-type-filter';
import MenuBuilderList from '@components/menu-builder/menu-builder-list';
import React, { useState } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { SortOrder } from '@ts-types/generated';
import { useMenuBuilderQuery } from '@data/menu-builder/menu-builders.query';
import Loader from '@components/ui/loader/loader';
import ErrorMessage from '@components/ui/error-message';
import cn from "classnames";
import { adminOnly } from '@utils/auth-utils';
import LinkButton from '@components/ui/link-button';
import { ROUTES } from '@utils/routes';

const MenuBuilderPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const [orderBy, setOrder] = useState("created_at");
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [visible, setVisible] = useState(false);

  const {
    data,
    isLoading: loading,
    error,
  } = useMenuBuilderQuery({
    limit: 20,
    page,
    type,
    text: searchTerm,
    orderBy,
    sortedBy,
  });

  if (loading) return <Loader text={t("common:text-loading")} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handlePagination(current: any) {
    setPage(current);
  }

  return (
    <>
      <Card className="flex flex-col mb-8">
        <div>
        <LinkButton
              href={`${ROUTES.MENU_BUILDER}/create`}
              className="h-12 md:ms-6 w-full md:w-auto"
            >
              <span className="block md:hidden xl:block">
                + {"Add Menu Builder"}
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
      {console.log("menuBuilders", data)}
      <MenuBuilderList
        menuBuilders={data?.menuBuilder}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  )
}

export default MenuBuilderPage

MenuBuilderPage.authenticate = {
  permissions: adminOnly,
};
MenuBuilderPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["table", "common", "form"])),
  },
});
