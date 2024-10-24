import { Form } from "@components/ui/form/form";
import Button from "@components/ui/button";
import {
  useModalAction,
  useModalState,
} from "@components/ui/modal/modal.context";
import Input from "@components/ui/input";
import { useTranslation } from "next-i18next";
import { useApproveShopMutation } from "@data/shop/use-approve-shop.mutation";
import Label from "@components/ui/label";
import { useCustomerTypesQuery } from "@data/customer-types/use-customer-types.query";
import { useShopQuery } from "@data/shop/use-shop.query";
import { useShopsQuery } from "@data/shop/use-shops.query";

type FormValues = {
  customer_type: number;
  admin_commission_rate: number;
  admin_commission_rate_solitaire: number;
  admin_commission_rate_solitaire_natural: number;
  markup_type: string;
  making_charges_markup: number;
  wastage_markup: number;
  admin_commission_rate_customer: number;
  admin_commission_rate_solitaire_customer: number;
  admin_commission_rate_solitaire_customer_natural: number;
  markup_type_customer: string;
  making_charges_markup_customer: number;
  wastage_markup_customer: number;
  vendor_code: string;
};

const ApproveShopView = () => {
  const { data: customer_types } = useCustomerTypesQuery();
  const { t } = useTranslation();
  const {
    mutate: approveShopMutation,
    isLoading: loading,
  } = useApproveShopMutation();

  const { data: shopId } = useModalState();
  const { closeModal } = useModalAction();

  const { data: shopsData } = useShopsQuery({
    limit: 999,
  });

  const shopSlug = shopsData?.shops?.data?.find((x) => x.id == shopId)?.slug;
  const { data: shopData } = useShopQuery(shopSlug?.toString() || "");
  const balance = shopData?.shop?.balance;

  function onSubmit({
    customer_type,
    admin_commission_rate,
    admin_commission_rate_solitaire,
    admin_commission_rate_solitaire_natural,
    making_charges_markup,
    wastage_markup,
    admin_commission_rate_customer,
    admin_commission_rate_solitaire_customer,
    admin_commission_rate_solitaire_customer_natural,
    markup_type,
    markup_type_customer,
    making_charges_markup_customer,
    wastage_markup_customer,
    vendor_code,
  }: FormValues) {
    approveShopMutation({
      variables: {
        input: {
          id: shopId as string,
          vendor_code: vendor_code,
          customer_type: Number(customer_type),
          admin_commission_rate: Number(admin_commission_rate),
          admin_commission_rate_solitaire: Number(
            admin_commission_rate_solitaire
          ),
          admin_commission_rate_solitaire_natural: Number(
            admin_commission_rate_solitaire_natural
          ),
          markup_type: markup_type || "p",
          making_charges_markup: Number(making_charges_markup),
          wastage_markup: Number(wastage_markup),
          admin_commission_rate_customer: Number(
            admin_commission_rate_customer
          ),
          admin_commission_rate_solitaire_customer: Number(
            admin_commission_rate_solitaire_customer
          ),
          admin_commission_rate_solitaire_customer_natural: Number(
            admin_commission_rate_solitaire_customer_natural
          ),
          markup_type_customer: markup_type_customer || "p",
          making_charges_markup_customer: Number(
            making_charges_markup_customer
          ),
          wastage_markup_customer: Number(wastage_markup_customer),
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
          <Input
            {...register("vendor_code", {
              required: "You must need to set your vendor code",
            })}
            label={"Vendor Code"}
            defaultValue={shopData?.shop?.vendor_code || ""}
            variant="outline"
            className="mb-4 mr-2"
            error={t(errors.vendor_code?.message!)}
          />
          {/* <Label>{"Vendor Type"}</Label> */}
          <Input type="hidden" value={2} name="customer_type" />
          {/* <select
            style={{
              fontSize: "0.875rem",
              color: "#6B7280",
              paddingLeft: 16,
              paddingRight: 16,
              paddingTop: 12,
              paddingBottom: 12,
              cursor: "pointer",
              borderBottom: "1px solid #E5E7EB",
              backgroundColor: "#ffffff",
            }}
            className="mb-4"
            {...register("customer_type")}
          >
            (
            {customer_types?.customer_type
              .sort((x: any, y: any) => x.id - y.id)
              .map((x: any) => (
                <option value={x.id}>{x.name}</option>
              ))}
            )
          </select> */}
          <Input
            label={`${t("form:input-label-admin-commission-rate")}% (B2B)`}
            {...register("admin_commission_rate", {
              required: "You must need to set your commission rate",
            })}
            defaultValue={Number(balance?.admin_commission_rate) || 0}
            variant="outline"
            className="mb-4"
            error={t(errors.admin_commission_rate?.message!)}
          />

          <Input
            label={`Commission rate on Solitaire %(B2B Labgrown)`}
            {...register("admin_commission_rate_solitaire", {
              required: "You must need to set your commission rate",
            })}
            defaultValue={Number(balance?.admin_commission_rate_solitaire) || 0}
            variant="outline"
            className="mb-4"
            error={t(errors.admin_commission_rate_solitaire?.message!)}
          />

          <Input
            label={`Commission rate on Solitaire %(B2B Natural)`}
            {...register("admin_commission_rate_solitaire_natural", {
              required: "You must need to set your commission rate",
            })}
            defaultValue={
              Number(balance?.admin_commission_rate_solitaire_natural) || 0
            }
            variant="outline"
            className="mb-4"
            error={t(errors.admin_commission_rate_solitaire_natural?.message!)}
          />
          <Label>{"Mark Up Type (B2B)"}</Label>
          <select
            style={{
              fontSize: "0.875rem",
              color: "#6B7280",
              paddingLeft: 16,
              paddingRight: 16,
              paddingTop: 12,
              paddingBottom: 12,
              cursor: "pointer",
              borderBottom: "1px solid #E5E7EB",
              backgroundColor: "#ffffff",
            }}
            className="mb-4"
            {...register("markup_type")}
          >
            <option value="p">Percentage</option>
            <option value="f">Fixed</option>
          </select>
          <div className="flex flex-row">
            <Input
              {...register("making_charges_markup", {
                required: "You must need to set your markup rate",
              })}
              label={"Making Charges MarkUp (B2B)"}
              defaultValue={Number(balance?.making_charges_markup) || 0}
              variant="outline"
              className="mb-4 mr-2"
              error={t(errors.making_charges_markup?.message!)}
            />
            <Input
              {...register("wastage_markup", {
                required: "You must need to set your wastage rate",
              })}
              defaultValue={Number(balance?.wastage_markup) || 0}
              label={"Wastage MarkUp(B2B)"}
              variant="outline"
              className="mb-4 ml-2"
              error={t(errors.wastage_markup?.message!)}
            />
          </div>

          <Input
            label={`Commission rate on Diamond/Stone for customer %`}
            {...register("admin_commission_rate_customer", {
              required: "You must need to set your commission rate",
            })}
            defaultValue={Number(balance?.admin_commission_rate_customer) || 0}
            variant="outline"
            className="mb-4"
            error={t(errors.admin_commission_rate_customer?.message!)}
          />

          <Input
            label={`Commission rate on Solitaire for customer % (Labgrown)`}
            {...register("admin_commission_rate_solitaire_customer", {
              required: "You must need to set your commission rate",
            })}
            defaultValue={
              Number(balance?.admin_commission_rate_solitaire_customer) || 0
            }
            variant="outline"
            className="mb-4"
            error={t(errors.admin_commission_rate_solitaire_customer?.message!)}
          />

          <Input
            label={`Commission rate on Solitaire for customer % (Natural)`}
            {...register("admin_commission_rate_solitaire_customer_natural", {
              required: "You must need to set your commission rate",
            })}
            defaultValue={
              Number(
                balance?.admin_commission_rate_solitaire_customer_natural
              ) || 0
            }
            variant="outline"
            className="mb-4"
            error={t(
              errors.admin_commission_rate_solitaire_customer_natural?.message!
            )}
          />
          <Label>{"Mark Up Type  for customer"}</Label>
          <select
            style={{
              fontSize: "0.875rem",
              color: "#6B7280",
              paddingLeft: 16,
              paddingRight: 16,
              paddingTop: 12,
              paddingBottom: 12,
              cursor: "pointer",
              borderBottom: "1px solid #E5E7EB",
              backgroundColor: "#ffffff",
            }}
            className="mb-4"
            {...register("markup_type_customer")}
          >
            <option value="p">Percentage</option>
            <option value="f">Fixed</option>
          </select>
          <div className="flex flex-row">
            <Input
              {...register("making_charges_markup_customer", {
                required: "You must need to set your markup rate",
              })}
              label={"Making Charges MarkUp for customer"}
              defaultValue={
                Number(balance?.making_charges_marku_customerp) || 0
              }
              variant="outline"
              className="mb-4 mr-2"
              error={t(errors.making_charges_markup_customer?.message!)}
            />
            <Input
              {...register("wastage_markup_customer", {
                required: "You must need to set your wastage rate",
              })}
              defaultValue={Number(balance?.wastage_markup_customer) || 0}
              label={"Wastage MarkUp for customer"}
              variant="outline"
              className="mb-4 ml-2"
              error={t(errors.wastage_markup_customer?.message!)}
            />
          </div>

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

export default ApproveShopView;
