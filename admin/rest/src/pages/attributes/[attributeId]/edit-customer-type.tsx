import CreateOrUpdateCustomerTypeForm from "@components/customer-type/customer-type-form";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ShopLayout from "@components/layouts/shop";
import { adminOwnerAndStaffOnly } from "@utils/auth-utils";
import { useCustomerTypeQuery } from "@data/customer-types/use-customer-type.query";
import router from "next/router";

export default function EditAttributePage() {
  const {
    data,
    isLoading: loading,
    error,
  } = useCustomerTypeQuery(router.query.attributeId as string);
  const { t } = useTranslation();
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-border-base">
        <h1 className="text-lg font-semibold text-heading">
          {t("form:edit-attribute")}
        </h1>
      </div>
      <CreateOrUpdateCustomerTypeForm initialValues={data?.customer_type}/>
    </>
  );
}
EditAttributePage.authenticate = {
  permissions: adminOwnerAndStaffOnly,
};
EditAttributePage.Layout = ShopLayout;
export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "form"])),
  },
});
