import * as yup from "yup";

export const customerTypeValidationSchema = yup.object().shape({
  name: yup.string().required("form:error-name-required")
});
