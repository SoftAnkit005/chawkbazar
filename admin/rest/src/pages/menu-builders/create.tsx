import Layout from "@components/layouts/admin";
import MenuBuilderForm from "@components/menu-builder/menu-builder-form";
import { adminAndOwnerOnly } from "@utils/auth-utils";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function CreateMenuBuilderPage() {
  const { t } = useTranslation();
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-border-base">
        <h1 className="text-lg font-semibold text-heading">
          {t("form:form-title-create-menu-builder")}
        </h1>
      </div>
      <MenuBuilderForm />
    </>
  );
}
CreateMenuBuilderPage.authenticate = {
  permissions: adminAndOwnerOnly,
};
CreateMenuBuilderPage.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ["common", "form"])),
  },
});
