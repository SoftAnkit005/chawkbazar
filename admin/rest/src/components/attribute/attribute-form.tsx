import Input from "@components/ui/input";
import { useFieldArray, useForm } from "react-hook-form";
import Button from "@components/ui/button";
import Description from "@components/ui/description";
import Card from "@components/common/card";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { Attribute, SortOrder } from "@ts-types/generated";
import { useShopQuery } from "@data/shop/use-shop.query";
import { useCreateAttributeMutation } from "@data/attributes/use-attribute-create.mutation";
import { useUpdateAttributeMutation } from "@data/attributes/use-attribute-update.mutation";
import { useState } from "react";
import Alert from "@components/ui/alert";
import { animateScroll } from "react-scroll";
import { attributeValidationSchema } from "@components/attribute/attribute-validation-schema";
import { yupResolver } from "@hookform/resolvers/yup";
import Label from "@components/ui/label";
import { cloneDeep, flatten } from "lodash";
import { useCustomerTypesQuery } from "@data/customer-types/use-customer-types.query";
import { useProductsQuery } from "@data/product/products.query";


type FormValues = {
  name?: string | null;
  vendor_type:number;
  values: any;
};

type IProps = {
  initialValues?: Attribute | null;
};

export default function CreateOrUpdateAttributeForm({ initialValues }: IProps) {
  const {
    data:productData,
  } = useProductsQuery({
    limit: 999,
  });
  const flattenedVariations = flatten(productData?.products?.data?.map((x:any)=>x.variations))
  const [orderBy, setOrder] = useState("created_at");
const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [vendor_type, set_vendor_type] = useState(1);
  const {
    data:customer_types
  } = useCustomerTypesQuery({ orderBy, sortedBy });
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    query: { shop },
  } = router;
  const { t } = useTranslation();
  const { data: shopData } = useShopQuery(shop as string, { enabled: !!shop });
  const shopId = shopData?.shop?.id!;
  const {
    register,
    handleSubmit,
    getValues,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: initialValues ? initialValues : { name: "", values: [] },
    resolver: yupResolver(attributeValidationSchema)
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "values",
  });
  const { mutate: createAttribute, isLoading: creating } =
    useCreateAttributeMutation();
  const { mutate: updateAttribute, isLoading: updating } =
    useUpdateAttributeMutation();
  const onSubmit = (values: FormValues) => {
    if (!initialValues) {
      if(["Silver","Gold","Polki","Diamond","Precious Stones"].includes(values.name || ""))
      {
        return;
      } 
      values.values = flatten(values?.values.map((y:any)=>{
        const mainMainValue = cloneDeep(customer_types?.customer_type.map((x:any)=>{
        const mainValue = cloneDeep(y);
        mainValue.vendor_type = x.id;
        return mainValue;
      }))
      return mainMainValue;
    }))
      createAttribute(
        {
          variables: {
            input: {
              name: values.name!,
              vendor_type: Number(values.vendor_type!),
              values: values.values,
            },
          },
        },
        {
          onError: (error: any) => {
            setErrorMessage(error?.response?.data?.message);
            animateScroll.scrollToTop();
          },
        }
      );
    } else {
      const arrValue = cloneDeep(values.values.filter((x:any) => !x.attribute_id));
      values.values = cloneDeep(values.values.filter((x:any) => x.attribute_id));
      const updateValue = cloneDeep(values.values.filter((x:any) => x.vendor_type == vendor_type))
      let j=0;
      let k = 0;
      for(let i=0; i< values.values.length; i++)
      {
        if(j>customer_types.customer_type.length-1)
        {
          j = 0;
          k++;
        }
        values.values[i].value = updateValue[k]?.value || values.values[i].value;
        values.values[i].meta = updateValue[k]?.meta || values.values[i].meta; 
        values.values[i].id = values.values[i].id ? values.values[i].id : fields.find((x)=>x.vendor_type == values.values[i].vendor_type && x.value == values.values[i].value)?.id;
        j++;
      }
      const arrValue2 = arrValue.map((y:any)=>{
        const arrV = customer_types.customer_type.map((z:any)=>{
        let val = cloneDeep(y);
        val.vendor_type = z.id;
        return val;
      })
      return arrV;
      });
      values.values = [...flatten(arrValue2), ...flatten(values.values)];
      updateAttribute({
        variables: {
          id: initialValues.id,
          input: {
            name: values.name!,
            vendor_type: Number(values.vendor_type!),
            values: values.values,
          },
        },
      });
      location.reload();
    }
  };
  return (
    <>
      {errorMessage ? (
        <Alert
          message={t(`common:${errorMessage}`)}
          variant="error"
          closeable={true}
          className="mt-5"
          onClose={() => setErrorMessage(null)}
        />
      ) : null}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap pb-8 border-b border-dashed border-border-base my-5 sm:my-8">
          <Description
            title={t("common:attribute")}
            details={`${
              initialValues
                ? t("form:item-description-update")
                : t("form:item-description-add")
            } ${t("form:form-description-attribute-name")}`}
            className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <Input
              label={t("form:input-label-name")}
              {...register("name")}
              readOnly={["Silver","Gold","Polki","Diamond","Precious Stones"].includes(getValues("name") || "") || false}
              error={t(errors.name?.message!)}
              variant="outline"
              className="mb-5"
            />
              <div>
            <Label>Vendor Type</Label>
            <select style={{fontSize: "0.875rem",
          color: "#6B7280",
		paddingLeft: 16,
		paddingRight: 16,
		paddingTop: 12,
		paddingBottom: 12,
		cursor: "pointer",
		borderBottom: "1px solid #E5E7EB",
    backgroundColor:"#ffffff"
  }} className="mb-4 h-12 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent" {...register("vendor_type")} 
  onChange={e => set_vendor_type(Number(e.target.value))}
  >
    (
      {
        customer_types?.customer_type.sort((x:any, y:any)=>x.id-y.id).map((x:any) => 
        <option value={x.id}>{x.name}</option> )
      }
    )
            </select>
            </div>
          </Card>
        </div>

        <div className="flex flex-wrap my-5 sm:my-8">
          <Description
            title={t("common:attribute-values")}
            details={`${
              initialValues
                ? t("form:item-description-update")
                : t("form:item-description-add")
            } ${t("form:form-description-attribute-value")}`}
            className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <div>
              {fields.filter(x=> !x.vendor_type || x.vendor_type == vendor_type).map((item) => (
                <div
                  className="border-b border-dashed border-border-200 last:border-0 py-5 md:py-8"
                  key={item.id}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-5">
                    <Input
                      className="sm:col-span-2"
                      label={t("form:input-label-value-star")}
                      variant="outline"
                      readOnly={item.value}
                      {...register(`values.${fields.findIndex(x=>x.vendor_type == vendor_type && x.id == item.id && x.value == item.value)}.value` as const)}
                      defaultValue={item.value} // make sure to set up defaultValue
                      error={t(errors.values?.[fields.findIndex(x=>x.value == item.value)]?.value?.message)}
                    />
                    <Input
                      className="sm:col-span-2"
                      label={"Rate* (Metal/Gram), (Stone/Carat), (/Qty)"}
                      variant="outline"
                      {...register(`values.${fields.findIndex(x=>x.vendor_type == vendor_type && x.id == item.id && x.rate == item.rate)}.rate` as const)}
                      defaultValue={item.rate || 0} // make sure to set up defaultValue
                    />
                    <Input
                      className="sm:col-span-2"
                      label={t("form:input-label-meta")}
                      variant="outline"
                      {...register(`values.${fields.findIndex(x=>x.vendor_type == vendor_type && x.id == item.id && x.meta == item.meta)}.meta` as const)}
                      defaultValue={item.meta} // make sure to set up defaultValue
                    />

                  <Input
                      className="sm:col-span-2"
                      label={""}
                      type={"hidden"}
                      variant="outline"
                      {...register(`values.${fields.findIndex(x=>x.vendor_type == vendor_type && x.id == item.id)}.id` as const)}
                      defaultValue={item.id} // make sure to set up defaultValue
                    />
                    <button
                      onClick={() => {
                        if(initialValues && flattenedVariations.find((y:any)=>y.value == item.value && y.attribute?.name == initialValues?.name) || item.value.toUpperCase().includes("24KT"))
                        {
                          alert("Can not delete this attribute, first remove product which is mapped with this attribute");
                        }
                        else{
                          remove(fields.findIndex(x=>x.value == item.value));
                          remove(fields.findIndex(x=>x.value == item.value));
                          remove(fields.findIndex(x=>x.value == item.value));
                        }
                      }}
                      type="button"
                      className="text-sm text-red-500 hover:text-red-700 transition-colors duration-200 focus:outline-none sm:mt-4 sm:col-span-1"
                    >
                      {t("form:button-label-remove")}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Button
              type="button"
              onClick={() => 
                
                append({ value: "", meta: "", vendor_type:cloneDeep(vendor_type) })
              }
              className="w-full sm:w-auto"
            >
              {t("form:button-label-add-value")}
            </Button>

            {errors?.values?.message ? (
              <Alert
                message={t(errors?.values?.message)}
                variant="error"
                className="mt-5"
              />
            ) : null}

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

          <Button loading={creating || updating}>
            {initialValues
              ? `${t("form:item-description-update")} ${customer_types?.customer_type.find((x:any) => x.id == vendor_type)?.name}`
              : t("form:item-description-add")}{" "}
            {t("common:attribute")}
          </Button>
        </div>
      </form>
    </>
  );
}
