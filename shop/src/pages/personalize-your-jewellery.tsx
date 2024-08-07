import Container from "@components/ui/container";
import { getLayout } from "@components/layout/layout";
import PageHeader from "@components/ui/page-header";
import UploadYourDesignForm from "@components/common/form/upload-your-design-form";
import { useTranslation } from "next-i18next";
import diamond_textured_bg from "/public/assets/images/diamond_textured_bg.jpg"

export { getStaticProps } from "@framework/ssr/common";

export default function PersonalizeYourJewellery() {
  const { t } = useTranslation("common");
  return (
    <>
      <PageHeader pageHeader="text-page-personalize-your-jewellery" />
        <div className="my-14 lg:my-16 xl:my-20 px-0xl mx-auto flex flex-col md:flex-row w-full justify-center py-10" style={{ backgroundImage: `url(${diamond_textured_bg.src})`}}>
          <div className="md:w-full lg:w-3/5 2xl:w-4/6 flex h-full flex-col py-10">
            <div className="flex pb-7 mt-7 md:-mt-1.5 mx-auto lg:mx-0">
              <h4 className="text-2xl 2xl:text-3xl font-bold text-heading capitalize mb-4 text-center">
                {t("text-upload-your-design")}
              </h4>
            </div>
            <UploadYourDesignForm />
          </div>
        </div>
      {/* <Container>
      </Container> */}
    </>
  );
}

PersonalizeYourJewellery.getLayout = getLayout;
