import type { FC } from "react";
import { useSettings } from "@contexts/settings.context";
import Logo from "@components/ui/logo";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { ROUTES } from "@lib/routes";

const WidgetImg: FC = () => {
  const { t } = useTranslation();
  const settings = useSettings();

  const contactDetails = settings?.contactDetails;

  return (
    <div>
      <h4 className="text-heading text-sm md:text-base xl:text-lg font-semibold mb-5 2xl:mb-6 3xl:mb-7" style={{ color: '#f1f7f7' }}>
        <img
          src="../assets/images/ZLogo.png"
          alt="Logo Image"          
          width={180} // Set the desired width
          height={180} // Set the desired height
          className="image-class" // Add a custom class for additional styling
        />
        {/* <Logo /> */}
      </h4>

      <ul className="text-xs md:text-[13px] lg:text-sm text-body flex flex-col space-y-3 lg:space-y-3.5" style={{ color: 'white' }}>
        <p style={{ color: 'white' }}>
          Zweler, today, is one of the best sourcing partner for all the retailers providing an exquisite collection with convenience.
        </p>
      </ul>
    </div>
  );
};

export default WidgetImg;
