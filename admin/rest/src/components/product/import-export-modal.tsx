import Card from "@components/common/card";
import { DownloadIcon } from "@components/icons/download-icon";
import { useModalAction, useModalState } from "@components/ui/modal/modal.context";
import { useTranslation } from "next-i18next";
import ImportProducts from "./import-products";
import ImportSolitaireProducts from "./import-solitaire-products";
import DeleteSolitaireProducts from "./delete-solitaire-products";
import ImportVariationOptions from "./import-variation-options";
import Button from "@components/ui/button";
import { useState } from "react";

const ExportImportView = () => {
  const { data: shopId } = useModalState();
  const { t } = useTranslation();
  const { closeModal } = useModalAction();
  const [sheetType, setSheetType] = useState("1");

  const handleSheetTypeChange = (event) => {
    setSheetType(event.target.value);
  };


  return (
    <Card
      className="flex flex-col min-h-screen md:min-h-0">
      <div className="w-full mb-5">
        <h1 className="text-lg font-semibold text-heading">
          {t("common:text-export-import")}
        </h1>
      </div>
      <div className="w-full mb-5 flex justify-start">
          <select
            className="border border-gray-300 rounded p-2"
            value={sheetType}
            onChange={handleSheetTypeChange}
            required
          >
            <option value="1">Natural</option>
            <option value="2">Labgrown</option>
          </select>
        </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <a
          href={`${process?.env?.NEXT_PUBLIC_REST_API_ENDPOINT}/download-solitaire-sample-file`}
          target="_blank"
          className="border-dashed border-2 border-border-base h-36 rounded flex flex-col justify-center items-center cursor-pointer focus:border-accent-400 focus:outline-none p-5"
        >
          <DownloadIcon className="text-muted-light w-10" />

          <span className="text-sm mt-4 text-center text-accent font-semibold">
            Download Sample Solitaire Attributes
          </span>
        </a>
        <ImportSolitaireProducts sheetType={sheetType} />
        

        <a
          href={`${process?.env?.NEXT_PUBLIC_REST_API_ENDPOINT}/export-solitaire-products/${shopId}`}
          target="_blank"
          className="border-dashed border-2 border-border-base h-36 rounded flex flex-col justify-center items-center cursor-pointer focus:border-accent-400 focus:outline-none p-5"
        >
          <DownloadIcon className="text-muted-light w-10" />

          <span className="text-sm mt-4 text-center text-accent font-semibold">
            Export Solitaire Products
          </span>
        </a>

        <DeleteSolitaireProducts />

      </div>

      <div className="flex items-center justify-between space-s-4 w-full mt-8">
        <div className="w-1/2">
          <Button
            onClick={closeModal}
            variant="custom"
            style={{ "background": "red", "color": "white" }}
          >
            Close
          </Button>
        </div>        
      </div>
    </Card>
  );
};

export default ExportImportView;
