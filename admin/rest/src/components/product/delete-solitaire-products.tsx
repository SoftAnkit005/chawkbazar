import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import ImportCsv from "@components/ui/import-csv";
import { useShopQuery } from "@data/shop/use-shop.query";
import { useDeleteSolitaireProductsMutation } from "@data/import/use-delete-solitaire-products.mutation";

export default function DeleteSolitaireProducts() {
  const { t } = useTranslation("common");
  const {
    query: { shop },
  } = useRouter();
  const { data: shopData } = useShopQuery(shop as string);
  const shopId = shopData?.shop?.id!;
  const { mutate: deleteSolitaireProducts, isLoading: loading } =
  useDeleteSolitaireProductsMutation();

  const handleDrop = async (acceptedFiles: any) => {
    if (acceptedFiles.length) {
      deleteSolitaireProducts({
        shop_id: shopId,
        csv: acceptedFiles[0],
      });
    }
  };

  return (
    <ImportCsv
      onDrop={handleDrop}
      loading={loading}
      title={"Delete Solitaire Products"}
    />
  );
}
