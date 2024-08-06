import type { FC } from "react";
import { useSettings } from "@contexts/settings.context";
import { useTranslation } from "next-i18next";


const WidgetRight: FC = () => {
  const { t } = useTranslation();
  const settings = useSettings();

  return (
    <div>
      <a href="https://play.google.com/store/apps/details?id=com.aviral.zweler&hl=en-IN" target="_blank" rel="noopener noreferrer">
        <img src="../assets/images/play-store.png" alt="PlayStore Image" className="image-class h-[40px]" />
      </a>
      <a href="https://apps.apple.com/in/app/zweler/id6461119914" target="_blank" rel="noopener noreferrer">
        <img src="../assets/images/app-store.png" alt="AppStore Image" className="image-class h-[40px] mt-3" />
      </a>
    </div>
  );
};

export default WidgetRight;
