import Input from "@components/ui/input";
import PasswordInput from "@components/ui/password-input";
import Button from "@components/ui/button";
import { useForm } from "react-hook-form";
import Logo from "@components/ui/logo";
import { useUI } from "@contexts/ui.context";
import Link from "@components/ui/link";
import { ROUTES } from "@lib/routes";
import { useTranslation } from "next-i18next";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Alert from "@components/ui/alert";
import React, { useState } from "react";
import { useRegisterMutation } from "@framework/auth/auth.query";
import { AUTH_TOKEN } from "@lib/constants";
import { useAtom } from "jotai";
import { authorizationAtom } from "@store/authorization-atom";
import Cookies from "js-cookie";
import {useRouter} from "next/router";
import TextArea from "@components/ui/text-area";

interface SignUpInputType {
  email: string;
  password: string;
  name: string;
}

const registerFormSchema = yup.object().shape({
  name: yup.string().required("forms:name-required"),
  email: yup
    .string()
    .email("forms:email-error")
    .required("forms:email-required"),
  password: yup.string().required("forms:password-required"),
});

const defaultValues = {
  name: "",
  email: "",
  password: "",
};

const businessAccountFormSchema = yup.object().shape({
  name: yup.string().required("forms:name-required"),
  email: yup
  .string()
  .email("forms:email-error")
  .required("forms:email-required"),
password: yup.string().required("forms:password-required")
});

interface BusinessAccountInputType {
  email: string;
  password: string;
  name: string;
  type: string;
gst: string;
mobile: string;
country: string;
state: string;
city: string;
zipcode: string;
straddress: string;
customer_type: number;
is_approved:number;
}

const defaultBusinessValues = {
  name: "",
  email: "",
  password: "",
  type: "Business",
gst: "",
mobile: "",
country: "",
state: "",
city: "",
zipcode: "",
straddress: "",
customer_type: 1,
is_approved:0
};

const BusinessAccountForm: React.FC<Props> = ({ layout = "modal" }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<BusinessAccountInputType>({
    resolver: yupResolver(businessAccountFormSchema),
    defaultValues:defaultBusinessValues,
  });
  const router = useRouter();
  const { mutate: signUp }: any = useRegisterMutation();
  const [_, authorize] = useAtom(authorizationAtom);
  const { setModalView, openModal, closeModal } = useUI();
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState("");



  function onSubmit({ name, email, password,
    type,
    gst,
    mobile,
    country,
    state,
    city,
    zipcode,
    straddress 
  }: BusinessAccountInputType) {
    signUp(
      {
        name,
        email,
        password,
        type,
        gst,
        mobile,
        country,
        state,
        city,
        zipcode,
        straddress,
        customer_type:1,
        is_approved:0,
      },
      {
        onSuccess: (data: any) => {
          if (data?.token && data?.permissions?.length) {
            Cookies.set(AUTH_TOKEN, data.token);
            authorize(true);

            if (layout === "page"){
              // Redirect to the my-account page
              return router.push(ROUTES.ACCOUNT);
            }else {
              closeModal();
              return;
            }
          }
          if (!data.token) {
            setErrorMessage(t("forms:error-credential-wrong"));
          }
        },
        onError: (error: any) => {
          const {
            response: { data },
          }: any = error ?? {};
          Object.keys(data).forEach((field: any) => {
            setError(field, {
              type: "manual",
              message: data[field][0],
            });
          });
        },
      }
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="italic">
  <p>
    <strong>NOTE:</strong> This is Business Only section. Your Business Account Request will be Verified and Checked by our Team and we may contact you for the same. It may take us <strong>up to 24 hours</strong> to get back to you.
  </p><br></br>
</div>
              <Input
                labelKey="Your E-Mail"
                {...register("email")}
                variant="solid"
                className="mb-5"
                errorKey={errors.email?.message}
              />
<PasswordInput
            labelKey="forms:label-password-star"
            errorKey={errors.password?.message}
            className="mb-5"
            {...register("password")}
          />
            <Input
              labelKey={"Company Name"}
              {...register("name")}
            variant="solid"
              className="mb-5"
              errorKey={errors.name?.message}
            />
            <Input
              labelKey={"GSTIN"}
              {...register("gst")}
            variant="solid"
              
              className="mb-5"
              errorKey={errors.gst?.message}
            />
           
            <Input
              labelKey={"Mobile Number"}
              {...register("mobile")}
            variant="solid"
              
              className="mb-5"
              onKeyPress={(event) => {
                
                const inputValue = event.target.value;        
                
                if (
                  (inputValue === "" && event.key === "+") ||
                  event.key === "Backspace" ||
                  event.key.match(/^[0-9]+$/)
                ) {
                  // Allow the keypress
                } else {
                  event.preventDefault();
                }
              }}
              errorKey={errors.mobile?.message}
            />
            <Input
              labelKey={"Country"}
              {...register("country")}
            variant="solid"
              
              className="mb-5"
              errorKey={errors.country?.message}
            />
            <Input
              labelKey={"State"}
              {...register("state")}
            variant="solid"
              
              className="mb-5"
              errorKey={errors.state?.message}
            />
            <Input
              labelKey={"City"}
              {...register("city")}
            variant="solid"
              
              className="mb-5"
              errorKey={errors.city?.message}
            />
            
            <Input
              labelKey={"Zip Code"}
            variant="solid"
              {...register("zipcode")}
              className="mb-5"
              errorKey={errors.zipcode?.message}
            />
            <TextArea
              labelKey={"Street Address"}
              {...register("straddress")}
              variant="outline"
              errorKey={errors.straddress?.message}
            />


      {/* Add more form fields as needed */}
      <div className="relative">
      <div className="text-center">
        <Button type="submit">Submit for Approval</Button>
      </div>
      </div>
    </form>
  );
};

type Props = {
  layout?: "modal" | "page";
}

const SignUpForm: React.FC<Props> = ({ layout = "modal" }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState("");
  const [_, authorize] = useAtom(authorizationAtom);
  const { mutate: signUp, isLoading }: any = useRegisterMutation();
  const { setModalView, openModal, closeModal } = useUI();
  const [selectedOption, setSelectedOption] = useState("option1"); // Initialize with "option1"

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignUpInputType>({
    resolver: yupResolver(registerFormSchema),
    defaultValues,
  });

  function handleSignIn() {
    if (layout === "modal"){
      setModalView("LOGIN_VIEW");
      return openModal();
    }else {
      router.push(`${ROUTES.LOGIN}`);
    }
  }

  function onSubmit({ name, email, password }: SignUpInputType) {
    signUp(
      {
        name,
        email,
        password,
      },
      {
        onSuccess: (data: any) => {
          if (data?.token && data?.permissions?.length) {
            Cookies.set(AUTH_TOKEN, data.token);
            authorize(true);

            if (layout === "page"){
              // Redirect to the my-account page
              return router.push(ROUTES.ACCOUNT);
            }else {
              closeModal();
              return;
            }
          }
          if (!data.token) {
            setErrorMessage(t("forms:error-credential-wrong"));
          }
        },
        onError: (error: any) => {
          const {
            response: { data },
          }: any = error ?? {};
          Object.keys(data).forEach((field: any) => {
            setError(field, {
              type: "manual",
              message: data[field][0],
            });
          });
        },
      }
    );
  }

  return (
    <div className="py-5 px-5 sm:px-8 bg-white mx-auto rounded-lg w-full sm:w-96 md:w-450px border border-gray-300">
      <div className="text-center mb-6 pt-2.5">
        <div onClick={closeModal}>
          <Logo />
        </div>
        <div className="text-sm sm:text-base text-body text-center mt-5 mb-1">
          {t("common:text-have-account")}{" "}
          <button
            type="button"
            className="text-sm sm:text-base text-heading underline font-bold hover:no-underline focus:no-underline focus:outline-none"
            onClick={handleSignIn}
          >
            {t("common:text-login")}
          </button>
        </div>
        
        <div className="flex flex-col items-center justify-center relative text-sm text-heading mt-6 mb-3.5">
          <hr className="w-full border-gray-300" />
          <span className="absolute -top-2.5 px-2 bg-white">
            {t("common:text-or")}
          </span>
        </div>
        <p className="text-sm md:text-base text-body mt-2 mb-8 sm:mb-10">
          {t("common:registration-helper")}{" "}
          <Link
            href={ROUTES.TERMS}
            className="text-heading underline hover:no-underline focus:outline-none"
          >
            {t("common:text-terms")}
          </Link>{" "}
          &amp;{" "}
          <Link
            href={ROUTES.POLICY}
            className="text-heading underline hover:no-underline focus:outline-none"
          >
            {t("common:text-policy")}
          </Link>
        </p>
      </div>

      <div className="mb-4">
  <div className="flex items-center space-x-4">
    <input
      type="radio"
      id="signupOption1"
      name="signupOption"
      value="option1"
      defaultChecked 
      checked={selectedOption === "option1"} 
      onChange={() => setSelectedOption("option1")} 
    />
    <label htmlFor="signupOption1">Consumer</label>

    <input
      type="radio"
      id="signupOption2"
      name="signupOption"
      value="option2"
      checked={selectedOption === "option2"} 
      onChange={() => setSelectedOption("option2")} 
    />
    <label htmlFor="signupOption2">Retailer's Business Account</label>
  </div>
</div>




      {errorMessage && <Alert message={errorMessage} className="my-3" />}
      <div className={`mb-4 ${selectedOption === "option1" ? 'block' : 'hidden'}`}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-center"
        noValidate
      >
        <div className="flex flex-col space-y-4">
          <Input
            labelKey="forms:label-name-star"
            type="text"
            variant="solid"
            {...register("name")}
            errorKey={errors.name?.message}
          />
          <Input
            labelKey="forms:label-email-star"
            type="email"
            variant="solid"
            {...register("email")}
            errorKey={errors.email?.message}
          />
          <PasswordInput
            labelKey="forms:label-password-star"
            errorKey={errors.password?.message}
            {...register("password")}
          />
          <div className="relative">
            <Button
              type="submit"
              loading={isLoading}
              disabled={isLoading}
              className="h-11 md:h-12 w-full mt-2"
            >
              {t("common:text-register")}
            </Button>
          </div>
        </div>
      </form>
      </div>

      <div className={`mb-4 ${selectedOption === "option2" ? 'block' : 'hidden'}`}>
        <BusinessAccountForm />
      </div>


    </div>
  );
};

export default SignUpForm;
