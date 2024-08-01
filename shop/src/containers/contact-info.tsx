import { FC } from "react";
// import { IoLocationSharp } from "@react-icons/all-files/io5/IoLocationSharp";
// import { IoMail } from "@react-icons/all-files/io5/IoMail";
// import { IoCallSharp } from "@react-icons/all-files/io5/IoCallSharp";
import { useTranslation } from "next-i18next";
import { useSettings } from "@contexts/settings.context";
import isEmpty from "lodash/isEmpty";

interface Props {
  image?: HTMLImageElement;
}

const ContactInfoBlock: FC<Props> = () => {
  const settings = useSettings();

  const { t } = useTranslation("common");
  return (
    <div className="mb-6 lg:border lg:rounded-md border-gray-300 lg:p-7">
      <h4 className="text-2xl md:text-lg font-bold text-heading pb-7 md:pb-10 lg:pb-6 -mt-1">
        {t("text-find-us-here")}
      </h4>

      {/* Address */}
      <div className="flex pb-7">
        <div className="flex flex-shrink-0 justify-center items-center p-1.5 border rounded-md border-gray-300 w-10 h-10">
          {/* <IoLocationSharp /> */}
        </div>
        <div className="flex flex-col ltr:pl-3 ltr:2xl:pl-4 rtl:pr-3 rtl:2xl:pr-4 text-sm md:text-base">
          <h5 className="text-sm font-bold text-heading">
            {t("text-address")}
          </h5>
          <p>224, 2ND FLOOR, ZENON, Bamroli Rd, Khatodra Wadi, Surat, Gujarat 395002</p>
        </div>
      </div>

      {/* Email */}
      <div className="flex pb-7">
        <div className="flex flex-shrink-0 justify-center items-center p-1.5 border rounded-md border-gray-300 w-10 h-10">
          {/* <IoMail /> */}
        </div>
        <div className="flex flex-col ltr:pl-3 ltr:2xl:pl-4 rtl:pr-3 rtl:2xl:pr-4 text-sm md:text-base">
          <h5 className="text-sm font-bold text-heading">{t("text-email")}</h5>
          {settings?.contactDetails.email
            ? settings?.contactDetails.email
            : t("text-no-email")}
        </div>
      </div>

      {/* Phone */}
      <div className="flex pb-7">
        <div className="flex flex-shrink-0 justify-center items-center p-1.5 border rounded-md border-gray-300 w-10 h-10">
          {/* <IoCallSharp /> */}
        </div>
        <div className="flex flex-col ltr:pl-3 ltr:2xl:pl-4 rtl:pr-3 rtl:2xl:pr-4 text-sm md:text-base">
          <h5 className="text-sm font-bold text-heading">{t("text-phone")}</h5>
          {settings?.contactDetails.contact ? (
            settings?.contactDetails.contact
          ) : (
            <p className="text-red-500">{t("text-no-phone")}</p>
          )}
        </div>
      </div>

      {/* Google Map */}
      {!isEmpty(settings?.contactDetails?.location) && (
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.4000894412497!2d72.82399667530919!3d21.176259682696134!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f0698bff5e5%3A0x5335cb03483c54f5!2sZWELER!5e0!3m2!1sen!2sin!4v1702036729876!5m2!1sen!2sin" width="360" height="400" style={{border:0}} loading="lazy"></iframe>
      )}
    </div>
  );
};

export default ContactInfoBlock;
