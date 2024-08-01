import { useMutation, useQueryClient } from "react-query";
import Import from "@repositories/import";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";

type Input = {
  shop_id: string;
  csv: any;
  sheet_type:any;
};
export const useImportSolitaireProductsMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("common");

  return useMutation(
   
    (input: Input) => {
      console.log(input)
      return Import.importCsv(API_ENDPOINTS.IMPORT_SOLITAIRE_PRODUCTS, input);
    },
    {
      onSuccess: (data) => {
        console.log("API response on success:", data);
        toast.success("Solitaire Products Are Uploaded Successfully, Waiting For Admin Approval");
      },
      onError: (error: any) => {
        console.log("API response on error:", error);
        toast.error(t(`common:${error?.response?.data.message}`));
      },
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.PRODUCTS);
      },
    }
  );
};
