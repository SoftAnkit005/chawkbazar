import { ProductType } from "@ts-types/generated";
import * as yup from "yup";

export const productValidationSchema = yup.object().shape({
  name: yup.string().required("form:error-name-required"),
  stylecode: yup.string().required("form:error-name-required"),
  productTypeValue: yup.object().required("form:error-product-type-required"),
  sku: yup.mixed().when("productTypeValue", {
    is: (productType: {
      name: string;
      value: string;
      [key: string]: unknown;
    }) => productType?.value === ProductType.Simple,
    then: yup.string().nullable().required("form:error-sku-required"),
  }),
  price: yup.mixed().when("productTypeValue", {
    is: (productType: {
      name: string;
      value: string;
      [key: string]: unknown;
    }) => productType?.value === ProductType.Simple,
    then: yup
      .number()
      .typeError("form:error-price-must-number")
      .positive("form:error-price-must-positive")
      .required("form:error-price-required"),
  }),
  sale_price: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .lessThan(yup.ref("price"), "Sale Price should be less than ${less}")
    .min(0,"form:error-sale-price-must-positive"),
  size:yup
  .number()
  .transform((value) => (isNaN(value) ? undefined : value))
  .positive("Size must be positive")
  .max(10,"Size must be less than or equal to 10"),
  discount:yup
  .number()
  .transform((value) => (isNaN(value) ? undefined : value))
  .positive("Discount must be positive")
  .min(0,"Discount must be greater than or equal to 0").max(100,"Discount must be less than or equal to 100"),
  rate_per_unit:yup
  .number()
  .transform((value) => (isNaN(value) ? undefined : value))
  .positive("Rate Per Carat must be positive"),
  unit: yup.string().required("form:error-unit-required"),
  type: yup.object().nullable().required("form:error-type-required"),
  variation_options: yup.array().of(
    yup.object().shape({
      price: yup
        .number()
        .typeError("form:error-price-must-number")
        .required("form:error-price-required"),
      sale_price: yup
        .number()
        .transform((value) => (isNaN(value) ? undefined : value))
        .lessThan(yup.ref("price"), "Sale Price should be less than ${less}")
        .positive("form:error-sale-price-must-positive"),
      quantity: yup
        .number()
        .typeError("form:error-quantity-must-number")
        .integer("form:error-quantity-must-integer")
        .required("form:error-quantity-required"),
      sku: yup.string().required("form:error-sku-required"),
    })
  ),
});
