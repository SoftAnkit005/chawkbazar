import Input from "@components/ui/input";
import Button from "@components/ui/button";
import { useForm } from "react-hook-form";
import TextArea from "@components/ui/text-area";
import { useTranslation } from "next-i18next";
import {
  DesignFormValues,
  useDesignMutation,
} from "@framework/upload-design/upload-design.mutation";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import Uploader from "../uploader";
import { useEffect, useState } from "react";
import Image from "next/image";
import ringImage from '/public/assets/images/form_ring.png'


const uploadFormSchema = yup.object().shape({
  fullname: yup.string().required("forms:error-name-required"),
  budget: yup.string().required("forms:error-fullname-required"),
  email: yup
    .string()
    .email("forms:error-email-format")
    .required("forms:error-email-required"),
    mobile: yup
    .string()
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      "Phone number is not valid"
    )
    .required("forms:error-mobile-required"),
detail: yup.string().required("forms:error-detail-required"),
image: yup.array().required("Jewellery design required"),
});

const defaultValues = {
  fullname: "",
  mobile: "",
  budget: "",
  email: "",
  detail: "",
  image: [],
};

const UploadYourDesignForm: React.FC = () => {
  const { t } = useTranslation();
  const { mutate, isLoading: loading } = useDesignMutation();
  const [image, setImage] = useState([]);
  const [emptyImage, setEmptyImage] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DesignFormValues>({
    resolver: yupResolver(uploadFormSchema),
    defaultValues,
  });

  async function onSubmit(values: DesignFormValues) {
    toast.success(t("upload-design-success-message"));
    reset();
    setEmptyImage(true);
    values = {
      ...values,
      image
    }
    // await mutate(values, {
    //   onSuccess: (data) => {
    //     if (data?.success) {
    //       toast.success(t("upload-design-success-message"));
    //     } else {
    //       toast.error(t(data?.message!));
    //     }
    //   },
    // });
  }
  const onSetImage = (image:[]) => {
    setImage(image);
  };

  const [windowWidth, setwindowWidth] = useState(0)
  useEffect(() => {
    setwindowWidth(window.innerWidth);
  }, []);

  console.log(windowWidth);

  return (
    <>
      <style>
        {`
            @media only screen and (max-width: 1500px) {
              .ringImg {
                max-height:150px
              }
            }
        `}
      </style>
      <h4 className="text-heading text-sm xl:text-lg font-semibold mb-2 mx-auto lg:mx-0">Drop Png, JPG</h4>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full mx-auto block lg:flex flex-row justify-between gap-5 relative px-5" noValidate >
        <div className="md:w-8/12 lg:w-6/12 2xl:w-5/12 flex flex-col h-full m-2 mx-auto lg:mx-0 mb-9">
          {/* <FileInput name="gallery" control={control} /> */}
          <Uploader onSetImage={onSetImage} emptyImage={emptyImage} page="personalizeJewellery"/>
        </div>
        <div className="flex flex-col space-y-5 md:w-8/12 lg:w-6/12 2xl:w-5/12 mx-auto mx-auto lg:mx-0 ">
          <div className="flex flex-col md:flex-row space-y-5 md:space-y-0">
            <Input
              labelKey="forms:label-fullname-required"
              // placeholderKey="forms:placeholder-fullname"
              {...register("fullname")}
              className="w-full md:w-1/2 flex flex-col justify-between"
              errorKey={t(errors.fullname?.message!)}
              variant="solid"
            />
            <Input
              labelKey="forms:label-email-required"
              type="email"
              // placeholderKey="forms:placeholder-email"
              {...register("email")}
              className="w-full md:w-1/2 ltr:md:ml-2.5 ltr:lg:ml-5 rtl:md:mr-2.5 rtl:lg:mr-5 mt-2 md:mt-0 flex flex-col justify-between"
              errorKey={t(errors.email?.message!)}
              variant="solid"
            />
          </div>
          <div className="flex flex-col md:flex-row space-y-5 md:space-y-0">
            <Input
              labelKey="forms:label-mobile-required"
              {...register("mobile")}
              className="w-full md:w-1/2 flex flex-col justify-between"
              // placeholderKey="forms:placeholder-mobile"
              errorKey={t(errors.mobile?.message!)}
              variant="solid"
            />
            <Input
              labelKey="forms:label-budget"
              {...register("budget")}
              className="w-full md:w-1/2 ltr:md:ml-2.5 ltr:lg:ml-5 rtl:md:mr-2.5 rtl:lg:mr-5 mt-2 md:mt-0 flex flex-col justify-between"
              // placeholderKey="forms:placeholder-budget"
              variant="solid"
            />
          </div>
          <TextArea
            labelKey="forms:label-details-required"
            {...register("detail")}
            className="relative mb-4"
            // placeholderKey="forms:placeholder-details"
            errorKey={t(errors.detail?.message!)}
          />
          <div className="relative pb-10">
            <Button
              loading={loading}
              type="submit"
              className="h-12 lg:h-14 mt-1 text-sm lg:text-base w-full sm:w-auto mb-5"
            >
              {t("common:button-submit")}
            </Button>
            <div className={`absolute right-[-100px] top-[-70px] ${(windowWidth > 767)?'':'hidden'}`}>
              <Image height={(windowWidth > 1200)?250:200} width={(windowWidth > 1200)?300:250} src={ringImage}/>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default UploadYourDesignForm;