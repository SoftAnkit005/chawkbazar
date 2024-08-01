import Card from "@components/common/card";
import { DownloadIcon } from "@components/icons/download-icon";
import { useTranslation } from "next-i18next";
import ImportProducts from "./import-products";
import ImportVariationOptions from "./import-variation-options";
import { useModalAction, useModalState } from "@components/ui/modal/modal.context";
import Button from "@components/ui/button";

const ExportImportView = () => {
  const { data: shopId } = useModalState();
  const { t } = useTranslation();
  const { closeModal } = useModalAction();
  return (
    <Card className="flex flex-col min-h-screen md:min-h-0">
      <div className="w-full mb-5">
        <h1 className="text-lg font-semibold text-heading">
          {t("common:text-export-import")}
        </h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <ImportProducts />
        <ImportVariationOptions />

        <a
          href={`${process?.env?.NEXT_PUBLIC_REST_API_ENDPOINT}/export-products/${shopId}`}
          target="_blank"
          className="border-dashed border-2 border-border-base h-36 rounded flex flex-col justify-center items-center cursor-pointer focus:border-accent-400 focus:outline-none p-5"
        >
          <DownloadIcon className="text-muted-light w-10" />

          <span className="text-sm mt-4 text-center text-accent font-semibold">
            {t("common:text-export-products")}
          </span>
        </a>

        <a
          href={`${process?.env?.NEXT_PUBLIC_REST_API_ENDPOINT}/export-variation-options/${shopId}`}
          target="_blank"
          className="border-dashed border-2 border-border-base h-36 rounded flex flex-col justify-center items-center cursor-pointer focus:border-accent-400 focus:outline-none p-5"
        >
          <DownloadIcon className="text-muted-light w-10" />
          <span className="text-sm mt-4 text-center text-accent font-semibold">
            {t("common:text-export-product-variations")}
          </span>
        </a>
      </div>
      <div className="flex items-center justify-between space-s-4 w-full mt-8">
            <div className="w-1/2">
              <Button
                onClick={closeModal}
                variant="custom"
                style={{"background":"red","color":"white"}}
              >
                Close
              </Button>
            </div>
            </div>
    </Card>
  );
};

export default ExportImportView;
