import Input from "@components/ui/input";
import TextArea from "@components/ui/text-area";
import { useForm, FormProvider } from "react-hook-form";
import Button from "@components/ui/button";
import Description from "@components/ui/description";
import Card from "@components/common/card";
import Label from "@components/ui/label";
import Radio from "@components/ui/radio/radio";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import FileInput from "@components/ui/file-input";
import { bannerValidationSchema } from "./banner-validation-schema";
import groupBy from "lodash/groupBy";
// import ProductVariableForm from "./product-variable-form";
// import ProductSimpleForm from "./product-simple-form";
// import ProductGroupInput from "./product-group-input";
// import ProductCategoryInput from "./product-category-input";
import orderBy from "lodash/orderBy";
import sum from "lodash/sum";
import cloneDeep from "lodash/cloneDeep";
// import ProductTypeInput from "./product-type-input";
import {
  Type,
  ProductType,
  Category,
  AttachmentInput,
  ProductStatus,
  UpdateBanner,
  VariationOption,
  Tag,
} from "@ts-types/generated";
import { useCreateBannerMutation } from "@data/banner/banner-create.mutation";
import { useTranslation } from "next-i18next";
import { useUpdateBannerMutation } from "@data/banner/banner-update.mutation";
import { useShopQuery } from "@data/shop/use-shop.query";
// import ProductTagInput from "./product-tag-input";
import Alert from "@components/ui/alert";
import { useState } from "react";
import { animateScroll } from "react-scroll";

import { useMeQuery } from "@data/user/use-me.query";

type Variation = {
  formName: number;
};

type FormValues = {
  sku: string;
  name: string;
  type: string;
  product_type: ProductType;
  description: string;
  unit: string;
  price: number;
  min_price: number;
  max_price: number;
  zero_inventory_fill:number;
  sale_price: number;
  quantity: number;
  categories: Category[];
  tags: Tag[];
  in_stock: boolean;
  is_taxable: boolean;
  image: AttachmentInput;
  gallery: AttachmentInput[];
  status: ProductStatus;
  width: string;
  height: string;
  length: string;
  isVariation: boolean;
  variations: Variation[];
  variation_options: Product["variation_options"];
  [key: string]: any;
};
const defaultValues = {
  sku: "",
  name: "",
  type: "small",
  productTypeValue: { name: "Variable Product", value: ProductType.Variable },
  description: "",
  unit: 0,
  makingCharges: 0,
  price: "",
  min_price: 0.0,
  max_price: 0.0,
  zero_inventory_fill:0,
  sale_price: "",
  quantity: "",
  categories: [],
  tags: [],
  in_stock: true,
  is_taxable: false,
  image: [],
  gallery: [],
  status: ProductStatus.Draft,
  width: "",
  height: "",
  length: "",
  isVariation: false,
  variations: [],
  variation_options: [],
};

type IProps = {
  initialValues?: UpdateBanner | null;
};

const productType = [
  { name: "Featured Product", value: ProductType.Simple },
  { name: "Variable Product", value: ProductType.Variable },
];
function getFormattedVariations(variations: any) {
  const variationGroup = groupBy(variations, "attribute.slug");
  return Object.values(variationGroup)?.map((vg) => {
    return {
      attribute: vg?.[0]?.attribute,
      value: vg?.map((v) => ({ id: v.id, value: v.value })),
    };
  });
}

export default function CreateOrUpdateBannerForm({ initialValues }: IProps) { 
  const { data:me } = useMeQuery();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { t } = useTranslation();
  const { data: shopData } = useShopQuery(router.query.shop as string, {
    enabled: !!router.query.shop,
  });
  const shopId = shopData?.shop?.id!;
  const methods = useForm<FormValues>({
    resolver: yupResolver(bannerValidationSchema),
    shouldUnregister: true,
    //@ts-ignore
    defaultValues: initialValues
      ? cloneDeep({
          ...initialValues,
          isVariation:
            initialValues.variations?.length &&
            initialValues.variation_options?.length
              ? true
              : false,
          productTypeValue: initialValues.product_type
            ? productType.find(
                (type) => initialValues.product_type === type.value
              )
            : productType[0],
          variations: getFormattedVariations(initialValues?.variations),
        })
      : defaultValues,
  });
  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = methods;

  const {
    mutate: createBanner,
    isLoading: creating,
  } = useCreateBannerMutation();
  const {
    mutate: updateBanner,
    isLoading: updating,
  } = useUpdateBannerMutation();

  const onSubmit = async (values: FormValues) => {
    const inputValues: any = {
      title: values.title,
      slug: values.slug,
      type: values.type,
      bannerType: values.bannerType || "",
      sequence:values.sequence || 0,
      imageMobileUrl: values.imageMobileUrl?.original || initialValues?.imageMobileUrl,
      imageMobileWidth: values.imageMobileWidth,
      imageMobileHeight: values.imageMobileHeight,
      imageDesktopUrl: values.imageDesktopUrl?.original || initialValues?.imageDesktopUrl,
      imageDesktopWidth: values.imageDesktopWidth,
      imageDesktopHeight: values.imageDesktopHeight,
    };

    if (initialValues) {
      updateBanner(
        {
          variables: {
            id: initialValues.id,
            input: inputValues,
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
      
      createBanner(
        {
          ...inputValues,
        },
        {
          onError: (error: any) => {
            if (error?.response?.data?.message) {
              setErrorMessage(error?.response?.data?.message);
              animateScroll.scrollToTop();
            } else {
              Object.keys(error?.response?.data).forEach((field: any) => {
                setError(field, {
                  type: "manual",
                  message: error?.response?.data[field][0],
                });
              });
            }
          },
        }
      );
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
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-wrap my-5 sm:my-8">
            <Description
              title={t("form:item-description")}
              details={`${
                initialValues
                  ? t("form:item-description-edit")
                  : t("form:item-description-add")
              } ${t("form:banner-description-help-text")}`}
              className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <Input
                label={`${t("form:banner-title")}*`}
                {...register("title")}
                variant="outline"
                className="mb-5"
              />

              <Input
                label={`${t("form:banner-slug")}*`}
                {...register("slug")}
                variant="outline"
                className="mb-5"
              />
              <label className="text-sm">Type*</label>
              <br/>
              <select
                {...register("type")}
                className="mb-5
                px-4 h-12 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading focus:outline-none focus:ring-0 border border-border-base focus:border-accent
                "
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                </select>
                <label className="text-sm">Banner Type*</label>
              <br/>
              <select
                {...register("bannerType")}
                className="mb-5
                px-4 h-12 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading focus:outline-none focus:ring-0 border border-border-base focus:border-accent
                "
              >
                <option value="vintageDemoGridBanner">Vintage Demo Grid Banner</option>
                <option value="vintageDemoBanner">Vintage Demo Banner</option>
                <option value="promotionBanner">Promotion Banner</option>
                <option value="miscBanner">Misc Banner</option>
                </select>
                <Input
                label={"Sequence"}
                defaultValue={0}
                {...register("sequence")}
                variant="outline"
                className="mb-5"
              />
              

            </Card>
          </div>

          <div className="flex flex-wrap pb-8 border-b border-dashed border-border-base my-5 sm:my-8">
            <Description
              title={t("form:mobile-image")}
              details={t("form:featured-image-help-text") + " (600KB max)"}
              className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
            <div 
                className="mb-5">
              <FileInput 
              name="imageMobileUrl" control={control} multiple={false} />
              { initialValues?.imageMobileUrl ? 
              <div>
              <label>Image On Server :</label>              
					<div className="flex items-center justify-center min-w-0 w-16 h-16 overflow-hidden bg-gray-300">
              <img src={initialValues?.imageMobileUrl} width={100} height={100} />
              </div>
              </div>
               : "" }
              </div>

            <Input
                label={`${t("form:mobile-image-width")}*`}
                {...register("imageMobileWidth")}
                variant="outline"
                className="mb-5"
              />

              <Input
                label={`${t("form:mobile-image-height")}*`}
                {...register("imageMobileHeight")}
                variant="outline"
                className="mb-5"
              />
            </Card>
          </div>

          <div className="flex flex-wrap pb-8 border-b border-dashed border-border-base my-5 sm:my-8">
            <Description
              title={t("form:desktop-image")}
              details={t("form:featured-image-help-text") + " (600KB max)"}
              className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
            <div 
                className="mb-5">
              <FileInput 
              name="imageDesktopUrl"
              control={control} multiple={false} 
              />
              { initialValues?.imageDesktopUrl ? 
              <div>
              <label>Image On Server :</label>
              <div className="flex items-center justify-center min-w-0 w-16 h-16 overflow-hidden bg-gray-300">
                  <img src={initialValues?.imageDesktopUrl} width={100} height={100} />
                  </div>
                  </div>
                   : "" }
              </div>
            <Input
                label={`${t("form:desktop-image-width")}*`}
                {...register("imageDesktopWidth")}
                variant="outline"
                className="mb-5"
              />

              <Input
                label={`${t("form:desktop-image-height")}*`}
                {...register("imageDesktopHeight")}
                variant="outline"
                className="mb-5"
              />
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
                ? "Update Banner"
                : t("form:button-label-add-banner")}
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
}
