import Counter from "@components/common/counter";
import VariationPrice from "@components/product/product-variant-price";
import Button from "@components/ui/button";
import Carousel from "@components/ui/carousel/carousel";
import Link from "@components/ui/link";
import { useAttributesQuery } from "@framework/attributes/attributes.query";
import useUser from "@framework/auth/use-user";
import { Attachment, Product } from "@framework/types";
import { getVariations } from "@framework/utils/get-variations";
import { ROUTES } from "@lib/routes";
import usePrice from "@lib/use-price";
import { useCart } from "@store/quick-cart/cart.context";
import { generateCartItem } from "@utils/generate-cart-item";
import { useWindowSize } from "@utils/use-window-size";
import { cloneDeep, compact, orderBy, round } from "lodash";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import isMatch from "lodash/isMatch";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { SwiperSlide } from "swiper/react";
import { ProductAttributes } from "./product-attributes";
import ProductImageCarousel from "./product-image-display";
import video from "next-seo/lib/jsonld/video";

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
let firstTime = true;
let allAttr: any = [];
let realTimeSelected: any = [];
const stone_extra = 2;
// const making_extra = 3;
// const wastage_extra = 3;
let i = 0;

const ProductSingleDetails: React.FC<Props> = ({ product }: any) => {
  // console.log('products_video',product.video)
  var customer_making_charges = product.shop.making_charges_markup_customer;
  let making_extra = 3;
  if(customer_making_charges)
  {
     making_extra = customer_making_charges;
  }
  var wastage_markup_customer = product.shop.wastage_markup_customer;
  let wastage_extra = 3;
  if(wastage_markup_customer)
  {
    wastage_extra = wastage_markup_customer;
  }
  const variations = getVariations(product?.variations!);
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
  let { data: userAttributesList } = useAttributesQuery();
  let userAttriutes = userAttributesList?.attributes;
  let userMetalAttribute = [];
  let metalAttribute = [];
  let stoneAttribute = [];

  let variation_options = product?.variation_options;
  variation_options = orderBy(variation_options, ["price"], ["asc"]);
  let min_price_variation = cloneDeep(variation_options[0]);
  let max_price_variation = cloneDeep(
    variation_options[variation_options?.length - 1]
  );
  let min_price_variation_options = min_price_variation?.options;
  let max_price_variation_options = max_price_variation?.options;
  let min_price_metal_attribute = min_price_variation_options?.find((x: any) =>
    ["Gold", "Silver", "Platinum"]?.includes(x.name)
  );
  let min_price_stone_attribute = min_price_variation_options?.find((x: any) =>
    ["Diamond", "Polki", "SOLITAIRE", "Lab Grown Diamond"]?.includes(x.name)
  );
  let max_price_metal_attribute = max_price_variation_options?.find((x: any) =>
    ["Gold", "Silver", "Platinum"]?.includes(x.name)
  );
  let max_price_stone_attribute = max_price_variation_options?.find((x: any) =>
    ["Diamond", "Polki", "SOLITAIRE", "Lab Grown Diamond"]?.includes(x.name)
  );
  metalAttribute =
    userAttriutes?.filter((x) => x.name == min_price_metal_attribute?.name) ||
    [];
  stoneAttribute =
    userAttriutes?.filter((x) => x.name == min_price_stone_attribute?.name) ||
    [];
  let minMetalRate = metalAttribute[0]?.values?.find(
    (z: any) =>
      z.value == min_price_metal_attribute?.value &&
      z.vendor_type ==
        (me?.business_profile[Object.keys(me?.business_profile)[0]]
          ?.customer_type ||
          orderBy(me?.shops, ["customer_type"], ["desc"])?.[0]?.customer_type ||
          1)
  )?.rate;
  let minMetalRate24 = metalAttribute[0]?.values?.find(
    (z: any) =>
      z.value.includes("24") &&
      z.vendor_type ==
        (me?.business_profile[Object.keys(me?.business_profile)[0]]
          ?.customer_type ||
          orderBy(me?.shops, ["customer_type"], ["desc"])?.[0]?.customer_type ||
          1)
  )?.rate;
  let minStoneRate = stoneAttribute[0]?.values?.find(
    (z: any) =>
      z.value == min_price_stone_attribute?.value &&
      z.vendor_type ==
        (me?.business_profile[Object.keys(me?.business_profile)[0]]
          ?.customer_type ||
          orderBy(me?.shops, ["customer_type"], ["desc"])?.[0]?.customer_type ||
          1)
  )?.rate;
  let maxMetalRate = metalAttribute[0]?.values?.find(
    (z: any) =>
      z.value == max_price_metal_attribute?.value &&
      z.vendor_type ==
        (me?.business_profile[Object.keys(me?.business_profile)[0]]
          ?.customer_type ||
          orderBy(me?.shops, ["customer_type"], ["desc"])?.[0]?.customer_type ||
          1)
  )?.rate;
  let maxMetalRate24 = metalAttribute[0]?.values?.find(
    (z: any) =>
      z.value.includes("24") &&
      z.vendor_type ==
        (me?.business_profile[Object.keys(me?.business_profile)[0]]
          ?.customer_type ||
          orderBy(me?.shops, ["customer_type"], ["desc"])?.[0]?.customer_type ||
          1)
  )?.rate;
  let maxStoneRate = stoneAttribute[0]?.values?.find(
    (z: any) =>
      z.value == max_price_stone_attribute?.value &&
      z.vendor_type ==
        (me?.business_profile[Object.keys(me?.business_profile)[0]]
          ?.customer_type ||
          orderBy(me?.shops, ["customer_type"], ["desc"])?.[0]?.customer_type ||
          1)
  )?.rate;
  if (minMetalRate) {
    min_price_variation.metal = Number(
      Number(
        Number(min_price_variation?.metal) /
          Number(min_price_variation?.goldPrice)
      ) * Number(minMetalRate)
    )?.toFixed(2);
    const minWastageValue =
      Number(min_price_variation?.wastage || 0) +
      Number(product?.shop?.wastage_markup || 0);
    min_price_variation.wastagePrice =
      product?.shop?.markup_type === "p"
        ? Number(
            Number(minMetalRate24) *
              Number(
                (Number(min_price_variation?.netWeight) / 100) * minWastageValue
              )
          )?.toFixed(2)
        : Number(
            Number(min_price_variation?.netWeight) * Number(minWastageValue)
          )?.toFixed(2);
    if (
      min_price_variation?.options &&
      min_price_variation?.options?.length &&
      min_price_variation?.options?.find((x: any) =>
        ["Diamond", "Polki", "SOLITAIRE", "Lab Grown Diamond"].includes(x.name)
      )
    ) {
      min_price_variation.wastagePrice = 0;
    }
  }
  if (minStoneRate) {
    min_price_variation.stone = Number(
      Number(
        Number(min_price_variation?.stone) /
          Number(min_price_variation?.diamondPrice)
      ) * Number(minStoneRate)
    )?.toFixed(2);
  }
  if (min_price_variation) {
    min_price_variation.price =
      Number(min_price_variation?.metal) +
      Number(min_price_variation?.stone) +
      Number(min_price_variation?.wastagePrice) +
      Number(min_price_variation?.makingCharges);
    if (
      !me ||
      !(
        me?.business_profile[Object.keys(me?.business_profile)[0]]
          ?.customer_type ||
        orderBy(me?.shops, ["customer_type"], ["desc"])?.[0]?.customer_type ||
        me?.customer_type
      ) ||
      me?.business_profile[Object.keys(me?.business_profile)[0]]
        ?.customer_type == 1 ||
      orderBy(me?.shops, ["customer_type"], ["desc"])?.[0]?.customer_type ==
        1 ||
      me?.customer_type == 1
    ) {
      // && Difference_In_Days < 30))
      min_price_variation.price =
        Number(min_price_variation?.metal) +
        Number(Number(min_price_variation?.stone) * stone_extra) +
        Number(Number(min_price_variation?.wastagePrice) * wastage_extra) +
        Number(Number(min_price_variation?.makingCharges * making_extra));
    }
  }
  if (maxMetalRate) {
    max_price_variation.metal = Number(
      Number(
        Number(max_price_variation?.metal) /
          Number(max_price_variation.goldPrice)
      ) * Number(maxMetalRate)
    )?.toFixed(2);
    const maxWastageValue =
      Number(max_price_variation?.wastage || 0) +
      Number(product?.shop?.wastage_markup || 0);
    max_price_variation.wastagePrice =
      product?.shop?.markup_type === "p"
        ? Number(
            Number(maxMetalRate24) *
              Number(
                (Number(max_price_variation?.netWeight) / 100) * maxWastageValue
              )
          )?.toFixed(2)
        : Number(
            Number(max_price_variation?.netWeight) * Number(maxWastageValue)
          )?.toFixed(2);
    if (
      max_price_variation?.options &&
      max_price_variation?.options?.length &&
      max_price_variation?.options?.find((x: any) =>
        ["Diamond", "Polki", "SOLITAIRE", "Lab Grown Diamond"]?.includes(x.name)
      )
    ) {
      max_price_variation.wastagePrice = 0;
    }
  }
  if (maxStoneRate) {
    max_price_variation.stone = Number(
      Number(
        Number(max_price_variation?.stone) /
          Number(max_price_variation?.diamondPrice)
      ) * Number(maxStoneRate)
    )?.toFixed(2);
  }
  if (max_price_variation) {
    max_price_variation.price =
      Number(max_price_variation?.metal) +
      Number(max_price_variation?.stone) +
      Number(max_price_variation?.wastagePrice) +
      Number(max_price_variation?.makingCharges);
    if (
      !me ||
      !(
        me?.business_profile[Object.keys(me?.business_profile)[0]]
          ?.customer_type ||
        orderBy(me?.shops, ["customer_type"], ["desc"])?.[0]?.customer_type ||
        me?.customer_type
      ) ||
      me?.business_profile[Object.keys(me?.business_profile)[0]]
        ?.customer_type == 1 ||
      orderBy(me?.shops, ["customer_type"], ["desc"])?.[0]?.customer_type ==
        1 ||
      me?.customer_type == 1
    ) {
      // && Difference_In_Days < 30))
      max_price_variation.price =
        Number(max_price_variation?.metal) +
        Number(Number(max_price_variation?.stone) * stone_extra) +
        Number(Number(max_price_variation?.wastagePrice) * wastage_extra) +
        Number(Number(max_price_variation?.makingCharges) * making_extra);
    }
  }
  product.min_price = min_price_variation?.price;
  product.max_price = max_price_variation?.price;

  const { t } = useTranslation();
  const { width } = useWindowSize();
  const { addItemToCart } = useCart();
  let firstAttributes = {};
  for (let i = 0; i < Object.keys(variations)?.length; i++) {
    firstAttributes[Object.keys(variations)[i]] =
      variations[Object.keys(variations)[i]]?.[0]?.value;
  }
  const [attributes, setAttributes] = useState<{ [key: string]: string }>(
    firstAttributes
  );
  if (i == 0) {
    handleAttribute(attributes);
    i++;
  }
  const [quantity, setQuantity] = useState(1);
  const [addToCartLoader, setAddToCartLoader] = useState<boolean>(false);

  const { price, basePrice } = usePrice({
    amount: product?.sale_price ? product?.sale_price : product?.price!,
    baseAmount: product?.price,
  });

  const isSelected = !isEmpty(variations)
    ? !isEmpty(attributes) &&
      Object.keys(variations)?.every((variation) =>
        attributes.hasOwnProperty(variation)
      )
    : true;
  let selectedVariation: any;
  let isLoadingRate = true;
  let userType = 1;
  if (isSelected) {
    selectedVariation = product?.variation_options?.find((o: any) =>
      isEqual(
        o.options?.map((v: any) => v.value)?.sort(),
        Object.values(attributes)?.sort()
      )
    );
    userType =
      me?.business_profile[Object.keys(me?.business_profile)[0]]
        ?.customer_type ||
      orderBy(me?.shops, ["customer_type"], ["desc"])?.[0]?.customer_type ||
      me?.customer_type ||
      1;
    let valueMetal = {
      name: "",
      value: "",
    };
    userMetalAttribute = compact(
      userAttriutes?.map((x: any) => {
        valueMetal = selectedVariation?.options?.find((y: any) =>
          ["Gold", "Silver", "Platinum"]?.includes(y.name)
        );
        if (x.name == valueMetal?.name) {
          return x;
        }
      })
    );
    let userMetalRate =
      userMetalAttribute[0]?.values.find(
        (z: any) =>
          z.value == valueMetal?.value &&
          z.vendor_type ==
            (me?.business_profile[Object.keys(me?.business_profile)[0]]
              ?.customer_type ||
              orderBy(me?.shops, ["customer_type"], ["desc"])?.[0]
                ?.customer_type ||
              me?.customer_type ||
              1)
      )?.rate || 0;
    let userMetalRate24 =
      userMetalAttribute[0]?.values.find(
        (z: any) =>
          z.value.includes("24") &&
          z.vendor_type ==
            (me?.business_profile[Object.keys(me?.business_profile)[0]]
              ?.customer_type ||
              orderBy(me?.shops, ["customer_type"], ["desc"])?.[0]
                ?.customer_type ||
              me?.customer_type ||
              1)
      )?.rate || 0;
    if (userMetalRate) {
      selectedVariation.metal = (
        Number(userMetalRate) * Number(selectedVariation?.netWeight)
      )?.toFixed(2);
      const wastageValue =
        Number(selectedVariation?.wastage || 0) +
        Number(product?.shop?.wastage_markup || 0);
      selectedVariation.wastagePrice =
        product?.shop?.markup_type === "p"
          ? Number(
              Number(userMetalRate24) *
                Number(
                  (Number(selectedVariation?.netWeight) / 100) * wastageValue
                )
            )?.toFixed(2)
          : Number(
              Number(selectedVariation?.netWeight) * Number(wastageValue)
            )?.toFixed(2);
      if (
        selectedVariation?.options &&
        selectedVariation?.options?.length &&
        selectedVariation?.options?.find((x: any) =>
          ["Diamond", "Polki", "SOLITAIRE", "Lab Grown Diamond"]?.includes(
            x.name
          )
        )
      ) {
        selectedVariation.wastagePrice = 0;
      }
    }
    if (selectedVariation) {
      selectedVariation.price =
        Number(selectedVariation?.metal) +
        (Number(selectedVariation?.diamond || 0) || 0) +
        Number(selectedVariation?.stone) +
        Number(selectedVariation?.wastagePrice) +
        Number(selectedVariation?.makingCharges);
      if (!me || userType == 1) {
        selectedVariation.price =
          Number(selectedVariation?.metal) +
          Number((Number(selectedVariation?.diamond || 0) || 0) * stone_extra) +
          Number(Number(selectedVariation?.stone) * stone_extra) +
          Number(Number(selectedVariation?.wastagePrice) * wastage_extra) +
          Number(Number(selectedVariation?.makingCharges) * making_extra);
      }
    }
    isLoadingRate = false;
  }

  function addToCart() {
    if (!isSelected) return;
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
    if (!isMatch(attributes, attribute)) {
      setQuantity(1);
    }
    setAttributes((prev) => ({
      ...prev,
      ...attribute,
    }));
    realTimeSelected[Object.keys(attribute)[0]] =
      attribute[Object.keys(attribute)[0]];
    if (!allAttr?.includes(Object.values(realTimeSelected)?.sort()?.join(""))) {
      allAttr?.push(Object.values(realTimeSelected)?.sort()?.join(""));
      counter = 0;
    }
  }

  const combineImages = [...(product?.gallery || []), product?.image];

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <div className="block lg:grid grid-cols-12 gap-x-10 xl:gap-x-14 pt-7 pb-10 lg:pb-14 2xl:pb-20 items-start">
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
            <>
              {combineImages?.map((item: Attachment, index: number) => (
                <SwiperSlide key={`product-gallery-key-${index}`}>
                  <div className="col-span-1 transition duration-150 ease-in hover:opacity-90 flex">
                    <Image
                      width={475}
                      height={618}
                      src={
                        item?.original ??
                        "https://zweler.com/admin/assets/placeholder/products/product-gallery.svg"
                      }
                      alt={`${product?.name}--${index}`}
                      className={` w-full ${index === 0 ? "zoomed-image" : ""}`}
                    />
                  </div>
                </SwiperSlide>
              ))}
              {(product.video !== null && product.video.length !== 0)?
                <SwiperSlide className="flex items-center" key={`product-gallery-key-${combineImages.length + 1}`}>
                  <div className="col-span-1 transition duration-150 ease-in hover:opacity-90 flex">
                    <video autoPlay loop muted className={`object-fit-cover rounded-1`}>
                      <source src={product.video?.original} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </SwiperSlide>
                : <></>
              }
            </>
          ) : (
            <>
            <SwiperSlide key={`product-gallery-key`}>
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
            {(product.video !== null && product.video.length !== 0)?
                <SwiperSlide className="flex items-center" key={`product-gallery-key-${combineImages.length + 1}`}>
                  <div className="col-span-1 transition duration-150 ease-in hover:opacity-90 flex">
                    <video autoPlay loop muted className={`object-fit-cover rounded-1`}>
                      <source src={product.video?.original} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </SwiperSlide>
                : <></>
              }
            </>
          )}
        </Carousel>
      ) : (
        <div className="col-span-6 item-center">
          {combineImages?.length ? (
            <ProductImageCarousel images={combineImages || []} video={product.video || []} />
          ) : (
            <span></span>
          )}
          <div
            className="col-span-6"
            style={{
              textAlign: "center",
              fontWeight: "bold",
              marginTop: "15px",
            }}
          >
            <h2>CERTIFICATIONS</h2>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "nowrap",
              }}
            >
              <img
                src="../../assets/images/bis.jpg"
                alt="Certification Icon 1"
                style={{ maxWidth: "80px", margin: "10px", padding: "10px" }}
              />
              <img
                src="../../assets/images/igi.jpg"
                alt="Certification Icon 2"
                style={{ maxWidth: "80px", margin: "10px" }}
              />
              <img
                src="../../assets/images/gia.jpg"
                alt="Certification Icon 3"
                style={{ maxWidth: "80px", margin: "10px" }}
              />
              <img
                src="../../assets/images/sgl.jpg"
                alt="Certification Icon 4"
                style={{ maxWidth: "80px", margin: "10px" }}
              />
              <img
                src="../../assets/images/hrd.jpg"
                alt="Certification Icon 5"
                style={{
                  maxWidth: "80px",
                  margin: "10px",
                  marginRight: "20px",
                }}
              />
            </div>

            {product?.buy_back_policy &&
              product?.buy_back_policy?.buy_back_description &&
              product?.buy_back_policy?.buy_back_value !== 0 && (
                <div
                  className=""
                  style={{
                    width: "100%",
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <p
                      style={{
                        fontSize: "28px",
                        fontWeight: "bold",
                        margin: "0 10px 0 0",
                        textDecoration: "underline",
                      }}
                    >
                      Buy Back Available
                    </p>
                    <div
                      style={{
                        backgroundColor: "#7b68ee",
                        color: "white",
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      {product?.buy_back_policy?.buy_back_value}%
                    </div>
                  </div>
                  <div className="flex">
                    <div style={{ marginLeft: "10px", fontWeight: "normal" }}>
                      <p className="">
                        {product?.buy_back_policy?.buy_back_description}
                      </p>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      )}

      <div className="col-span-6 pt-8 lg:pt-0">
        <div className="pb-7">
          <div className="col-span-6">
            <h2
              className="text-heading text-lg md:text-xl lg:text-2xl 2xl:text-3xl font-bold hover:text-black"
              style={{ color: "#5d6b6b" }}
            >
              {product?.name}
            </h2>
            <p className="">
              <span className="font-bold" style={{ color: "#d87876" }}>
                Style Code:
              </span>{" "}
              {product?.stylecode}
            </p>

            <p className="text-body text-sm lg:text-base leading-6 lg:leading-8">
              {product?.description}
            </p>
          </div>

          <br />
          <p
            className="text-body text-sm lg:text-base leading-6 lg:leading-8"
            style={{
              border: "1px solid #ccc",
              boxShadow: "5px 5px 8px rgba(0, 0, 0, 0.1)",
              padding: "10px",
            }}
          >
            <span className="font-bold" style={{ color: "#d87876" }}>
              SPEC:
            </span>
            &nbsp;&nbsp;
            {Number(selectedVariation?.netWeight) > 0 && (
              <>
                <span className="font-bold">Net Wt:</span>&nbsp;
                {selectedVariation?.netWeight} Gms&nbsp;&nbsp;
              </>
            )}
            {Number(
              Number(selectedVariation?.diamondWeight || 0) +
                Number(selectedVariation?.diamondWeight1 || 0) +
                Number(selectedVariation?.diamondWeight2 || 0) +
                Number(selectedVariation?.diamondWeight3 || 0) +
                Number(selectedVariation?.diamondWeight4 || 0) || 0
            ) > 0 && (
              <>
                <span className="font-bold">
                  {[2, 3].includes(product?.type?.id)
                    ? "Diamond Wt:"
                    : "Stone Wt:"}
                </span>
                &nbsp;
                {(
                  Number(selectedVariation?.diamondWeight || 0) +
                    Number(selectedVariation?.diamondWeight1 || 0) +
                    Number(selectedVariation?.diamondWeight2 || 0) +
                    Number(selectedVariation?.diamondWeight3 || 0) +
                    Number(selectedVariation?.diamondWeight4 || 0) || 0
                ).toFixed(3)}{" "}
                Ct,&nbsp;&nbsp;
              </>
            )}
            {Number(selectedVariation?.stoneWeight) > 0 && (
              <>
                <span className="font-bold">Stone Wt:</span>&nbsp;
                {selectedVariation?.stoneWeight} Ct&nbsp;&nbsp;
              </>
            )}
            {Number(selectedVariation?.wastage) > 0 && (
              <>
                <span className="font-bold">Wastage:</span>&nbsp;
                {product?.shop?.markup_type === "p" ? "" : ""}
                {(() => {
                  const wastageValue =
                    (!me || userType == 1) &&
                    selectedVariation?.wastage &&
                    product?.shop?.wastage_markup //&& Difference_In_Days < 30))
                      ? Number(
                          Number(
                            Number(Number(selectedVariation?.wastage || 0)) +
                              Number(product?.shop?.wastage_markup || 0)
                          ) * wastage_extra
                        )
                      : Number(selectedVariation?.wastage || 0) +
                        Number(product?.shop?.wastage_markup || 0);
                  return wastageValue.toFixed(2);
                })()}
                {product?.shop?.markup_type === "p" ? "%" : ""}
              </>
            )}
          </p>

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
                  {price?.split(".")[0]}
                </div>

                {basePrice && (
                  <del className="font-segoe text-gray-400 text-base lg:text-xl ltr:pl-2.5 rtl:pr-2.5 -mt-0.5 md:mt-0">
                    {basePrice?.split(".")[0]}
                  </del>
                )}
              </>
            )}
            <div className="text-sm text-bold text-400 italic align-bottom">
              &nbsp;&nbsp;(MRP Excl. of taxes)
            </div>
          </div>
        </div>
        <hr style={{ border: "0.1px solid #2f3737" }} />

        <div>
          <div
            style={{
              border: "2px solid #5d6b6b",
              margin: "10px",
              borderTopLeftRadius: "17px",
              borderTopRightRadius: "17px",
              borderBottomLeftRadius: "15px",
              borderBottomRightRadius: "15px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#5d6b6b",
                padding: "2px 10px",
                cursor: "pointer",
                borderBottomLeftRadius: "7px",
                borderBottomRightRadius: "7px",
                borderRadius: "12px",
              }}
              onClick={toggleExpand}
            >
              <span>
                {isExpanded ? (
                  <>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "white",
                      }}
                    >
                      Hide Customization
                      <img
                        src="../../assets/images/cus.gif"
                        alt="Customization Icon"
                        style={{
                          width: "60px",
                          height: "60px",
                          marginLeft: "-5px",
                          verticalAlign: "middle",
                          marginTop: "-40px",
                        }}
                      />
                    </span>
                  </>
                ) : (
                  <>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "white",
                      }}
                    >
                      Customize this Product
                      <img
                        src="../../assets/images/cus.gif"
                        alt="Customization Icon"
                        style={{
                          width: "60px",
                          height: "60px",
                          marginLeft: "-5px",
                          verticalAlign: "middle",
                          marginTop: "-40px",
                        }}
                      />
                    </span>
                  </>
                )}
              </span>
              <span>
                {isExpanded ? (
                  <>
                    <span style={{ fontSize: "30px", color: "white" }}>-</span>
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: "30px", color: "white" }}>+</span>
                  </>
                )}
              </span>
            </div>
            {isExpanded && (
              <div style={{ padding: "10px" }}>
                {!isEmpty(variations) && (
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {Object.keys(variations)?.map((variation) => (
                      <div
                        key={variation}
                        style={{
                          flex: "0 0 calc(50% - 10px)", // Two columns with some spacing
                          padding: "10px",
                          boxSizing: "border-box",
                        }}
                      >
                        <ProductAttributes
                          title={variation}
                          attributes={variations[variation]}
                          active={attributes[variation]}
                          onClick={handleAttribute}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {"\n"}
        <br />

        {isEmpty(selectedVariation) && !isLoadingRate ? (
          <li></li>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <table cellPadding={1} style={{ textAlign: "center" }}>
              <tr>
                {Number(selectedVariation?.metal) ? (
                  <td style={{ fontWeight: "bold", color: "black" }}>Metal</td>
                ) : (
                  ""
                )}
                {Number(selectedVariation?.metal) &&
                Number(selectedVariation?.diamond) ? (
                  <td></td>
                ) : (
                  ""
                )}
                {Number(selectedVariation?.diamond) ? (
                  <td style={{ fontWeight: "bold", color: "black" }}>
                    Diamond
                  </td>
                ) : (
                  ""
                )}
                {Number(selectedVariation?.stone) ? <td></td> : ""}
                {Number(selectedVariation?.stone) ? (
                  <td style={{ fontWeight: "bold", color: "black" }}>Stone</td>
                ) : (
                  ""
                )}
                {Number(selectedVariation?.wastagePrice) ? <td></td> : ""}
                {Number(selectedVariation?.wastagePrice) ? (
                  <td style={{ fontWeight: "bold", color: "black" }}>
                    Wastage
                  </td>
                ) : (
                  ""
                )}
                {Number(selectedVariation?.makingCharges) ? <td></td> : ""}
                {Number(selectedVariation?.makingCharges) ? (
                  <td style={{ fontWeight: "bold", color: "black" }}>
                    Making Charges
                  </td>
                ) : (
                  ""
                )}
                {Number(selectedVariation?.price) ? <td></td> : ""}
                {Number(selectedVariation?.price) ? (
                  <td style={{ fontWeight: "bold", color: "black" }}>
                    GST ({product?.type?.id < 5 ? 3 : 1.5}%)
                  </td>
                ) : (
                  ""
                )}
                {Number(selectedVariation?.price) ? <td></td> : ""}
                {Number(selectedVariation?.price) ? (
                  <td style={{ fontWeight: "bold", color: "black" }}>Total</td>
                ) : (
                  ""
                )}
              </tr>
              <tr style={{ fontWeight: "bold", color: "black" }}>
                {Number(selectedVariation?.metal) ? (
                  <td>
                    <hr style={{ border: "0.1px solid #2f3737" }} />
                    {round(Number(selectedVariation?.metal))?.toFixed(0) ||
                      Number(0)?.toFixed(0)}
                  </td>
                ) : (
                  ""
                )}

                {Number(selectedVariation?.metal) &&
                Number(selectedVariation?.diamond) ? (
                  <td>+</td>
                ) : (
                  ""
                )}
                {Number(selectedVariation?.diamond) ? (
                  <td>
                    <hr style={{ border: "0.1px solid #2f3737" }} />
                    {(!me || userType == 1) && selectedVariation?.diamond // && Difference_In_Days < 30))
                      ? round(
                          Number(Number(selectedVariation?.diamond)) *
                            stone_extra
                        )?.toFixed(0)
                      : round(Number(selectedVariation?.diamond))?.toFixed(0) ||
                        Number(0)?.toFixed(0)}
                  </td>
                ) : (
                  ""
                )}
                {Number(selectedVariation?.stone) ? <td>+</td> : ""}
                {Number(selectedVariation?.stone) ? (
                  <td>
                    <hr style={{ border: "0.1px solid #2f3737" }} />
                    {(!me || userType == 1) && selectedVariation?.stone //  && Difference_In_Days < 30))
                      ? round(
                          Number(Number(selectedVariation?.stone)) * stone_extra
                        )?.toFixed(0)
                      : round(Number(selectedVariation?.stone))?.toFixed(0) ||
                        Number(0)?.toFixed(0)}
                  </td>
                ) : (
                  ""
                )}
                {Number(selectedVariation?.wastagePrice) ? <td>+</td> : ""}
                {Number(selectedVariation?.wastagePrice) ? (
                  <td>
                    <hr style={{ border: "0.1px solid #2f3737" }} />
                    {(!me || userType == 1) && selectedVariation?.wastagePrice // && Difference_In_Days < 30))
                      ? round(
                          Number(
                            Number(selectedVariation?.wastagePrice) *
                              wastage_extra
                          )
                        )?.toFixed(0)
                      : round(Number(selectedVariation?.wastagePrice))?.toFixed(
                          0
                        ) || Number(0)?.toFixed(0)}
                  </td>
                ) : (
                  ""
                )}
                {Number(selectedVariation?.makingCharges) ? <td>+</td> : ""}
                {Number(selectedVariation?.makingCharges) ? (
                  <td>
                    <hr style={{ border: "0.1px solid #2f3737" }} />
                    {(!me || userType == 1) && selectedVariation?.makingCharges //&& Difference_In_Days < 30))
                      ? round(
                          Number(
                            Number(selectedVariation?.makingCharges) *
                              making_extra
                          )
                        )?.toFixed(0)
                      : round(
                          Number(selectedVariation?.makingCharges)
                        )?.toFixed(0) || Number(0)?.toFixed(0)}
                  </td>
                ) : (
                  ""
                )}
                {Number(selectedVariation?.price) ? <td>+</td> : ""}
                {Number(selectedVariation?.price) ? (
                  <td>
                    <hr style={{ border: "0.1px solid #2f3737" }} />
                    <div className={"text-base"}>
                      {(!me || userType == 1) &&
                      (selectedVariation?.makingCharges ||
                        selectedVariation?.metal ||
                        selectedVariation?.stone ||
                        selectedVariation?.diamond ||
                        selectedVariation?.wastagePrice) //&& Difference_In_Days < 30))
                        ? round(
                            Number(
                              Number(
                                Number(
                                  Number(
                                    round(
                                      Number(selectedVariation?.metal)
                                    )?.toFixed(0)
                                  ) +
                                    Number(
                                      round(
                                        Number(
                                          Number(
                                            Number(
                                              selectedVariation?.diamond || 0
                                            ) || 0
                                          ) * stone_extra
                                        )
                                      ).toFixed(0)
                                    ) +
                                    Number(
                                      round(
                                        Number(
                                          Number(selectedVariation?.stone) *
                                            stone_extra
                                        )
                                      )?.toFixed(0)
                                    ) +
                                    Number(
                                      round(
                                        Number(
                                          Number(
                                            selectedVariation?.wastagePrice
                                          ) * wastage_extra
                                        )
                                      )?.toFixed(0)
                                    ) +
                                    Number(
                                      round(
                                        Number(
                                          Number(
                                            selectedVariation?.makingCharges
                                          ) * making_extra
                                        )
                                      )?.toFixed(0)
                                    )
                                ) / 100
                              ) * (product?.type?.id < 5 ? 3 : 1.5)
                            )
                          )?.toFixed(0) || Number(0)?.toFixed(0)
                        : round(
                            Number(
                              Number(
                                Number(
                                  Number(
                                    round(
                                      Number(selectedVariation?.metal)
                                    )?.toFixed(0)
                                  ) +
                                    Number(
                                      round(
                                        Number(
                                          Number(
                                            selectedVariation?.diamond || 0
                                          ) || 0
                                        )
                                      )?.toFixed(0)
                                    ) +
                                    Number(
                                      round(
                                        Number(selectedVariation?.stone)
                                      )?.toFixed(0)
                                    ) +
                                    Number(
                                      round(
                                        Number(selectedVariation?.wastagePrice)
                                      )?.toFixed(0)
                                    ) +
                                    Number(
                                      round(
                                        Number(selectedVariation?.makingCharges)
                                      )?.toFixed(0)
                                    )
                                ) / 100
                              ) * (product?.type?.id < 5 ? 3 : 1.5)
                            )
                          )?.toFixed(0) || Number(0)?.toFixed(0)}
                    </div>
                  </td>
                ) : (
                  ""
                )}
                {Number(selectedVariation?.price) ? <td>=</td> : ""}
                {Number(selectedVariation?.price) ? (
                  <td>
                    <hr style={{ border: "0.1px solid #2f3737" }} />
                    <div className={"text-base"}>
                      {(!me || userType == 1) &&
                      (selectedVariation?.makingCharges ||
                        selectedVariation?.metal ||
                        selectedVariation?.diamond ||
                        selectedVariation?.stone ||
                        selectedVariation?.wastagePrice) // && Difference_In_Days < 30))
                        ? round(
                            Number(
                              Number(
                                Number(
                                  round(
                                    Number(selectedVariation?.metal)
                                  )?.toFixed(0)
                                ) +
                                  Number(
                                    round(
                                      Number(
                                        Number(
                                          Number(
                                            selectedVariation?.diamond || 0
                                          ) || 0
                                        ) * stone_extra
                                      )
                                    )?.toFixed(0)
                                  ) +
                                  Number(
                                    round(
                                      Number(
                                        Number(selectedVariation?.stone) *
                                          stone_extra
                                      )
                                    )?.toFixed(0)
                                  ) +
                                  Number(
                                    round(
                                      Number(
                                        Number(
                                          selectedVariation?.wastagePrice
                                        ) * wastage_extra
                                      )
                                    )?.toFixed(0)
                                  ) +
                                  Number(
                                    round(
                                      Number(
                                        Number(
                                          selectedVariation?.makingCharges
                                        ) * making_extra
                                      )
                                    )?.toFixed(0)
                                  )
                              ) +
                                Number(
                                  Number(
                                    Number(
                                      Number(
                                        round(
                                          Number(selectedVariation?.metal)
                                        )?.toFixed(0)
                                      ) +
                                        Number(
                                          round(
                                            Number(
                                              Number(
                                                Number(
                                                  selectedVariation?.diamond ||
                                                    0
                                                ) || 0
                                              ) * stone_extra
                                            )
                                          )?.toFixed(0)
                                        ) +
                                        Number(
                                          round(
                                            Number(
                                              Number(selectedVariation?.stone) *
                                                stone_extra
                                            )
                                          )?.toFixed(0)
                                        ) +
                                        Number(
                                          round(
                                            Number(
                                              Number(
                                                selectedVariation?.wastagePrice
                                              ) * wastage_extra
                                            )
                                          )?.toFixed(0)
                                        ) +
                                        Number(
                                          round(
                                            Number(
                                              Number(
                                                selectedVariation?.makingCharges
                                              ) * making_extra
                                            )
                                          )?.toFixed(0)
                                        )
                                    ) / 100
                                  ) * (product?.type?.id < 5 ? 3 : 1.5)
                                )
                            )
                          )?.toFixed(0) || Number(0)?.toFixed(0)
                        : round(
                            Number(
                              Number(
                                Number(
                                  round(
                                    Number(selectedVariation?.metal)
                                  )?.toFixed(0)
                                ) +
                                  Number(
                                    round(
                                      Number(
                                        Number(
                                          selectedVariation?.diamond || 0
                                        ) || 0
                                      )
                                    )?.toFixed(0)
                                  ) +
                                  Number(
                                    round(
                                      Number(selectedVariation?.stone)
                                    )?.toFixed(0)
                                  ) +
                                  Number(
                                    round(
                                      Number(selectedVariation?.wastagePrice)
                                    )?.toFixed(0)
                                  ) +
                                  Number(
                                    round(
                                      Number(selectedVariation?.makingCharges)
                                    )?.toFixed(0)
                                  )
                              ) +
                                Number(
                                  Number(
                                    Number(
                                      Number(
                                        round(
                                          Number(selectedVariation?.metal)
                                        )?.toFixed(0)
                                      ) +
                                        Number(
                                          round(
                                            Number(
                                              Number(
                                                selectedVariation?.diamond || 0
                                              ) || 0
                                            )
                                          )?.toFixed(0)
                                        ) +
                                        Number(
                                          round(
                                            Number(selectedVariation?.stone)
                                          )?.toFixed(0)
                                        ) +
                                        Number(
                                          round(
                                            Number(
                                              selectedVariation?.wastagePrice
                                            )
                                          )?.toFixed(0)
                                        ) +
                                        Number(
                                          round(
                                            Number(
                                              selectedVariation?.makingCharges
                                            )
                                          )?.toFixed(0)
                                        )
                                    ) / 100
                                  ) * (product?.type?.id < 5 ? 3 : 1.5)
                                )
                            )
                          )?.toFixed(0) || Number(0)?.toFixed(0)}
                    </div>
                  </td>
                ) : (
                  ""
                )}
              </tr>
            </table>
          </div>
        )}

        {<br />}

        <hr style={{ border: "0.1px solid #2f3737" }} />
        <div className="flex items-center space-x-4 rtl:space-x-reverse ltr:md:pr-32 ltr:lg:pr-12 ltr:2xl:pr-32 ltr:3xl:pr-48 rtl:md:pl-32 rtl:lg:pl-12 rtl:2xl:pl-32 rtl:3xl:pl-48 border-gray-300 py-8">
          {isEmpty(variations) && (
            <>
              {Number(product?.quantity) > 0 ? (
                <Counter
                  quantity={quantity}
                  onIncrement={() => setQuantity((prev) => prev + 1)}
                  onDecrement={() =>
                    setQuantity((prev) => (prev !== 1 ? prev - 1 : 1))
                  }
                  disableDecrement={quantity === 0}
                  disableIncrement={Number(product?.quantity) === quantity}
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
                <Counter
                  quantity={quantity}
                  onIncrement={() => setQuantity((prev) => prev + 1)}
                  onDecrement={() =>
                    setQuantity((prev) => (prev !== 1 ? prev - 1 : 1))
                  }
                  disableDecrement={quantity === 1}
                  disableIncrement={
                    Number(selectedVariation?.quantity) === quantity
                  }
                />
              }
            </>
          )}
          <Button
            onClick={addToCart}
            variant="slim"
            className={`w-full md:w-6/12 xl:w-full `}
            loading={addToCartLoader}
            style={{ background: "#5d6b6b" }}
          >
            <span className="py-2 3xl:px-8">
              {product?.quantity ||
              (!isEmpty(selectedVariation) && selectedVariation?.quantity)
                ? t("text-add-to-cart")
                : t("text-add-to-cart")}
            </span>
          </Button>
        </div>
        <div className={`border-b border-gray-300`}>
          <span className={`w-full md:w-6/12 xl:w-full text-center`}>
            <p className={`text-center`}>
              {product?.quantity ||
              (!isEmpty(selectedVariation) && selectedVariation?.quantity)
                ? ""
                : `Ready to ship`}
            </p>
          </span>
          <br />
        </div>
        <div className="py-6">
          <ul className="text-sm space-y-5 pb-1">
            {selectedVariation?.sku && (
              <li>
                <span className="font-semibold text-heading inline-block ltr:pr-2 rtl:pl-2">
                  SKU:
                </span>
                {selectedVariation?.sku}
              </li>
            )}

            {product?.categories &&
              Array.isArray(product?.categories) &&
              product?.categories?.length > 0 && (
                <li>
                  <span className="font-semibold text-heading inline-block ltr:pr-2 rtl:pl-2">
                    Category:
                  </span>
                  {product?.categories?.map((category: any, index: number) => (
                    <Link
                      key={index}
                      href={`${ROUTES?.CATEGORY}/${category?.slug}`}
                      className="transition hover:underline hover:text-heading"
                    >
                      {product?.categories?.length === index + 1
                        ? category?.name
                        : `${category?.name}, `}
                    </Link>
                  ))}
                </li>
              )}

            {product?.tags &&
              Array.isArray(product?.tags) &&
              product?.tags?.length > 0 && (
                <li className="productTags">
                  <span className="font-semibold text-heading inline-block ltr:pr-2 rtl:pl-2">
                    Tags:
                  </span>
                  {product?.tags?.map((tag: any) => (
                    <Link
                      key={tag?.id}
                      href={`${ROUTES?.COLLECTIONS}/${tag?.slug}`}
                      className="inline-block ltr:pr-1.5 rtl:pl-1.5 transition hover:underline hover:text-heading ltr:last:pr-0 rtl:last:pl-0"
                    >
                      {tag?.name}
                      <span className="text-heading">,</span>
                    </Link>
                  ))}
                </li>
              )}

            <li>
              <span className="font-semibold text-heading inline-block ltr:pr-2 rtl:pl-2">
                {t("text-brand-colon")}
              </span>
              <Link
                href={`${ROUTES?.BRAND}=${product?.type?.slug}`}
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
                href={`${ROUTES?.SHOPS}/${product?.shop?.slug || "zgpl"}`}
                className="inline-block ltr:pr-1.5 rtl:pl-1.5 transition hover:underline hover:text-heading ltr:last:pr-0 rtl:last:pl-0"
              >
                {product?.shop?.vendor_code || "ZGPL"}
              </Link>
            </li>
          </ul>
        </div>
        <hr style={{ border: "0.1px solid #2f3737" }} />
        <br />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#333",
            fontSize: "12px",
          }}
        >
          <div style={{ marginRight: "10px" }}>
            {/* Icon 1 */}
            <img
              src="../../assets/images/lifetime.jpg" // Replace with your actual icon image URL
              alt="Icon 1"
              style={{ width: "24px", height: "24px" }}
            />
          </div>
          Lifetime Exchange & Buy-Back
          <span style={{ margin: "0 10px" }}>|</span>
          <div style={{ marginRight: "10px" }}>
            {/* Icon 2 */}
            <img
              src="../../assets/images/certified.jpg" // Replace with your actual icon image URL
              alt="Icon 2"
              style={{ width: "24px", height: "24px" }}
            />
          </div>
          Certified Jewellery
        </div>
        <br />

        {/* Check if the screen width is greater than or equal to 1025 pixels (desktop view) */}
        {width >= 1025 ? (
          <div
            style={{
              textAlign: "center",
              fontWeight: "bold",
              marginTop: "15px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#333",
              }}
            >
              {/* Contact information */}
              <div>
                Any Questions? Please feel free to reach us at:{" "}
                <span style={{ fontWeight: "bold" }}>+91 9624077111</span>
              </div>
            </div>
          </div>
        ) : (
          /* Mobile view (width < 1025) */
          <div
            style={{
              textAlign: "center",
              fontWeight: "bold",
              marginTop: "15px",
            }}
          >
            {/* Check if the value is not equal to 0 and apply mobile-specific styling */}
            {product?.buy_back_policy &&
              product?.buy_back_policy?.buy_back_description &&
              product?.buy_back_policy?.buy_back_value !== 0 && (
                <div
                  className=""
                  style={{
                    width: "100%",
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  {/* Container for Big Text and Circled Value */}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {/* Big Text */}
                    <p
                      style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        margin: "0 10px 0 0",
                        textDecoration: "underline",
                      }}
                    >
                      Buy Back Available
                    </p>
                    {/* Circled value */}
                    <div
                      style={{
                        backgroundColor: "#7b68ee",
                        color: "white",
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      {product?.buy_back_policy?.buy_back_value}
                    </div>
                  </div>
                  {/* Card description below */}
                  <div className="flex">
                    <div
                      style={{
                        marginLeft: "10px",
                        fontSize: "12px",
                        fontWeight: "normal",
                      }}
                    >
                      <p className="">
                        {product?.buy_back_policy?.buy_back_description}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            <br />
            <br />

            <h2>Certifications</h2>
            <div
              className=""
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src="../../assets/images/bis.jpg"
                alt="Certification Icon 1"
                style={{ maxWidth: "15%", height: "auto", margin: "10px" }}
              />
              <img
                src="../../assets/images/igi.jpg"
                alt="Certification Icon 2"
                style={{ maxWidth: "15%", height: "auto", margin: "10px" }}
              />
              <img
                src="../../assets/images/gia.jpg"
                alt="Certification Icon 3"
                style={{ maxWidth: "15%", height: "auto", margin: "10px" }}
              />
              <img
                src="../../assets/images/sgl.jpg"
                alt="Certification Icon 4"
                style={{ maxWidth: "15%", height: "auto", margin: "10px" }}
              />
              <img
                src="../../assets/images/hrd.jpg"
                alt="Certification Icon 5"
                style={{ maxWidth: "15%", height: "auto", margin: "10px" }}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              {/* Contact information */}
              <div
                style={{
                  color: "#333",
                  fontSize: "14px",
                  marginBottom: "10px",
                }}
              >
                Any Questions? Please feel free to reach us at:{" "}
                <span style={{ fontWeight: "bold" }}>+91 9624077111</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSingleDetails;
