import { useMutation, useQueryClient } from "react-query";
import Import from "@repositories/import";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";

type Input = {
  shop_id: string;
  csv: any;
};
export const useImportSolitaireProductsMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("common");

  return useMutation(
    (input: Input) => {
      return Import.importCsv(API_ENDPOINTS.IMPORT_SOLITAIRE_PRODUCTS, input);
    },
    {
      onSuccess: () => {
        toast.success("Solitaire Products Are Uploaded Successfully, Waiting For Admin Approval");
      },
      onError: (error: any) => {
        toast.error(t(`common:${error?.response?.data.message}`));
      },
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.PRODUCTS);
      },
    }
  );
};
