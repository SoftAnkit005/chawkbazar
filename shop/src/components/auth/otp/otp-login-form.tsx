import Button from "@components/ui/button";
import {
  useOtpLoginMutation,
  useSendOtpCodeMutation,
} from "@framework/auth/auth.query";
import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import Alert from "@components/ui/alert";
import MobileOtpInput from "react-otp-input";
import Label from "@components/ui/label";
import { useTranslation } from "next-i18next";
import "react-phone-input-2/lib/bootstrap.css";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { getDirection } from "@utils/get-direction";
import { useRouter } from "next/router";
import axios from "axios";
import https from 'https';

interface OTPProps {
  onLoginSuccess: (token: string) => void;
}

const defaultValues = {
  name: "",
  email: "",
  code: "",
};

const otpLoginFormSchema = yup.object().shape({
  email: yup
    .string()
    .email("forms:error-email-format")
    .when("isContactExist", {
      is: false,
      then: yup.string().required("forms:error-email-required"),
    }),
  name: yup.string().when("isContactExist", {
    is: false,
    then: yup.string().required("forms:error-name-required"),
  }),
  code: yup
    .string()
    .required("forms:error-code-required")
    .min(6, "forms:error-min-code"),
});

export const OTPLoginForm: React.FC<OTPProps> = ({ onLoginSuccess }) => {
  const { t } = useTranslation("common");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasOTP, setHasOTP] = useState(false);
  const [otpId, setOtpId] = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const [number, setNumber] = useState("");
  const [isContactExist, setIsContactExist] = useState(false);
  const { mutate: sendOtpCode, isLoading: loading } = useSendOtpCodeMutation();
  const { mutate: otpLogin, isLoading: otpLoginLoading } =
    useOtpLoginMutation();

  const router = useRouter();
	const dir = getDirection(router.locale);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...defaultValues,
      isContactExist,
    },
    resolver: yupResolver(otpLoginFormSchema),
    shouldUnregister: true,
  });

  let otp_to_send = "";
    var digits = '0123456789';
    for (let i = 0; i < 6; i++ ) {
      otp_to_send += digits[Math.floor(Math.random() * 10)];
    }

  function onOtpLoginSubmission(values: any) {
    if(sentOtp != values?.code)
    {
      return;
    }
    otpLogin(
      {
        ...values,
        phone_number: number,
        otp_id: otpId,
      },
      {
        onSuccess: (data) => {
          if (data?.token && data?.permissions?.length) {
            onLoginSuccess(data?.token);
          }

          if (!data?.token) {
            setErrorMessage("text-otp-verify-failed");
          }
        },
        onError: (error: any) => {
          console.log("Error", error);
          setErrorMessage(error?.response?.data?.message);
        },
      }
    );
  }
  async function onSendCodeSubmission() {
    if(number.includes("+91") && number.length <= 13)
    {
      setSentOtp(otp_to_send);
      const agent = new https.Agent({  
  rejectUnauthorized: false
});
      await axios.get("https://zweler.com/backend/send-manual-otp-code?mobile="+number.replaceAll("+91","")+"&otp="+otp_to_send, { httpsAgent: agent }).then(()=>{
      }).catch(()=>{
      })
      setHasOTP(true);
      sendOtpCode(
        {
          phone_number: number,
        },
        {
          onSuccess: (data: any) => {
            if (data?.success) {
            }
            if (!data?.success) {
            }
          },
          onError: (error: any) => {
          },
        }
      );
    }
    else{
      return;
    }
  }
  return (
    <>
      {errorMessage && (
        <Alert
          variant="error"
          message={t(errorMessage)}
          className="mb-4"
          closeable={true}
          onClose={() => setErrorMessage(null)}
        />
      )}

      {!hasOTP ? (
        <div className={`flex items-center ${dir === 'rtl' ? 'rtl-view': 'ltr-view'}`}>
          <PhoneInput
            country={"in"}
            value={number}
            onChange={(phone) => {
              const numericPhone = phone.replace(/\D/g, '');          
              if (numericPhone.length >= 12) {
                setNumber(`+${phone}`);
                setErrorMessage("");
              } else {
                setErrorMessage("Please enter a valid 10-digit phone number");
                {errorMessage && (
                  <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                    {errorMessage}
                  </p>
                )}
              }
            }}
            inputClass="!p-0 ltr:!pr-4 rtl:!pl-4 ltr:!pl-14 rtl:!pr-14 !flex !items-center !w-full !appearance-none !transition !duration-300 !ease-in-out !text-heading !text-sm focus:!outline-none focus:!ring-0 !border !border-gray-400 ltr:!border-r-0 rtl:!border-l-0 !rounded ltr:!rounded-r-none rtl:!rounded-l-none focus:!border-black !h-12"
            dropdownClass="focus:!ring-0 !border !border-gray-300 !shadow-350"
          />
          <Button
            loading={loading}
            disabled={loading}
            onClick={onSendCodeSubmission}
            className="ltr:!rounded-l-none rtl:!rounded-r-none flex-shrink-0 capitalize !h-12 !px-6"
          >
            {t("text-send-otp")}
          </Button>
        </div>
      ) : (
        <div className="w-full flex flex-col md:flex-row md:items-center md:space-x-5">
          <form onSubmit={handleSubmit(onOtpLoginSubmission)}>
            <div className="flex flex-col space-y-4">
              <div>
                <Label>{t("text-otp-code")}</Label>

                <Controller
                  control={control}
                  render={({
                    field: { onChange, onBlur: _, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <MobileOtpInput
                        value={value}
                        onChange={onChange}
                        numInputs={6}
                        separator={
                          <span className="hidden sm:inline-block sm:mx-2">
                            -
                          </span>
                        }
                        containerStyle="justify-center space-x-2 sm:space-x-0 mb-5 md:mb-0"
                        inputStyle="flex items-center justify-center !w-full sm:!w-11 appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-gray-400 rounded focus:border-heading h-12"
                        disabledStyle="!bg-gray-100"
                      />
                      {error && (
                        <p className="my-2 text-xs text-red-500">
                          {t(error?.message)}
                        </p>
                      )}
                    </>
                  )}
                  name="code"
                  defaultValue=""
                />
              </div>

              <div className="relative">
                <Button
                  type="submit"
                  loading={otpLoginLoading}
                  disabled={otpLoginLoading}
                  className="h-11 md:h-12 w-full mt-1.5"
                >
                  {t("common:text-login")}
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
