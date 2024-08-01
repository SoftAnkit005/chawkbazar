import Input from "@components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { DatePicker } from "@components/ui/date-picker";
import Button from "@components/ui/button";
import TextArea from "@components/ui/text-area";
import Description from "@components/ui/description";
import Card from "@components/common/card";
import Label from "@components/ui/label";
import { useRouter } from "next/router";
import ValidationError from "@components/ui/form-validation-error";
import { AttachmentInput, Coupon, CouponType } from "@ts-types/generated";
import { useCreateCouponMutation } from "@data/coupon/use-coupon-create.mutation";
import { useUpdateCouponMutation } from "@data/coupon/use-coupon-update.mutation";
import { useTranslation } from "next-i18next";
import FileInput from "@components/ui/file-input";
import { yupResolver } from "@hookform/resolvers/yup";
import { couponValidationSchema } from "./coupon-validation-schema";
import SelectInput from "@components/ui/select-input";

type FormValues = {
  code: string;
  types: {
    name: string,
    id: number
  };
  vendor_types: {
    name: string,
    id: number
  };
  type: string;
  vendor_type:number;
  description: string;
  makingCharges:number;
  wastage:number;
  amount: number;
  usagePerUser:number;
  totalUsage:number;
  image: AttachmentInput;
  active_from: string;
  expire_at: string;
};

const defaultValues = {
  types:{
    id:"fixed",
    name:"Fixed"
  },
  vendor_types:{
    id:1,
    name:"B2C"
  },
  type:"fixed",
  vendor_type:1,
  image: "",
  makingCharges:0,
  wastage:0,
  amount: 0,
  usagePerUser:1,
  totalUsage:1,
  active_from: new Date(),
  expire_at: new Date(),
};

type IProps = {
  initialValues?: Coupon | null;
};
export default function CreateOrUpdateCouponForm({ initialValues }: IProps) {
  console.log(initialValues);
  const router = useRouter();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    control,
    watch,
    setError,

    formState: { errors },
  } = useForm<FormValues>({
    // @ts-ignore
    defaultValues: initialValues
      ? {
          ...initialValues,
          active_from: new Date(initialValues.active_from!),
          expire_at: new Date(initialValues.expire_at!),
        }
      : defaultValues,
    resolver: yupResolver(couponValidationSchema),
  });
  const { mutate: createCoupon, isLoading: creating } =
    useCreateCouponMutation();
  const { mutate: updateCoupon, isLoading: updating } =
    useUpdateCouponMutation();

  const [active_from, expire_at] = watch(["active_from", "expire_at"]);
  const couponType = watch("type");

  if(initialValues){
    initialValues.types = {
      id:initialValues?.type,
      name:initialValues?.type == "fixed" ? "Fixed" : "Percentage"
    };
    initialValues.vendor_types = {
      id:initialValues?.vendor_type,
      name:initialValues?.vendor_type == 1 ? "B2C" : (initialValues?.vendor_type == 2 ? "B2B" : "B2S")
    };
  }


  const onSubmit = async (values: FormValues) => {
    const input = {
      code: values?.code?.toUpperCase(),
      type: values?.types?.id || CouponType.FixedCoupon,
      vendor_type: values?.vendor_types?.id || 1,
      description: values.description,
      amount: (values?.types?.id == "percentage" && values.amount > 100) ? 100 : values.amount,
      wastage: (values?.types?.id == "percentage" && values.wastage > 100) ? 100 : values.wastage,
      makingCharges: (values?.types?.id == "percentage" && values.makingCharges > 100) ? 100 : values.makingCharges,
      usagePerUser: values.usagePerUser,
      totalUsage: values.totalUsage,
      active_from: new Date(values.active_from).toISOString(),
      expire_at: new Date(values.expire_at).toISOString(),
      image: {
        thumbnail: values?.image?.thumbnail,
        original: values?.image?.original,
        id: values?.image?.id,
      },
    };
    if (initialValues) {
      
      updateCoupon(
        {
          variables: {
            id: initialValues.id!,
            input,
          },
        },
        {
          onError: (error: any) => {
            Object.keys(error?.response?.data).forEach((field: any) => {
              setError(field, {
                type: "manual",
                message: error?.response?.data[field][0],
              });
            });
          },
        }
      );
    } else {
      createCoupon(
        {
          variables: {
            input,
          },
        },
        {
          onError: (error: any) => {
            Object.keys(error?.response?.data).forEach((field: any) => {
              setError(field, {
                type: "manual",
                message: error?.response?.data[field][0],
              });
            });
          },
        }
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap pb-8 border-b border-dashed border-border-base my-5 sm:my-8">
        <Description
          title={t("form:input-label-image")}
          details={t("form:coupon-image-helper-text")}
          className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <FileInput name="image" control={control} multiple={false} />
        </Card>
      </div>

      <div className="flex flex-wrap my-5 sm:my-8">
        <Description
          title={t("form:input-label-description")}
          details={`${
            initialValues
              ? t("form:item-description-edit")
              : t("form:item-description-add")
          } ${t("form:coupon-form-info-help-text")}`}
          className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8 "
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t("form:input-label-code")}
            {...register("code")}
            error={t(errors.code?.message!)}
            variant="outline"
            className="mb-5"
          />

          <TextArea
            label={t("form:input-label-description")}
            {...register("description")}
            variant="outline"
            className="mb-5"
          />
          <Label className="mt-5">{"Vendor Type"}*</Label>
          <SelectInput
                {...register("vendor_types")}
                isRequired
                control={control}
                getOptionLabel={(option: any) => option.name}
                getOptionValue={(option: any) => option.id}
                defaultValue={initialValues?.vendor_types || {id:1,name:"B2C"}}
                options={[
                  {id:1,name:"B2C"},
                  {id:2,name:"B2B"},
                  {id:3,name:"B2S"}
                ]}
              />
              <Label className="mt-5">{"Discount Type"}*</Label>
          <SelectInput
                {...register("types")}
                isRequired
                control={control}
                getOptionLabel={(option: any) => option.name}
                getOptionValue={(option: any) => option.id}
                defaultValue={initialValues?.types || {id:"fixed",name:"Fixed"}}
                options={[
                  {id:"fixed",name:"Fixed"},
                  {id:"percentage",name:"Percentage"}
                ]}
              />

        {/* <SelectInput
          options={couponType}
          name="type"
        /> */}
                    <div className="flex flex-col sm:flex-row">
            <div className="w-full sm:w-1/2 p-0 sm:pe-2 mb-5 sm:mb-0">
          {couponType !== CouponType.FreeShippingCoupon && (
            <Input
              label={"Making Charges"}
              {...register("makingCharges")}
              type="number"
              error={t(errors.makingCharges?.message!)}
              variant="outline"
              defaultValue={0}
              className="mb-5 mt-5"
            />
          )}
          </div>
            <div className="w-full sm:w-1/2 p-0 sm:pe-2 mb-5 sm:mb-0">
          {couponType !== CouponType.FreeShippingCoupon && (
            <Input
              label={"Wastage"}
              {...register("wastage")}
              type="number"
              defaultValue={0}
              error={t(errors.wastage?.message!)}
              variant="outline"
              className="mb-5 mt-5"
            />
          )}
          </div>
          </div>
          {couponType !== CouponType.FreeShippingCoupon && (
            <Input
              label={`${t("form:input-label-amount")}*`}
              {...register("amount")}
              type="number"
              error={t(errors.amount?.message!)}
              variant="outline"
              defaultValue={0}
              className="mb-5"
            />
          )}
                    <div className="flex flex-col sm:flex-row">
            <div className="w-full sm:w-1/2 p-0 sm:pe-2 mb-5 sm:mb-0">
            <Input
              label={"Usage / User*"}
              {...register("usagePerUser")}
              type="number"
              error={t(errors.usagePerUser?.message!)}
              variant="outline"
              defaultValue={1}
              className="mb-5"
            />
</div>
<div className="w-full sm:w-1/2 p-0 sm:pe-2 mb-5 sm:mb-0">
<Input
              label={"Total Usage*"}
              {...register("totalUsage")}
              type="number"
              error={t(errors.totalUsage?.message!)}
              variant="outline"
              defaultValue={1}
              className="mb-5"
            />
</div>
</div>
          <div className="flex flex-col sm:flex-row">
            <div className="w-full sm:w-1/2 p-0 sm:pe-2 mb-5 sm:mb-0">
              <Label>{t("form:coupon-active-from")}</Label>

              <Controller
                control={control}
                name="active_from"
                render={({ field: { onChange, onBlur, value } }) => (
                  //@ts-ignore
                  <DatePicker
                    dateFormat="dd/MM/yyyy"
                    onChange={onChange}
                    onBlur={onBlur}
                    selected={value}
                    selectsStart
                    minDate={new Date()}
                    maxDate={expire_at}
                    startDate={active_from}
                    endDate={expire_at}
                    className="border border-border-base"
                  />
                )}
              />
              <ValidationError message={t(errors.active_from?.message!)} />
            </div>
            <div className="w-full sm:w-1/2 p-0 sm:ps-2">
              <Label>{t("form:coupon-expire-at")}</Label>

              <Controller
                control={control}
                name="expire_at"
                render={({ field: { onChange, onBlur, value } }) => (
                  //@ts-ignore
                  <DatePicker
                    dateFormat="dd/MM/yyyy"
                    onChange={onChange}
                    onBlur={onBlur}
                    selected={value}
                    selectsEnd
                    startDate={active_from}
                    endDate={expire_at}
                    minDate={active_from}
                    className="border border-border-base"
                  />
                )}
              />
              <ValidationError message={t(errors.expire_at?.message!)} />
            </div>
          </div>
        </Card>
      </div>
      <div className="mb-4 text-end">
        {initialValues && (
          <Button
            variant="outline"
            onClick={router.back}
            className="me-4"
            type="button"
          >
            {t("form:button-label-back")}
          </Button>
        )}

        <Button loading={updating || creating}>
          {initialValues
            ? t("form:button-label-update-coupon")
            : t("form:button-label-add-coupon")}
        </Button>
      </div>
    </form>
  );
}
