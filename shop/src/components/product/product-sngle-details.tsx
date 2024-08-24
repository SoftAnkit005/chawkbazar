import React, { useState } from "react";
import Button from "@components/ui/button";
import Counter from "@components/common/counter";
import { getVariations } from "@framework/utils/get-variations";
import { useCart } from "@store/quick-cart/cart.context";
import usePrice from "@lib/use-price";
import { generateCartItem } from "@utils/generate-cart-item";
import { ProductAttributes } from "./product-attributes";
import isEmpty from "lodash/isEmpty";
import Link from "@components/ui/link";
import Image from "next/image";
import { toast } from "react-toastify";
import { useWindowSize } from "@utils/use-window-size";
import Carousel from "@components/ui/carousel/carousel";
import { SwiperSlide } from "swiper/react";
import { Attachment, Product } from "@framework/types";
import isEqual from "lodash/isEqual";
import VariationPrice from "@components/product/product-variant-price";
import { useTranslation } from "next-i18next";
import isMatch from "lodash/isMatch";
import { ROUTES } from "@lib/routes";
import useUser from "@framework/auth/use-user";
import { useAttributesQuery } from "@framework/attributes/attributes.query";
import { cloneDeep, compact, orderBy } from "lodash";
import { useUI } from "@contexts/ui.context";


const productGalleryCarouselResponsive = {
  "768": {
    slidesPerView: 2,
    spaceBetween: 12,
  },
  "0": {
    slidesPerView: 1,
  },
};

type Props = {
  product: Product;
};

let counter = 0;
let allAttr: any = [];
let realTimeSelected: any = {};
let counter2 = 0;

const ProductSingleDetails: React.FC<Props> = ({ product }: any) => {

  const variations = getVariations(product?.variations!);
  // const { data:shopData } = useShopQuery(product?.shop?.slug!.toString());
  const { me } = useUser();
  // const currentUserIdentity = me?.email;
  let { data: userAttributesList } = useAttributesQuery();
  let userAttriutes = userAttributesList?.attributes;
  let userMetalAttribute = [];
  // let userStoneAttribute = [];
  let metalAttribute = [];
  let stoneAttribute = [];

  let variation_options = product?.variation_options;
  variation_options = orderBy(variation_options, ['price'], ['asc']);
  let min_price_variation = cloneDeep(variation_options[0]);
  let max_price_variation = cloneDeep(variation_options[variation_options?.length - 1]);
  let min_price_variation_options = min_price_variation?.options;
  let max_price_variation_options = max_price_variation?.options;
  let min_price_metal_attribute = min_price_variation_options?.find((x: any) => ["Gold", "Silver", "Platinum"].includes((x.name)));
  let min_price_stone_attribute = min_price_variation_options?.find((x: any) => ["Diamond", "Polki", "SOLITAIRE", "Lab Grown Diamond"].includes((x.name)));
  let max_price_metal_attribute = max_price_variation_options?.find((x: any) => ["Gold", "Silver", "Platinum"].includes((x.name)));
  let max_price_stone_attribute = max_price_variation_options?.find((x: any) => ["Diamond", "Polki", "SOLITAIRE", "Lab Grown Diamond"].includes((x.name)));
  metalAttribute = userAttriutes?.filter(x => x.name == min_price_metal_attribute?.name) || [];
  stoneAttribute = userAttriutes?.filter(x => x.name == min_price_stone_attribute?.name) || [];
  let minMetalRate = metalAttribute[0]?.values.find((z: any) => z.value == min_price_metal_attribute?.value && z.vendor_type == (orderBy(me?.shops, ["customer_type"], ["desc"])?.[0]?.customer_type || 1))?.rate;
  let minStoneRate = stoneAttribute[0]?.values.find((z: any) => z.value == min_price_stone_attribute?.value && z.vendor_type == (orderBy(me?.shops, ["customer_type"], ["desc"])?.[0]?.customer_type || 1))?.rate;
  let maxMetalRate = metalAttribute[0]?.values.find((z: any) => z.value == max_price_metal_attribute?.value && z.vendor_type == (orderBy(me?.shops, ["customer_type"], ["desc"])?.[0]?.customer_type || 1))?.rate;
  let maxStoneRate = stoneAttribute[0]?.values.find((z: any) => z.value == max_price_stone_attribute?.value && z.vendor_type == (orderBy(me?.shops, ["customer_type"], ["desc"])?.[0]?.customer_type || 1))?.rate;
  if (minMetalRate) {
    min_price_variation.metal = Number(Number(Number(min_price_variation.metal) / Number(min_price_variation.goldPrice)) * Number(minMetalRate)).toFixed(2);
  }
  if (minStoneRate) {
    min_price_variation.stone = Number(Number(Number(min_price_variation.stone) / Number(min_price_variation.diamondPrice)) * Number(minStoneRate)).toFixed(2);
  }
  if (min_price_variation) {
    min_price_variation.price = Number(min_price_variation?.metal) + Number(min_price_variation?.stone) + Number(min_price_variation?.wastagePrice) + Number(min_price_variation?.makingCharges);
  }
  if (maxMetalRate) {
    max_price_variation.metal = Number(Number(Number(max_price_variation.metal) / Number(max_price_variation.goldPrice)) * Number(maxMetalRate)).toFixed(2);
  }
  if (maxStoneRate) {
    max_price_variation.stone = Number(Number(Number(max_price_variation.stone) / Number(max_price_variation.diamondPrice)) * Number(maxStoneRate)).toFixed(2);
  }
  if (max_price_variation) {
    max_price_variation.price = Number(max_price_variation?.metal) + Number(max_price_variation?.stone) + Number(max_price_variation?.wastagePrice) + Number(max_price_variation?.makingCharges);
  }
  product.min_price = min_price_variation?.price;
  product.max_price = max_price_variation?.price;

  const { t } = useTranslation();
  const { width } = useWindowSize();
  const { addItemToCart } = useCart();
  const [attributes, setAttributes] = useState<{ [key: string]: string }>({});
  const [quantity, setQuantity] = useState(1);
  const [addToCartLoader, setAddToCartLoader] = useState<boolean>(false);

  const { price, basePrice } = usePrice({
    amount: product?.sale_price ? product?.sale_price : product?.price!,
    baseAmount: product?.price,
  });

  const isSelected = !isEmpty(variations)
    ? !isEmpty(attributes) &&
    Object.keys(variations).every((variation) =>
      attributes.hasOwnProperty(variation)
    )
    : true;
  let selectedVariation: any = product?.variation_options[0];
  //handleAttribute(variations[0]);

  if (isSelected) {
    selectedVariation = product?.variation_options?.find((o: any) =>
      isEqual(
        o.options.map((v: any) => v.value).sort(),
        Object.values(attributes).sort()
      )
    );
    counter++;
  }

  if (counter == 1) {
    let valueMetal = {
      name: '',
      value: '',
    };
    // let valueStone = {
    //   name:'',
    //   value:'',
    // };
    userMetalAttribute = compact(userAttriutes?.map((x: any) => {
      valueMetal = selectedVariation?.options?.find((y: any) => ["Gold", "Silver", "Platinum"].includes(y.name));
      if (x.name == valueMetal?.name) {
        return x;
      }
    }));
    // userStoneAttribute = compact(userAttriutes?.map((x:any)=>{
    //   valueStone = selectedVariation?.options?.find((y:any)=>["Diamond","Polki","SOLITAIRE","Lab Grown Diamond"].includes(y.name));
    //    if(x.name == valueStone?.name)
    //    {
    //      return x;
    //    }
    //  }));
    let userMetalRate = userMetalAttribute[0]?.values.find((z: any) => z.value == valueMetal?.value && z.vendor_type == (orderBy(me?.shops, ["customer_type"], ["desc"])?.[0]?.customer_type || 1)).rate;
    // let userStoneRate = userStoneAttribute[0]?.values.find((z:any)=>z.value == valueStone?.value && z.vendor_type == (orderBy(me?.shops,["customer_type"],["desc"])?.[0]?.customer_type || 1)).rate;
    if (userMetalRate) {
      selectedVariation.metal = Number(Number(Number(selectedVariation.metal) / Number(selectedVariation.goldPrice)) * Number(userMetalRate)).toFixed(2);
    }
    // if(userStoneRate){
    //   selectedVariation.stone = Number(Number(Number(selectedVariation.stone)/Number(selectedVariation.diamondPrice))*Number(userStoneRate)).toFixed(2);
    // }
    if (selectedVariation) {
      selectedVariation.price = Number(selectedVariation?.metal) + Number(selectedVariation?.stone) + Number(selectedVariation?.wastagePrice) + Number(selectedVariation?.makingCharges);
    }
  }


  function addToCart() {
    if (!isSelected) return;
    // to show btn feedback while product carting
    setAddToCartLoader(true);
    setTimeout(() => {
      setAddToCartLoader(false);
    }, 600);

    const item: any = generateCartItem(product!, selectedVariation);
    addItemToCart(item, quantity);
    toast(t("add-to-cart"), {
      type: "dark",
      progressClassName: "fancy-progress-bar",
      position: width > 768 ? "bottom-right" : "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }


  function handleAttribute(attribute: any) {
    // Reset Quantity
    if (!isMatch(attributes, attribute)) {
      setQuantity(1);
    }
    setAttributes((prev) => ({
      ...prev,
      ...attribute,
    }));
    realTimeSelected[Object.keys(attribute)[0]] = attribute[Object.keys(attribute)[0]];
    if (!allAttr?.includes(Object.values(realTimeSelected).sort().join(""))) {
      allAttr?.push(Object.values(realTimeSelected).sort().join(""));
      counter = 0;
    }
  }

  const { setModalView, openModal } = useUI();
  async function openLuckyForm() {
    setModalView("LUCKY_FORM_VIEW");
    return openModal();
  }

  // Combine image and gallery
  const combineImages = [...product?.gallery, product?.image];
  let firstAttributes = {};
  for (let i = 0; i < Object.keys(variations).length; i++) {
    firstAttributes[Object.keys(variations)[i]] = variations[Object.keys(variations)[i]]?.[0]?.value;
  }
  if (!counter2) {
    setAttributes(firstAttributes);
    counter2++;
  }
  return (
    <div className="block lg:grid grid-cols-9 gap-x-10 xl:gap-x-14 pt-7 pb-10 lg:pb-14 2xl:pb-20 items-start">
      {width < 1025 ? (
        <Carousel
          pagination={{
            clickable: true,
          }}
          breakpoints={productGalleryCarouselResponsive}
          className="product-gallery"
          buttonClassName="hidden"
        >
          {combineImages?.length > 1 ? (
            combineImages?.map((item: Attachment, index: number) => (
              <SwiperSlide
                onClick={() => openLuckyForm()}
                key={`product-gallery-key-${index}`}>
                <div className="col-span-1 transition duration-150 ease-in hover:opacity-90 flex">

                  <Image
                    width={475}
                    height={618}
                    src={
                      item?.original ??
                      "https://zweler.com/admin/assets/placeholder/products/product-gallery.svg"
                    }
                    alt={`${product?.name}--${index}`}
                    className="object-cover w-full"
                  />
                </div>
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide
              onClick={() => openLuckyForm()}
              key={`product-gallery-key`}>
              <div className="col-span-1 transition duration-150 ease-in hover:opacity-90 flex">
                <Image
                  width={475}
                  height={618}
                  src={
                    combineImages?.[0]?.original ??
                    "https://zweler.com/admin/assets/placeholder/products/product-gallery.svg"
                  }
                  alt={product?.name}
                  className="object-cover w-full"
                />
              </div>
            </SwiperSlide>
          )}
        </Carousel>
      ) : (
        <div className="col-span-5 grid grid-cols-2 gap-2.5">
          {combineImages?.length > 1 ? (
            combineImages?.map((item: Attachment, index: number) => (
              <div
                onClick={() => openLuckyForm()}
                key={index}
                className="col-span-1 transition duration-150 ease-in hover:opacity-90 flex"
              >
                <Image
                  width={475}
                  height={618}
                  src={
                    item?.original ??
                    "https://zweler.com/admin/assets/placeholder/products/product-gallery.svg"
                  }
                  alt={`${product?.name}--${index}`}
                  className="object-cover w-full"
                />
              </div>
            ))
          ) : (
            <div className="col-span-full bg-gray-300 flex justify-center rounded-md"
              onClick={() => openLuckyForm()}
            >
              <div className="transition duration-150 ease-in hover:opacity-90 w-1/2 flex">
                <Image
                  width={475}
                  height={618}
                  src={
                    combineImages?.[0]?.original ??
                    "https://zweler.com/admin/assets/placeholder/products/product-gallery.svg"
                  }
                  alt={product?.name}
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>
      )}

      <div className="col-span-4 pt-8 lg:pt-0">
        <div className="pb-7 border-b border-gray-300">
          <h2 className="text-heading text-lg md:text-xl lg:text-2xl 2xl:text-3xl font-bold hover:text-black mb-3.5">
            {product?.name}
          </h2>
          <p className="text-body text-sm lg:text-base leading-6 lg:leading-8">
            {product?.description}
          </p>
          {
            Number(selectedVariation?.netWeight) > 0 ?
              <p className="text-body text-sm lg:text-base leading-6 lg:leading-8">
                NET WEIGHT &nbsp;&nbsp;: &nbsp; {selectedVariation?.netWeight}
              </p> : ""
          }
          {
            Number(selectedVariation?.diamondWeight) > 0 ?
              <p className="text-body text-sm lg:text-base leading-6 lg:leading-8">
                {[2, 3].includes(product?.type?.id) ? 'DIAMOND CARAT' : 'STONE CARAT'}  : &nbsp; {selectedVariation?.diamondWeight}
              </p> : ""
          }
          {
            Number(selectedVariation?.stoneWeight) > 0 ?
              <p className="text-body text-sm lg:text-base leading-6 lg:leading-8">
                STONE CARAT &nbsp; &nbsp; &nbsp;&nbsp;: &nbsp; {selectedVariation?.stoneWeight}
              </p> : ""
          }
          {
            Number(selectedVariation?.wastage) > 0 ?
              <p className="text-body text-sm lg:text-base leading-6 lg:leading-8">
                WASTAGE {product?.shop?.markup_type == 'p' ? '%' : ''}&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp; {Number(selectedVariation?.wastage) + Number(product?.shop?.wastage_markup)}
              </p> : ""
          }
          <div className="flex items-center mt-5">
            {!isEmpty(variations) ? (
              <VariationPrice
                selectedVariation={selectedVariation}
                minPrice={product?.min_price}
                maxPrice={product?.max_price}
              />
            ) : (
              <>
                <div className="text-heading font-semibold text-base md:text-xl lg:text-2xl">
                  {price.split(".")[0]}
                </div>

                {basePrice && (
                  <del className="font-segoe text-gray-400 text-base lg:text-xl ltr:pl-2.5 rtl:pr-2.5 -mt-0.5 md:mt-0">
                    {basePrice.split(".")[0]}
                  </del>
                )}
              </>
            )}
          </div>
        </div>
        {!isEmpty(variations) && (
          <div className="pt-7 pb-3 border-b border-gray-300">
            {Object.keys(variations).map((variation) => {
              return (
                <ProductAttributes
                  key={variation}
                  title={variation}
                  attributes={variations[variation]}
                  active={attributes[variation]}
                  onClick={handleAttribute}
                />
              );
            })}
          </div>
        )}

        <div className="flex items-center space-x-4 rtl:space-x-reverse ltr:md:pr-32 ltr:lg:pr-12 ltr:2xl:pr-32 ltr:3xl:pr-48 rtl:md:pl-32 rtl:lg:pl-12 rtl:2xl:pl-32 rtl:3xl:pl-48 border-gray-300 py-8">
          {isEmpty(variations) && (
            <>
              {Number(product.quantity) > 0 ? (
                <Counter
                  quantity={quantity}
                  onIncrement={() => setQuantity((prev) => prev + 1)}
                  onDecrement={() =>
                    setQuantity((prev) => (prev !== 1 ? prev - 1 : 1))
                  }
                  disableDecrement={quantity === 0}
                  disableIncrement={Number(product.quantity) === quantity}
                />
              ) : (
                <div className="text-base text-red-500 whitespace-nowrap ltr:lg:ml-7 rtl:lg:mr-7">
                  {t("text-out-stock")}
                </div>
              )}
            </>
          )}

          {!isEmpty(selectedVariation) && (
            <>
              {
                // selectedVariation?.is_disable ||
                // selectedVariation.quantity === 0 ? (
                //   <div className="text-base text-red-500 whitespace-nowrap ltr:lg:ml-7 rtl:lg:mr-7">
                //     {t("text-out-stock")}
                //   </div>
                // ) : (
                <Counter
                  quantity={quantity}
                  onIncrement={() => setQuantity((prev) => prev + 1)}
                  onDecrement={() =>
                    setQuantity((prev) => (prev !== 1 ? prev - 1 : 1))
                  }
                  disableDecrement={quantity === 1}
                  disableIncrement={
                    Number(selectedVariation.quantity) === quantity
                  }
                />
                // )
              }
            </>
          )}
          <Button
            onClick={addToCart}
            variant="slim"
            className={`w-full md:w-6/12 xl:w-full `
            }
            // ${
            //   !isSelected && "bg-gray-400 hover:bg-gray-400"
            // }

            // disabled={
            //   !isSelected ||
            //   !product?.quantity ||
            //   (!isEmpty(selectedVariation) && !selectedVariation?.quantity)
            // }
            loading={addToCartLoader}
          >
            <span className="py-2 3xl:px-8">
              {product?.quantity ||
                (!isEmpty(selectedVariation) && selectedVariation?.quantity)
                ? t("text-add-to-cart")
                :
                //t("text-out-stock")
                t("text-add-to-cart")
              }
            </span>
          </Button>
        </div>
        <div
          className={`border-b border-gray-300`}
        >
          <span
            className={`w-full md:w-6/12 xl:w-full text-center`}
          ><p
            className={`text-center`}
          >
              {product?.quantity ||
                (!isEmpty(selectedVariation) && selectedVariation?.quantity)
                ? ''
                //`Ready to ship in ${product?.zero_inventory_fill} days`
                : `Ready to ship`
              }
            </p></span>
          <br />
        </div>
        <div className="py-6">
          <ul className="text-sm space-y-5 pb-1">
            {product?.sku && (
              <li>
                <span className="font-semibold text-heading inline-block ltr:pr-2 rtl:pl-2">
                  SKU:
                </span>
                {product?.sku}
              </li>
            )}

            {product?.categories &&
              Array.isArray(product.categories) &&
              product.categories.length > 0 && (
                <li>
                  <span className="font-semibold text-heading inline-block ltr:pr-2 rtl:pl-2">
                    Category:
                  </span>
                  {product.categories.map((category: any, index: number) => (
                    <Link
                      key={index}
                      href={`${ROUTES.CATEGORY}/${category?.slug}`}
                      className="transition hover:underline hover:text-heading"
                    >
                      {product?.categories?.length === index + 1
                        ? category.name
                        : `${category.name}, `}
                    </Link>
                  ))}
                </li>
              )}

            {product?.tags &&
              Array.isArray(product.tags) &&
              product.tags.length > 0 && (
                <li className="productTags">
                  <span className="font-semibold text-heading inline-block ltr:pr-2 rtl:pl-2">
                    Tags:
                  </span>
                  {product.tags.map((tag: any) => (
                    <Link
                      key={tag.id}
                      href={`${ROUTES.COLLECTIONS}/${tag?.slug}`}
                      className="inline-block ltr:pr-1.5 rtl:pl-1.5 transition hover:underline hover:text-heading ltr:last:pr-0 rtl:last:pl-0"
                    >
                      {tag.name}
                      <span className="text-heading">,</span>
                    </Link>
                  ))}
                </li>
              )}
            {isEmpty(selectedVariation) ? <li></li> :
              <li>
                <table cellPadding={5} style={{ textAlign: "center" }}>
                  <tr>
                    {
                      Number(selectedVariation.metal) ?

                        <td>
                          Metal
                        </td> : ""
                    }
                    {
                      Number(selectedVariation.stone) ?
                        <td></td> : ""
                    }
                    {
                      Number(selectedVariation.stone) ?
                        <td>
                          Stone
                        </td> : ""
                    }
                    {
                      Number(selectedVariation.wastagePrice) ?
                        <td></td> : ""
                    }
                    {
                      Number(selectedVariation.wastagePrice) ?
                        <td>
                          Wastage
                        </td> : ""
                    }
                    {
                      Number(selectedVariation.makingCharges) ?
                        <td></td> : ""
                    }
                    {
                      Number(selectedVariation.makingCharges) ?
                        <td>
                          Making Charges
                        </td> : ""
                    }
                    {
                      Number(selectedVariation.price) ?
                        <td></td> : ""
                    }
                    {
                      Number(selectedVariation.price) ?

                        <td>
                          GST ({product?.type?.id < 5 ? 3 : 1.5}%)
                        </td> : ""
                    }
                    {/* <td></td>
                      <td>
                      Tax
                      </td> */}
                    {
                      Number(selectedVariation.price) ?
                        <td></td> : ""
                    }
                    {
                      Number(selectedVariation.price) ?

                        <td>
                          Total
                        </td> : ""
                    }
                  </tr>
                  <tr>
                    {
                      Number(selectedVariation.metal) ?
                        <td>
                          <hr style={{ border: "0.1px solid grey" }} />
                          {
                            Number(selectedVariation.metal).toFixed(0) || Number(0).toFixed(0)
                          }
                        </td> : ""
                    }
                    {
                      Number(selectedVariation.stone) ?
                        <td>+</td> : ""
                    }
                    {
                      Number(selectedVariation.stone) ?
                        <td>
                          <hr style={{ border: "0.1px solid grey" }} />
                          {
                            Number(selectedVariation.stone).toFixed(0) || Number(0).toFixed(0)
                          }
                        </td> : ""
                    }
                    {
                      Number(selectedVariation.wastagePrice) ?
                        <td>+</td> : ""
                    }
                    {
                      Number(selectedVariation.wastagePrice) ?
                        <td>
                          <hr style={{ border: "0.1px solid grey" }} />
                          {
                            Number(selectedVariation.wastagePrice).toFixed(0) || Number(0).toFixed(0)
                          }
                        </td> : ""
                    }
                    {
                      Number(selectedVariation.makingCharges) ?
                        <td>+</td> : ""
                    }
                    {
                      Number(selectedVariation.makingCharges) ?
                        <td>
                          <hr style={{ border: "0.1px solid grey" }} />
                          {
                            Number(selectedVariation.makingCharges).toFixed(0) || Number(0).toFixed(0)
                          }
                        </td> : ""
                    }
                    {
                      Number(selectedVariation.price) ?
                        <td>+</td> : ""
                    }
                    {
                      Number(selectedVariation.price) ?

                        <td>
                          <hr style={{ border: "0.1px solid grey" }} />
                          <div className={"text-base"}>
                            {
                              Number(Number(Number(selectedVariation.price) / 100) * (product?.type?.id < 5 ? 3 : 1.5)).toFixed(0) || Number(0).toFixed(0)
                            }
                          </div>
                        </td>
                        : ""
                    }
                    {/* <td>+</td>
                      <td>
                    <hr style={{border:"0.1px solid grey" }}/>
                      {Number(Number(Number(selectedVariation.price)/(100 + Number(applicableTax)))*Number(applicableTax)).toFixed(2)}
                      </td> */}
                    {
                      Number(selectedVariation.price) ?
                        <td>=</td> : ""
                    }
                    {
                      Number(selectedVariation.price) ?

                        <td>
                          <hr style={{ border: "0.1px solid grey" }} />
                          <div className={"text-base"}>
                            {
                              Number(Number(selectedVariation.price) + Number(Number(Number(selectedVariation.price) / 100) * (product?.type?.id < 5 ? 3 : 1.5))).toFixed(0) || Number(0).toFixed(0)
                            }
                          </div>
                        </td>
                        : ""
                    }
                  </tr>
                </table>
              </li>}
            <hr style={{ border: "0.1px solid grey" }} />

            <li>
              <span className="font-semibold text-heading inline-block ltr:pr-2 rtl:pl-2">
                {t("text-brand-colon")}
              </span>
              <Link
                href={`${ROUTES.BRAND}=${product?.type?.slug}`}
                className="inline-block ltr:pr-1.5 rtl:pl-1.5 transition hover:underline hover:text-heading ltr:last:pr-0 rtl:last:pl-0"
              >
                {product?.type?.name}
              </Link>
            </li>

            <li>
              <span className="font-semibold text-heading inline-block ltr:pr-2 rtl:pl-2">
                {t("text-shop-colon")}
              </span>
              <Link
                href={`${ROUTES.SHOPS}/${product?.shop?.slug}`}
                className="inline-block ltr:pr-1.5 rtl:pl-1.5 transition hover:underline hover:text-heading ltr:last:pr-0 rtl:last:pl-0"
              >
                {product?.shop?.name}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductSingleDetails;
