import { ROUTES } from "@utils/routes";
import Product from "@repositories/product";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { toast } from "react-toastify";

export const useApproveSolitaireCsvMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(
    (input: any) => Product.create('import-solitaire-csv', input),
    {
      onSuccess: () => {
        toast.success("Import started in background, products will be availabe once completed!");
        setTimeout(()=>{
          location.reload();
        },2000);
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.PRODUCTS);
      },
    }
  );
};
