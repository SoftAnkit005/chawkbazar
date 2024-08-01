import Card from "@components/common/card";
import { DownloadIcon } from "@components/icons/download-icon";
import { useTranslation } from "next-i18next";
import ImportAttributes from "@components/attribute/import-attributes";
import { useModalState, useModalAction } from "@components/ui/modal/modal.context"; // Import useModalAction
import React from "react"; // Import React

const AttributeExportImport = () => {
  const { t } = useTranslation();
  const { data: shopId } = useModalState();
  const { closeModal } = useModalAction(); // Get closeModal function from useModalAction

  return (
    <Card className="flex flex-col min-h-screen w-screen md:w-auto md:min-h-0 lg:min-w-[900px]">
      <div className="w-full mb-5">
        <h1 className="text-lg font-semibold text-heading">
          {t("common:text-export-import")}
        </h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        <ImportAttributes />
        <a
          href={`${process?.env?.NEXT_PUBLIC_REST_API_ENDPOINT}/export-attributes`}
          target="_blank"
          className="border-dashed border-2 border-border-base h-36 rounded flex flex-col justify-center items-center cursor-pointer focus:border-accent-400 focus:outline-none p-5"
        >
          <DownloadIcon className="text-muted-light w-10" />

          <span className="text-sm mt-4 text-center text-accent font-semibold">
            {t("common:text-export-attributes")}
          </span>
        </a>

        <div className="mt-10 mx-auto text-center">
          <button
            onClick={() => closeModal()} // Close modal on button click
            className="bg-black text-white py-2 px-4 hover:bg-opacity-80 focus:outline-none"
          >
            CLOSE
          </button>  
      </div>
      </div>
     
    </Card>
  );
};

export default AttributeExportImport;
