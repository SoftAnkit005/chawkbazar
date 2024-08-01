import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";
import { API_ENDPOINTS } from "@framework/utils/endpoints";
import request from "@framework/utils/request";

export type DesignFormValues = {
  fullname: string,
  mobile: string,
  budget: string,
  email: string,
  detail: string
  image: {
    [key:string]:any
  }
};

export declare type Attachment = {
    thumbnail?: string;
    original?: string;
    id?: number;
  };

export const useDesignMutation = () => {
  const { t } = useTranslation();

  return useMutation(async (input: DesignFormValues) => {
    const res = await request
          .post(API_ENDPOINTS.UPLOAD_DESIGN, input);
      return res.data;
  }, {
    onError: (error: any) => {
      toast.error(t(`${error?.response?.data.message}`));
    }
  })
};

export const useUploadMutation = () => {
    const { t } = useTranslation();
  
    return useMutation(async (input: any) => {
        console.log(input,"input------")
      let formData = new FormData();
        input.forEach((attachment: any) => {
        formData.append("attachment[]", attachment);
      });
      const options = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
      const res = await request
            .post(API_ENDPOINTS.UPLOAD_DESIGN_IMAGE, formData,options );
        return res.data;
    }, {
      onError: (error: any) => {
        toast.error(t(`${error?.response?.data.message}`));
      }
    })
  };
