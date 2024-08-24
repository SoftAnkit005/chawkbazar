import useUser from "@framework/auth/use-user";
import { Product } from "@framework/types";
import usePrice from "@lib/use-price";
import { orderBy, round } from "lodash";
import isEmpty from "lodash/isEmpty";
import React from "react";

type Props = {
  minPrice: number;
  maxPrice: number;
  selectedVariation?: any;
  basePriceClassName?: string;
  discountPriceClassName?: string;
};

const stone_extra = 2;
const making_extra = 3;
const wastage_extra = 3;

const VariationPrice: React.FC<Props> = ({
  selectedVariation,
  minPrice,
  maxPrice,
  basePriceClassName = "text-heading font-semibold text-base md:text-xl lg:text-2xl",
  discountPriceClassName = "font-segoe text-gray-400 text-base lg:text-xl ltr:pl-2.5 rtl:pr-2.5 -mt-0.5 md:mt-0",
}: any) => {
  const { price, basePrice } = usePrice(
    selectedVariation && {
      amount: selectedVariation.sale_price
        ? selectedVariation.sale_price
        : selectedVariation.price,
      baseAmount: selectedVariation.price,
    }
  );

  const { me } = useUser();
  var date1 = new Date();
  var date2 = new Date();
  var Difference_In_Time = 50;
  var Difference_In_Days = 50;

  if (me && me?.created_at) {
    date1 = new Date(me?.created_at);
    date2 = new Date();
    Difference_In_Time = date2.getTime() - date1.getTime();
    Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
  }
  const { price: min_price } = usePrice({
    amount: minPrice,
  });

  const { price: max_price } = usePrice({
    amount: maxPrice,
  });

  let userType = (me?.business_profile[Object.keys(me?.business_profile)[0]]?.customer_type || orderBy(me?.shops, ["customer_type"], ["desc"])?.[0]?.customer_type || me?.customer_type || 1);

  return (
    <>
      <div className={basePriceClassName}>
        ₹ &nbsp;
        {!isEmpty(selectedVariation)
          ?
          // ((!me || (userType == 1)) && (selectedVariation?.makingCharges || selectedVariation?.metal || selectedVariation?.diamond || selectedVariation?.stone || selectedVariation?.wastagePrice)) //&& Difference_In_Days < 30))
          // ?
          // round(
          //   Number(round(Number(selectedVariation?.metal)).toFixed(0)) + Number(round(Number(Number(Number(selectedVariation?.diamond || 0) || 0)*stone_extra)).toFixed(0)) + Number(round(Number(Number(selectedVariation?.stone)*stone_extra)).toFixed(0)) + Number(round(Number(Number(selectedVariation?.wastagePrice)*wastage_extra)).toFixed(0)) + Number(round(Number(Number(selectedVariation?.makingCharges)*making_extra)).toFixed(0))
          // )
          // :
          // round(
          //   Number(round(Number(selectedVariation?.metal)).toFixed(0)) + Number(round(Number(Number(selectedVariation?.diamond || 0) || 0)).toFixed(0)) + Number(round(Number(selectedVariation?.stone)).toFixed(0)) + Number(round(Number(selectedVariation?.wastagePrice)).toFixed(0)) + Number(round(Number(selectedVariation?.makingCharges)).toFixed(0))
          // )
          round(Number(selectedVariation?.price || 0)).toFixed(0)
          : `${min_price.split(".")[0]} - ${max_price.split(".")[0]}`}

      </div>

      {basePrice && <del className={discountPriceClassName}>{basePrice.split(".")[0]}</del>}
    </>
  );
};

export default VariationPrice;
