import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import ImportCsv from "@components/ui/import-csv";
import { useShopQuery } from "@data/shop/use-shop.query";
import { useImportSolitaireProductsMutation } from "@data/import/use-import-solitaire-products.mutation";

export default function ImportSolitaireProducts() {
  const { t } = useTranslation("common");
  const {
    query: { shop },
  } = useRouter();
  const { data: shopData } = useShopQuery(shop as string);
  const shopId = shopData?.shop?.id!;
  const { mutate: importSolitaireProducts, isLoading: loading } =
    useImportSolitaireProductsMutation();

  const handleDrop = async (acceptedFiles: any) => {
    if (acceptedFiles.length) {
      importSolitaireProducts({
        shop_id: shopId,
        csv: acceptedFiles[0],
      });
    }
  };

  return (
    <ImportCsv
      onDrop={handleDrop}
      loading={loading}
      title={"Import Solitaire Products"}
    />
  );
}
