import Layout from "@components/layouts/admin";
import BannerForm from "@components/banner/banner-form";
import { adminAndOwnerOnly } from "@utils/auth-utils";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function CreateBannerPage() {
  const { t } = useTranslation();
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-border-base">
        <h1 className="text-lg font-semibold text-heading">
          {t("form:form-title-create-banner")}
        </h1>
      </div>
      <BannerForm />
    </>
  );
}
CreateBannerPage.authenticate = {
  permissions: adminAndOwnerOnly,
};
CreateBannerPage.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ["common", "form"])),
  },
});
