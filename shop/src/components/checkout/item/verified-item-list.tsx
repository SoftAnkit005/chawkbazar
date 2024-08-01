import Coupon from '@components/checkout/coupon/coupon';
import usePrice from '@lib/use-price';
import EmptyCartIcon from '@components/icons/empty-cart';
import { CloseIcon } from '@components/icons/close-icon';
import { useTranslation } from 'next-i18next';
import { useCart } from '@store/quick-cart/cart.context';
import {
  calculatePaidTotal,
  calculateTotal,
} from "@store/quick-cart/cart.utils";
import { useAtom } from "jotai";
import {
  couponAtom,
  discountAtom,
  verifiedResponseAtom,
} from '@store/checkout';
import ItemCard from '@components/checkout/item/item-card';
import { ItemInfoRow } from '@components/checkout/item/item-info-row';
import PaymentGrid from '@components/checkout/payment/payment-grid';
import { PlaceOrderAction } from '@components/checkout/action/place-order-action';
import { useTaxesQuery } from '@framework/taxes/taxes.query';
import { map, sum } from 'lodash';
import { useProductsQuery } from '@framework/products/products.query';

interface Props {
  className?: string;
}

const VerifiedItemList: React.FC<Props> = ({ className }) => {
  const { t } = useTranslation("common");
  let { items, isEmpty: isEmptyCart } = useCart();
  const [verifiedResponse] = useAtom(verifiedResponseAtom);
  const [coupon, setCoupon] = useAtom(couponAtom);
  const [discount] = useAtom(discountAtom);

  const billingAddress = JSON.parse(localStorage.getItem("chawkbazar-checkout") || "{}");
  const state = billingAddress?.billing_address?.address?.state;

  const {
  data:taxData,
} = useTaxesQuery();

  const available_items = items?.filter(
    (item) => !verifiedResponse?.unavailable_products?.includes(item.id)
  );

  const { price: shipping } = usePrice(
    verifiedResponse && {
      amount: verifiedResponse.shipping_charge ?? 0,
    }
  );

  const base_amount = calculateTotal(available_items);
  const { price: sub_total } = usePrice(
    verifiedResponse && {
      amount: base_amount,
    }
  );

  let { price: total } = usePrice(
    verifiedResponse && {
      amount: calculatePaidTotal(
        {
          totalAmount: base_amount,
          tax: verifiedResponse?.total_tax,
          shipping_charge: verifiedResponse?.shipping_charge,
        },
        Number(discount)
      ),
    }
  );

  const gstList = taxData?.filter((x:any)=>x.name.toLowerCase().startsWith("gst") && !x.parents);
  const sgstList = taxData?.filter((x:any)=>x.name.toLowerCase().startsWith("sgst") && x.parents);
  const cgstList = taxData?.filter((x:any)=>x.name.toLowerCase().startsWith("cgst") && x.parents);
  const igstList = taxData?.filter((x:any)=>x.name.toLowerCase().startsWith("igst") && x.parents);
  total = Number(Number(sub_total.slice(1,sub_total.length-1).replaceAll(",","")) + Number(shipping.slice(1,sub_total.length-1).replaceAll(",",""))).toFixed(0).toString();
  let pids = "";
  items = items.map((x:any)=>{
    if(x.type_id < 5)
    {
      let gst = gstList && gstList.length ? gstList[0] : {};
      x.gstPer = Number(gst?.rate) || 0;
      x.gst = Number(Number(Number(Number(x.price) * Number(x.quantity))/100) * x.gstPer);
      if(state == gst?.state)
      {
        x.sgstPer = sgstList && sgstList.length ? sgstList.filter((x:any)=>(x.state == state))[0]?.rate : 0;
        x.sgst = Number(Number(Number(Number(x.price) * Number(x.quantity))/100) * x.sgstPer);
        x.cgstPer = cgstList && cgstList.length ? cgstList.filter((x:any)=>(x.state == state))[0]?.rate : 0;
        x.cgst = Number(Number(Number(Number(x.price) * Number(x.quantity))/100) * x.cgstPer);
      }
      else{
        x.igstPer = igstList && igstList.length ? igstList.filter((x:any)=>(x.state != state))[0]?.rate : 0;
        x.igst = Number(Number(Number(Number(x.price) * Number(x.quantity))/100) * x.igstPer);
      }
    }
    else{
      let gst = gstList && gstList.length ? gstList[1] : {};
      x.gstPer = Number(gst?.rate) || 0;
      x.gst = Number(Number(Number(Number(x.price) * Number(x.quantity))/100) * x.gstPer);
      if(state == gst?.state)
      {
        x.sgstPer = sgstList && sgstList.length ? sgstList.filter((x:any)=>(x.state == state))[1]?.rate : 0;
        x.sgst = Number(Number(Number(Number(x.price) * Number(x.quantity))/100) * x.sgstPer);
        x.cgstPer = cgstList && cgstList.length ? cgstList.filter((x:any)=>(x.state == state))[1]?.rate : 0;
        x.cgst = Number(Number(Number(Number(x.price) * Number(x.quantity))/100) * x.cgstPer);
      }
      else{
        x.igstPer = igstList && igstList.length ? igstList.filter((x:any)=>(x.state != state))[1]?.rate : 0;
        x.igst = Number(Number(Number(Number(x.price) * Number(x.quantity))/100) * x.igstPer);
      }
    }
    total = Number(Number(total) + Number(x.gst)).toFixed(0).toString();
    pids = pids + ( pids ? "," : "") + x.productId;
    return x;
  })
  const { data:productData } = useProductsQuery({
    id:pids,
    limit:items.length,
  });
  let totalMakingPrice = 0;
  let totalWastagePrice = 0;
  let totalMakingPriceShow = 0;
  let totalWastagePriceShow = 0;
  items = items.map((x:any)=>{
    let product = productData?.data?.find((y:any)=>y.id == x.productId);
    let variation_option = product?.variation_options?.find((z:any)=>z.id == x.variationId);
    x.wastagePrice = variation_option?.wastagePrice * x.quantity;
    x.makingPrice = variation_option?.makingCharges * x.quantity;
    totalMakingPrice = totalMakingPrice + Number(x.makingPrice || 0);
    totalWastagePrice = totalWastagePrice + Number(x.wastagePrice || 0);
    totalMakingPriceShow = totalMakingPrice + Number(x.makingPrice || 0);
    totalWastagePriceShow = totalWastagePrice + Number(x.wastagePrice || 0);

    return x;
  });
  if(coupon?.type == "fixed" && coupon?.makingCharges && totalMakingPrice)
  {
    totalMakingPrice = totalMakingPrice - Number(coupon?.makingCharges);
    total = Number(Number(total) - Number(coupon?.makingCharges)).toString();
  }
  if(coupon?.type == "fixed" && coupon?.wastage && totalWastagePrice)
  {
    totalWastagePrice = totalWastagePrice - Number(coupon?.wastage);
    total = Number(Number(total) - Number(coupon?.wastage)).toString();
  }
  if(coupon?.type == "fixed" && discount)
  {
    total = Number(Number(total) - discount).toString();
  }
  if(coupon?.type == "percentage" && coupon?.makingCharges && totalMakingPrice)
  {
    totalMakingPrice = totalMakingPrice - (totalMakingPrice*(Number(coupon?.makingCharges)/100));
    total = Number(Number(total) - Number(coupon?.makingCharges)).toString();
  }
  if(coupon?.type == "percentage" && coupon?.wastage && totalWastagePrice)
  {
    totalWastagePrice = totalWastagePrice - (totalWastagePrice*(Number(coupon?.wastage)/100));
    total = Number(Number(total) - Number(coupon?.totalWastagePrice)).toString();
  }
  if(coupon?.type == "percentage" && discount)
  {
    total = Number(Number(total) - (Number(total)*(discount/100))).toString();
  }
  return (
    <div className={className}>
      <div className="flex flex-col">
        <div className="flex items-center justify-between text-heading text-base font-semibold bg-gray-200 px-6 py-3.5 border-b border-gray-300">
          <span>{t("text-product")}</span>
          <span>{t("text-sub-total")}</span>
        </div>
        {!isEmptyCart ? (
          <div className="px-6 py-2.5">
            {items?.map((item) => {
              const notAvailable = verifiedResponse?.unavailable_products?.find(
                (d: any) => d === item.id
              );
              return (
                <ItemCard
                  item={item}
                  key={item.id}
                  notAvailable={!!notAvailable}
                />
              );
            })}
          </div>
        ) : (
          <EmptyCartIcon />
        )}
      </div>

      <div className="">
        
        {
          totalMakingPrice ?
          <div>
          <ItemInfoRow title={"Making Charges ( included )"} value={"₹" + totalMakingPriceShow?.toFixed(0)?.toString() || ""} /> 
          { coupon && coupon.makingCharges ? (
            <div className="flex justify-between">
              <p className="text-sm text-body ltr:mr-4 rtl:ml-4">Making Charges {t("text-discount")}</p>
              <span className="text-xs font-semibold text-red-500 flex items-center ltr:mr-auto rtl:ml-auto">
                ({coupon?.code})
                <button onClick={() => setCoupon(null)}>
                  <CloseIcon className="w-3 h-3 ltr:ml-2 rtl:mr-2" />
                </button>
              </span>
              <span className="text-sm text-body">{"-" + (coupon?.type == "fixed" ? "₹" : "") +coupon.makingCharges + (coupon?.type == "percentage" ? "%" : "") }</span>
            </div>
          ):<span></span>
          }
          </div>
          : ""
        }
        {
          totalWastagePrice ?
          <div>
          <ItemInfoRow title={"Wastage ( included )"} value={"₹" + totalWastagePriceShow?.toFixed(0)?.toString() || ""} />
          { coupon && coupon.wastage ? (
            <div className="flex justify-between">
              <p className="text-sm text-body ltr:mr-4 rtl:ml-4">Wastage {t("text-discount")}</p>
              <span className="text-xs font-semibold text-red-500 flex items-center ltr:mr-auto rtl:ml-auto">
                ({coupon?.code})
                <button onClick={() => setCoupon(null)}>
                  <CloseIcon className="w-3 h-3 ltr:ml-2 rtl:mr-2" />
                </button>
              </span>
              <span className="text-sm text-body">{"-" + (coupon?.type == "fixed" ? "₹" : "") +coupon.wastage + (coupon?.type == "percentage" ? "%" : "") }</span>
            </div>
          ):<span></span>
          }
          </div>
          :<span></span>
        }
        <ItemInfoRow title={t("text-sub-total")} value={sub_total.split(".")[0]} />
        {
          sum(map(items,(x:any)=>x.igst)) ?
          <ItemInfoRow title={"IGST"} value={"₹" + sum(map(items,(x:any)=>x.igst))?.toFixed(0)?.toString() || ""} /> : ""
        }
        {
          sum(map(items,(x:any)=>x.sgst)) ?
          <ItemInfoRow title={"SGST"} value={"₹" + sum(map(items,(x:any)=>x.sgst))?.toFixed(0)?.toString() || ""} /> : ""
        }
        {
          sum(map(items,(x:any)=>x.cgst)) ?
          <ItemInfoRow title={"CGST"} value={"₹" + sum(map(items,(x:any)=>x.cgst))?.toFixed(0)?.toString() || ""} /> : ""
        }
        <ItemInfoRow title={t("text-shipping")} value={shipping.split(".")[0]} />
        {discount && coupon ? (
          <div className="flex justify-between">
            <p className="text-sm text-body ltr:mr-4 rtl:ml-4">{t("text-discount")}</p>
            <span className="text-xs font-semibold text-red-500 flex items-center ltr:mr-auto rtl:ml-auto">
              ({coupon?.code})
              <button onClick={() => setCoupon(null)}>
                <CloseIcon className="w-3 h-3 ltr:ml-2 rtl:mr-2" />
              </button>
            </span>
            <span className="text-sm text-body">{"-"+ (coupon?.type == "fixed" ? "₹" : "") +discount + (coupon?.type == "percentage" ? "%" : "")}</span>
          </div>
        ) : (
          <div className="flex justify-between py-4 px-6 border-t border-gray-100">
            <Coupon />
          </div>
        )}
        <div className="flex justify-between border-t-4 border-double border-gray-100 py-4 px-6">
          <p className="text-base font-semibold text-heading">
            {t("text-total")}
          </p>
          <span className="text-base font-semibold text-heading">{"₹" +total.split(".")[0]}</span>
        </div>
      </div>
      <PaymentGrid className="px-6 py-5 border border-gray-100" />
      <PlaceOrderAction>{t("button-place-order")}</PlaceOrderAction>
    </div>
  );
};

export default VerifiedItemList;
