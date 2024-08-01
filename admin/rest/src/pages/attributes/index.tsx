import Card from "@components/common/card";
import Layout from "@components/layouts/admin";
import AttributeList from "@components/attribute/attribute-list";
import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import { useAttributesQuery } from "@data/attributes/use-attributes.query";
import { useCustomerTypesQuery } from "@data/customer-types/use-customer-types.query";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { SortOrder } from "@ts-types/generated";
import { useState } from "react";
import {adminOnly} from "@utils/auth-utils";
import LinkButton from "@components/ui/link-button";
import Button from "@components/ui/button";
import { MoreIcon } from "@components/icons/more-icon";
import CustomerTypeList from "@components/customer-type/customer-type-list";
import { useModalAction } from "@components/ui/modal/modal.context";

export default function AttributePage() {
  const { openModal } = useModalAction();
  const { t } = useTranslation();
  const [orderBy, setOrder] = useState("created_at");
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);

  const {
    data:customer_type
  } = useCustomerTypesQuery({ orderBy, sortedBy });

  const {
    data,
    isLoading: loading,
    error,
  } = useAttributesQuery({ orderBy, sortedBy });

  function handleImportModal() {
    openModal("EXPORT_IMPORT_ATTRIBUTE","chawkbazar-shop");
  }

  if (loading) return <Loader text={t("common:text-loading")} />;
  if (error) return <ErrorMessage message={error.message} />;
  return (
    <>
    <Card className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div className="md:w-1/4 mb-4 md:mb-0">
          <h1 className="text-xl font-semibold text-heading">
            {"Vendor Types"}
          </h1>
        </div>
        <div className="flex flex-col md:flex-row items-center w-full md:w-3/4 xl:w-2/4 ms-auto">
          {/* <LinkButton
            href={`/attributes/create-customer-type`}
            className="h-12 mt-5 md:mt-0 md:ms-auto w-full md:w-auto"
          >
            <span>
              + {t("form:button-label-add")} {"Vendor Type"}
            </span>
          </LinkButton> */}

          <Button onClick={handleImportModal} className="mt-5 w-full md:hidden">
            {t("common:text-export-import")}
          </Button>
        </div>
      </Card>
    <CustomerTypeList
        customerTypes={customer_type?.customer_type as any}
        onOrder={setOrder}
        onSort={setColumn}
      />
      <Card className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div className="md:w-1/4 mb-4 md:mb-0">
          <h1 className="text-xl font-semibold text-heading">
            {t("common:sidebar-nav-item-attributes")}
          </h1>
        </div>
        <div className="flex flex-col md:flex-row items-center w-full md:w-3/4 xl:w-2/4 ms-auto">
          <LinkButton
            href={`/attributes/create`}
            className="h-12 mt-5 md:mt-0 md:ms-auto w-full md:w-auto"
          >
            <span>
              + {t("form:button-label-add")} {t("common:attribute")}
            </span>
          </LinkButton>

          <Button onClick={handleImportModal} className="mt-5 w-full md:hidden">
            {t("common:text-export-import")}
          </Button>
          <button
            onClick={handleImportModal}
            className="hidden md:flex w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 items-center justify-center flex-shrink-0 ms-6 transition duration-300"
          >
            <MoreIcon className="w-3.5 text-body" />
          </button>
        </div>
      </Card>
      <AttributeList
        attributes={data?.attributes as any}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["table", "common", "form"])),
  },
});

AttributePage.authenticate = {
  permissions: adminOnly,
};
AttributePage.Layout = Layout;

