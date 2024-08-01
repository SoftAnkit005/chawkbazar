import { useAtom } from "jotai";
import isEmpty from "lodash/isEmpty";
import dynamic from "next/dynamic";
import { verifiedResponseAtom } from "@store/checkout";
import {
  couponAtom
} from '@store/checkout';

const UnverifiedItemList = dynamic(
  () => import("@components/checkout/item/unverified-item-list")
);
const VerifiedItemList = dynamic(
  () => import("@components/checkout/item/verified-item-list")
);

let counter = 0;

export const RightSideView = () => {
  const [coupon, setCoupon] = useAtom(couponAtom);
  if(!counter)
  {
    setCoupon(null);
    counter++;
  }
  const [verifiedResponse] = useAtom(verifiedResponseAtom);
  if (isEmpty(verifiedResponse)) {
    return <UnverifiedItemList />;
  }
  return <VerifiedItemList className="border border-gray-300 rounded-md" />;
};

export default RightSideView;
