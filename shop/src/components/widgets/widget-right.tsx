import type { FC } from "react";
import { useSettings } from "@contexts/settings.context";
import { useTranslation } from "next-i18next";


const WidgetRight: FC = () => {
  const { t } = useTranslation();
  const settings = useSettings();

  return (
    <div className="px-0 max-w-5xl mx-auto space-y-4">

      <a href="https://play.google.com/store/apps/details?id=com.aviral.zweler&hl=en-IN" target="_blank" rel="noopener noreferrer">
      <img
          src="../assets/images/footerSide.jpg"
          alt="PlayStore Image"          
          className="image-class" 
          style={{ maxWidth: "100%", maxHeight: "100%" }}
        />
      </a>
    </div>
  );
};

export default WidgetRight;
