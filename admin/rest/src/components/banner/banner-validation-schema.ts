import { BannerType } from "@ts-types/generated";
import * as yup from "yup";

export const bannerValidationSchema = yup.object().shape({
  title: yup.string().required("form:error-banner-title-required"),
  type: yup.string().required("form:error-banner-type-required"),
  bannerType: yup.string().required("form:error-banner-sub-type-required"),
  slug: yup.string().required("form:error-slug-required"),
  imageMobileWidth: yup.string().required("form:error-mobile-width-required"),
  imageMobileHeight: yup.string().required("form:error-mobile-height-required"),
  imageDesktopWidth: yup.string().required("form:error-desktop-width-required"),
  imageDesktopHeight: yup.string().required("form:error-desktop-height-required"),
});
