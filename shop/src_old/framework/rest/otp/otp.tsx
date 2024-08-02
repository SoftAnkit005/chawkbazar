import Button from "@components/ui/button";
import {
  useSendOtpCodeMutation,
  useVerifyOtpCodeMutation,
} from "@framework/auth/auth.query";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import Alert from "@components/ui/alert";
import MobileOtpInput from "react-otp-input";
import Label from "@components/ui/label";
import { useTranslation } from "next-i18next";
import "react-phone-input-2/lib/bootstrap.css";
import { getDirection } from "@utils/get-direction";
import { useRouter } from "next/router";
import axios from "axios";
import useUser from "@framework/auth/use-user";
interface OTPProps {
  defaultValue: string | undefined;
  onVerify: (phoneNumber: string) => void;
}
import https from 'https';


export const OTP: React.FC<OTPProps> = ({ defaultValue, onVerify }) => {
  const { t } = useTranslation("common");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [number, setNumber] = useState(defaultValue ?? "");
  const [otp, setOtp] = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const [hasOTP, setHasOTP] = useState(false);
  const [otpId, setOtpId] = useState("");

  const router = useRouter();
	const dir = getDirection(router.locale);

  const { mutate: verifyOtpCode, isLoading: otpVerifyLoading } =
    useVerifyOtpCodeMutation();
  const { mutate: sendOtpCode, isLoading: loading } = useSendOtpCodeMutation();
  const { me } = useUser();

    let otp_to_send = "";
    var digits = '0123456789';
    for (let i = 0; i < 6; i++ ) {
      otp_to_send += digits[Math.floor(Math.random() * 10)];
    }

  async function onSendCodeSubmission() {
    const agent = new https.Agent({  
      rejectUnauthorized: false
    });
    await axios.get("https://zweler.com/backend/is-user-contact-exists?mobile="+number.replaceAll("+91",""), { httpsAgent: agent }).then(async (result)=>{
    if(result.data == 1)
      {
        setErrorMessage('User Already Exist With The Number '+ number);
      }    
      else
      {
        if(number.includes("+91") && number.length <= 13)
          {
            setSentOtp(otp_to_send);
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
  }).catch(()=>{
      })
  }

  function onVerifyCodeSubmission() {
    if(sentOtp != otp)
    {
      return;
    }
    verifyOtpCode(
      {
        phone_number: number,
        code: otp,
        otp_id: otpId,
        user_id:me?.id
      },
      {
        onSuccess: (data) => {
          if (data?.success) {
            setErrorMessage(null);
            onVerify(number);
          } else {
            setErrorMessage(data?.message);
          }
          setHasOTP(false);
        },
        onError: (error: any) => {
          setErrorMessage(error?.response?.data?.message);
        },
      }
    );
}

  return (
    <>
      {!hasOTP ? (
        <div className={`flex items-center ${dir === 'rtl' ? 'rtl-view': 'ltr-view'}`}>
          <PhoneInput
            country={"in"}
            value={number}
            onChange={(phone) => {
              // Strip non-numeric characters to get only digits
              const numericPhone = phone.replace(/\D/g, '');          
              // Check if the numeric phone number has at least 10 digits
              if (numericPhone.length >= 12) {
                // Set the number state with the formatted phone number
                setNumber(`+${phone}`);
                setErrorMessage("");
              } else {
                setErrorMessage("Please enter a valid 10-digit phone number");
                {errorMessage && (
                  <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                    {errorMessage}
                  </p>
                )}
                // Do not update the number state if less than 10 digits
                // Optionally, you can display an error message or handle the condition
                // For example:
                // alert('Please enter a valid 10-digit phone number');
              }
            }}
            inputClass="!p-0 ltr:!pr-4 rtl:!pl-4 ltr:!pl-14 rtl:!pr-14 !flex !items-center !w-full !appearance-none !transition !duration-300 !ease-in-out !text-heading !text-sm focus:!outline-none focus:!ring-0 !border !border-gray-400 ltr:!border-r-0 rtl:!border-l-0 !rounded ltr:rounded-r-none rtl:rounded-l-none focus:!border-black !h-12"
            dropdownClass="focus:!ring-0 !border !border-gray-300 !shadow-350"
          />
          <Button
            loading={loading}
            disabled={loading}
            onClick={onSendCodeSubmission}
            className="ltr:rounded-l-none rtl:rounded-r-none flex-shrink-0 capitalize !h-12 !px-6"
          >
            {t("text-send-otp")}
          </Button>
        </div>
      ) : (
        <div className="w-full flex flex-col md:flex-row md:items-center md:space-x-5">
          <Label className="md:mb-0">{t("text-otp-code")}</Label>

          <MobileOtpInput
            value={otp}
            onChange={(value: string) => setOtp(value)}
            numInputs={6}
            separator={
              <span className="hidden sm:inline-block sm:mx-2">-</span>
            }
            containerStyle="justify-center space-x-2 sm:space-x-0 mb-5 md:mb-0"
            inputStyle="flex items-center justify-center !w-full sm:!w-11 appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-gray-400 rounded focus:border-heading h-12"
            disabledStyle="!bg-gray-100"
          />
          <Button
            loading={otpVerifyLoading}
            disabled={otpVerifyLoading}
            onClick={onVerifyCodeSubmission}
          >
            {t("text-verify-code")}
          </Button>
        </div>
      )}

      {errorMessage && (
        <Alert
          variant="error"
          message={t(errorMessage)}
          className="mt-4"
          closeable={true}
          onClose={() => setErrorMessage(null)}
        />
      )}
    </>
  );
}

