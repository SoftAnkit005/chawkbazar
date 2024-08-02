import type { FC } from "react";
import { useSettings } from "@contexts/settings.context";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { ROUTES } from "@lib/routes";

const WidgetContact: FC = () => {
  const { t } = useTranslation();
  const settings = useSettings();

  const contactDetails = settings?.contactDetails;

  return (
    <div>
      <h4 className="text-heading text-sm md:text-base xl:text-lg font-semibold mb-5 2xl:mb-6 3xl:mb-7" style={{ color: '#f1f7f7' }}>
        {t(`text-contact`)}
      </h4>
      <ul className="text-xs md:text-[13px] lg:text-sm text-body flex flex-col space-y-3 lg:space-y-3.5" style={{ color: 'white' }}>
        {ROUTES?.CONTACT && (
          <li className="flex items-baseline">
            <Link href={ROUTES.CONTACT}>
              <a className="transition-colors duration-200 hover:text-black" style={{ color: 'white' }}>
                {t(`text-page-contact-us`)}
              </a>
            </Link>
          </li>
        )}

{ROUTES?.PERSONALIZE_YOUR_JEWELLERY && (
          <li className="flex items-baseline">
            <Link href={ROUTES.PERSONALIZE_YOUR_JEWELLERY}>
              <a className="transition-colors duration-200 hover:text-black" style={{ color: 'white' }}>
                {t(`text-page-personalize-your-jewellery`)}
              </a>
            </Link>
          </li>
        )}


        {contactDetails?.email && (
          <li className="flex items-baseline" style={{ color: 'white' }}>
            {t("text-email")}: {contactDetails.email}
          </li>
        )}

        {contactDetails?.website && (
          <li className="flex items-baseline" style={{ color: 'white' }}>
            {t("text-website")}:
            <Link href={contactDetails.website}>
              <a className="transition-colors duration-200 hover:text-black ml-1" style={{ color: 'white' }}>
                {contactDetails.website}
              </a>
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default WidgetContact;