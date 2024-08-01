import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";
import { API_ENDPOINTS } from "@framework/utils/endpoints";
import request from "@framework/utils/request";

export type ContactFormValues = {
  name: string;
  email: string;
  subject: string;
  description: string;
};

export type LuckyFormValues = {
  name: string;
  email: string;
  company: string;
  phone: number;
  address: string;
}

export const useContactMutation = () => {
  const { t } = useTranslation();

  return useMutation((input: ContactFormValues) => {
    return request
      .post(API_ENDPOINTS.CONTACT, input)
      .then((res) => res.data);
  }, {
    onError: (error: any) => {
      toast.error(t(`${error?.response?.data.message}`));
    }
  })
};

export const useLuckyMutation = () => {
  return useMutation((input: LuckyFormValues) => {
    return request
      .post(API_ENDPOINTS.LUCKY, input)
      .then((res) => res.data);
  }, {
    onError: (error: any) => {
      toast.error("something went wrong");
    }
  })
}
