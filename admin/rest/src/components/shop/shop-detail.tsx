import { MapPin } from "@components/icons/map-pin";
import { PhoneIcon } from "@components/icons/phone";
import { useModalAction } from "@components/ui/modal/modal.context";
import ReadMore from "@components/ui/truncate";
import { formatAddress } from "@utils/format-address";
import { isEmpty } from "lodash";
import { useTranslation } from "next-i18next";

const ShopDetail: React.FC<any> = ({}) => {
  const { t } = useTranslation();
  const { closeModal } = useModalAction();
  const shop = JSON.parse(localStorage.getItem("selectedShop") || "{}");
  return (
    <div className="p-4 pb-6 bg-gray-100 bg-white m-auto max-w-sm w-full rounded-md md:rounded-xl sm:w-[24rem]">
      <div style={{float:"right", cursor:"pointer"}} onClick={closeModal}>X</div>
    <div className="w-full h-full text-center">
      <div className="flex h-full flex-col justify-between">
      <h1 className="text-xl font-semibold text-heading mb-2">{name}</h1>
          <p className="text-sm text-body text-center">
            <ReadMore character={70}>{shop.description!}</ReadMore>
          </p>

          <div className="flex w-full justify-start mt-5">
            <span className="text-muted-light mt-0.5 me-2">
              <MapPin width={16} />
            </span>

            <address className="text-body text-sm not-italic">
              {!isEmpty(formatAddress(shop.address!))
                ? formatAddress(shop.address!)
                : t("common:text-no-address")}
            </address>
          </div>

          <div className="flex w-full justify-start mt-3">
            <span className="text-muted-light mt-0.5 me-2">
              <PhoneIcon width={16} />
            </span>
            <a href={`tel:${shop.settings?.contact}`} className="text-body text-sm">
              {shop.settings?.contact
                ? shop.settings?.contact
                : t("common:text-no-contact")}
            </a>
          </div>

    </div>
    </div>
    </div>
  );
};

export default ShopDetail;
