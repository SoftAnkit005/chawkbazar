import { Form } from "@components/ui/form/form";
import Button from "@components/ui/button";
import {
  useModalAction,
  useModalState,
} from "@components/ui/modal/modal.context";
import { useTranslation } from "next-i18next";
import { useApproveBusinessMutation } from "@data/shop/use-approve-business.mutation";
import Label from "@components/ui/label";
import { useCustomerTypesQuery } from "@data/customer-types/use-customer-types.query";

type FormValues = {
  customer_type: number;
};

const ApproveBusinessView = () => {
  const {
    data:customer_types
  } = useCustomerTypesQuery();
  const { t } = useTranslation();
  const { mutate: approveBusinessMutation, isLoading: loading } =
    useApproveBusinessMutation();

  const { data: shopId } = useModalState();
  const { closeModal } = useModalAction();

  function onSubmit({ customer_type }: FormValues) {
    approveBusinessMutation({
      variables: {
        input: {
          user_id: shopId as string,
          customer_type: Number(customer_type),
          is_approved:1,
        },
      },
    });
    closeModal();
  }
  const handleClose = () => {
    
    closeModal();
  };


  return (
    <Form<FormValues> onSubmit={onSubmit}>
      {({ register, formState: { errors } }) => (
        <div className="p-5 bg-light flex flex-col m-auto max-w-sm w-full rounded sm:w-[24rem]">
          <Label>{"Account Type"}</Label>
          <select style={{fontSize: "0.875rem",
          color: "#6B7280",
		paddingLeft: 16,
		paddingRight: 16,
		paddingTop: 12,
		paddingBottom: 12,
		cursor: "pointer",
		borderBottom: "1px solid #E5E7EB",
    backgroundColor:"#ffffff"
  }} className="mb-4" {...register("customer_type")}
          >
            (
      {
        customer_types?.customer_type.sort((x:any, y:any)=>x.id-y.id).map((x:any) => 
        <option value={x.id}>{x.name}</option> )
      }
    )
          </select>

              <div className="flex justify-end">
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            className="mr-2"
          >
            {t("form:button-label-submit")}
          </Button>

          <Button            
            loading={loading}
            disabled={loading}
            onClick={handleClose}   
            style={{ backgroundColor: "red", color: "white" }}               
          >
            
            {t("Close")}
          </Button>
          

          </div>

        </div>
      )}
    </Form>
  );
};

export default ApproveBusinessView;
