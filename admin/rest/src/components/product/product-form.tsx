import Input from "@components/ui/input";
import TextArea from "@components/ui/text-area";
import { useForm, FormProvider } from "react-hook-form";
import Button from "@components/ui/button";
import Description from "@components/ui/description";
import Card from "@components/common/card";
import Label from "@components/ui/label";
import Radio from "@components/ui/radio/radio";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import FileInput from "@components/ui/file-input";
import { productValidationSchema } from "./product-validation-schema";
import groupBy from "lodash/groupBy";
import ProductVariableForm from "./product-variable-form";
import ProductSimpleForm from "./product-simple-form";
import ProductGroupInput from "./product-group-input";
import ProductCategoryInput from "./product-category-input";
import orderBy from "lodash/orderBy";
import sum from "lodash/sum";
import cloneDeep from "lodash/cloneDeep";
import ProductTypeInput from "./product-type-input";
import {
  Type,
  ProductType,
  Category,
  AttachmentInput,
  ProductStatus,
  Product,
  VariationOption,
  Tag,
  BuyBackPolicyInput,
} from "@ts-types/generated";
import { useCreateProductMutation } from "@data/product/product-create.mutation";
import { useTranslation } from "next-i18next";
import { useUpdateProductMutation } from "@data/product/product-update.mutation";
import { useShopQuery } from "@data/shop/use-shop.query";
import ProductTagInput from "./product-tag-input";
import Alert from "@components/ui/alert";
import { useState } from "react";
import { animateScroll } from "react-scroll";

import { useMeQuery } from "@data/user/use-me.query";
import { useProductsQuery } from "@data/product/products.query";
import { useAttributesQuery } from "@data/attributes/use-attributes.query";

type Variation = {
  formName: number;
};

type FormValues = {
  sku: string;
  name: string;
  stylecode: string;
  hsn:string;
  type: Type;
  product_type: ProductType;
  description: string;
  unit: string;
  price: number;
  min_price: number;
  max_price: number;
  zero_inventory_fill:number;
  sale_price: number;
  quantity: number;
  categories: Category[];
  tags: Tag[];
  in_stock: boolean;
  is_taxable: boolean;
  image: AttachmentInput;
  video: AttachmentInput;
  is_featured_video:boolean;
  image_link: string;
  video_link: string;
  certificate_link: string;
  cert_no: string;
  gallery: AttachmentInput[];
  status: ProductStatus;
  width: string;
  height: string;
  length: string;
  shape: string;
  size:number;
  color:string;
  clarity:string;
  cut:string;
  polish:string;
  symmetry:string;
  fluorescence:string;
  grading:string;
  location:string;
  discount:number;
  rate_per_unit:number;
  isVariation: boolean;
  variations: Variation[];
  variation_options: Product["variation_options"];
  [key: string]: any;
  buy_back_policy: BuyBackPolicyInput
};
const defaultValues = {
  sku: "",
  name: "",
  stylecode:"",
  hsn: "",
  type: "",
  productTypeValue: { name: "Variable Product", value: ProductType.Variable },
  description: "",
  unit: 0,
  makingCharges: 0,
  price: 1,
  min_price: 0.0,
  max_price: 0.0,
  zero_inventory_fill:0,
  sale_price: 0,
  quantity: 1,
  categories: [],
  tags: [],
  in_stock: true,
  is_taxable: false,
  image: [],
  video:[],
  is_featured_video:false,
  image_link: "",
  video_link: "",
  certificate_link:"",
  cert_no:"",
  gallery: [],
  status: ProductStatus.Draft,
  width: "",
  height: "",
  length: "",
  shape:{name:"ROUND",value:"ROUND"},
  size:0.01,
  color:{name:"D",value:"D"},
  clarity:{name:"SI1",value:"SI1"},
  cut:{name:"ANY",value:"ANY"},
  polish:{name:"ANY",value:"ANY"},
  symmetry:{name:"ANY",value:"ANY"},
  fluorescence:{name:"NONE",value:"NONE"},
  grading:{name:"GIA",value:"GIA"},
  location:{name:"INDIA",value:"INDIA"},
  discount:0,
  rate_per_unit:1,
  isVariation: false,
  variations: [],
  variation_options: [],
  buy_back_policy: {buy_back_description:"", buy_back_value: ""}
};

type IProps = {
  initialValues?: Product | null;
};

const productType = [
  { name: "Featured Product", value: ProductType.Simple },
  { name: "Variable Product", value: ProductType.Variable },
];
function getFormattedVariations(variations: any) {
  const variationGroup = groupBy(variations, "attribute.slug");
  return Object.values(variationGroup)?.map((vg) => {
    return {
      attribute: vg?.[0]?.attribute,
      value: vg?.map((v) => ({ id: v.id, value: v.value })),
    };
  });
}

function processOptions(options: any) {
  try {
    return JSON.parse(options);
  } catch (error) {
    return options;
  }
}

function calculateMaxMinPrice(variationOptions: any) {
  if (!variationOptions || !variationOptions.length) {
    return {
      min_price: null,
      max_price: null,
    };
  }
  const sortedVariationsByPrice = orderBy(variationOptions, ["price"]);
  const sortedVariationsBySalePrice = orderBy(variationOptions, ["sale_price"]);
  return {
    min_price:
      sortedVariationsBySalePrice?.[0].sale_price <
      sortedVariationsByPrice?.[0]?.price
        ? Number(sortedVariationsBySalePrice?.[0].sale_price)
        : Number(sortedVariationsByPrice?.[0]?.price),
    max_price: Number(
      sortedVariationsByPrice?.[sortedVariationsByPrice?.length - 1]?.price
    ),
  };
}

function calculateQuantity(variationOptions: any) {
  return sum(
    variationOptions?.map(({ quantity }: { quantity: number }) => quantity)
  );
}
let countTypeOfProduct = 0;

export default function CreateOrUpdateProductForm({ initialValues }: IProps) {
  const inValue = cloneDeep(initialValues);
  const [productName, setProductName] = useState(initialValues?.name || "");
  const [productStyleCode, setProductStyleCode] = useState(initialValues?.stylecode || "");
  const [productMakingCharges, setMakingCharges] = useState(initialValues?.makingCharges || 0);
  const [typeOfProduct, setProductType] = useState(initialValues?.product_type || "");
  const [lengthVariationOption, setLengthVariationOption] = useState(initialValues?.variation_options?.length || 0);
  const { data:me } = useMeQuery();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { t } = useTranslation();
  let {
    query: { shop },
  } = router;
  shop = shop ? shop : initialValues?.shop?.slug
  const { data: shopData } = useShopQuery(shop as string, { enabled: !!shop });
  const shopId = shopData?.shop?.id!;
  const methods = useForm<FormValues>({
    resolver: yupResolver(productValidationSchema),
    shouldUnregister: true,
    //@ts-ignore
    defaultValues: initialValues
      ? cloneDeep({
          ...initialValues,
          isVariation:
            initialValues.variations?.length &&
            initialValues.variation_options?.length
              ? true
              : false,
          productTypeValue: initialValues.product_type
            ? productType.find(
                (type) => initialValues.product_type === type.value
              )
            : productType[0],
          variations: getFormattedVariations(initialValues?.variations),
        })
        : cloneDeep({
          ...defaultValues,
          buy_back_policy : {
            buy_back_description: shopData?.shop?.buy_back_policy?.buy_back_description,
            buy_back_value: shopData?.shop?.buy_back_policy?.buy_back_value
          }
        })  
  });
  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = methods;
  if(typeOfProduct == "SOLITAIRES"){
    if(!countTypeOfProduct)
    {
      setValue('productTypeValue', {name: 'Featured Product', value: ProductType.Simple} );
      if(inValue)
      {
        setValue('shape',{name:inValue.shape,value:inValue.shape});
        setValue('color',{name:inValue.color,value:inValue.color});
        setValue('clarity',{name:inValue.clarity,value:inValue.clarity});
        setValue('cut',{name:inValue.cut,value:inValue.cut});
        setValue('polish',{name:inValue.polish,value:inValue.polish});
        setValue('symmetry',{name:inValue.symmetry,value:inValue.symmetry});
        setValue('fluorescence',{name:inValue.fluorescence,value:inValue.fluorescence});
        setValue('grading',{name:inValue.grading,value:inValue.grading});
        setValue('location',{name:inValue.location,value:inValue.location});
      }
    }
    countTypeOfProduct++;
}
  const {
    mutate: createProduct,
    isLoading: creating,
  } = useCreateProductMutation();
  const {
    mutate: updateProduct,
    isLoading: updating,
  } = useUpdateProductMutation();

  let {
    data:productData,
  } = useProductsQuery({
    status:'draft',
    limit: 999,
  });
  let {
    data:productData2,
  } = useProductsQuery({
    status:'publish',
    limit: 999,
  });
  const { data:attributeList } = useAttributesQuery({});

  const onSubmit = async (values: FormValues) => {
  let caculationShopData = JSON.parse(localStorage.getItem("shopData") || "{}");
    if(!initialValues 
      && 
      (
        productData?.products?.data?.map((x:any)=>x.stylecode.toUpperCase()).includes(values.stylecode.toUpperCase())
||        productData2?.products?.data?.map((x:any)=>x.stylecode.toUpperCase()).includes(values.stylecode.toUpperCase())
    ))
    {
      alert("Product Style Code already exists");
      return;
    }
    if( values?.product_type == ProductType.Variable && (!values?.variation_options || values?.variation_options.length < 1))
    {
      alert("Cannot perform without variation options");
      return;
    }
    if(values?.variation_options?.find((x:any) => x.price <= 0))
    {
      alert("Price can not be zero, please set it from attribute or contact admin");
      return;
    }
    if(typeOfProduct == "SOLITAIRES" && (values?.size*100<1 || values?.size*100>430))
    { 
      alert("Invalid Size In CT, it must be greater than or equal to 0.01 and less than or equal to 4.3");
      return;
    }
    const { type } = values;
    let attributes = attributeList?.attributes;
  let goldAttribute = attributes?.find((x:any)=>x.name?.toUpperCase() == "GOLD");
  let pureGoldRate = (Number(goldAttribute?.values.find((x:any)=>x.value.includes('24') && x.vendor_type === caculationShopData?.shop?.customer_type)?.rate) || 0);
  if(values?.product_type == ProductType.Variable)
  {  
  values?.variation_options.forEach((value: any) => {
      value.diamondWeightInG = Number(Number(Number(value.diamondWeight) || 0)/5) || 0;
      value.diamondWeightInG1 = Number(Number(Number(value.diamondWeight1) || 0)/5) || 0;
      value.diamondWeightInG2 = Number(Number(Number(value.diamondWeight2) || 0)/5) || 0;
      value.diamondWeightInG3 = Number(Number(Number(value.diamondWeight3) || 0)/5) || 0;
      value.diamondWeightInG4 = Number(Number(Number(value.diamondWeight4) || 0)/5) || 0;
      value.stoneWeightInG = Number(Number(Number(value.stoneWeight) || 0)/5) || 0;
      value.netWeight = (Number(value.goldWeight) || 0)- Number(value.diamondWeightInG || 0)- Number(value.diamondWeightInG1 || 0)- Number(value.diamondWeightInG2 || 0)- Number(value.diamondWeightInG3 || 0) - Number(value.diamondWeightInG4 || 0) - Number(value.stoneWeightInG || 0) || 0;
      value.netWeight = value.netWeight < 0 ? 0 : Number(value.netWeight);
      value.percent = value.title.includes("22KT") ? 0.92 : (value.title.includes("18KT") ? 0.76 : ( value.title.includes("92.5") ? 0.925 : 0.595));
      value.percent = value.title.includes("24KT") ? 1 : value.percent;
      let percent2 = value.title.includes("22KT") ? 8.696 : (value.title.includes("18KT") ? 33.34 : 70.95);
      percent2 = value.title.includes("24KT") ? 0 : percent2;
      percent2 = value.title.includes("92.5") ? 8.1125 : percent2;
      value.pureWeight = Number(Number(value.netWeight || 0) * Number(Number(Number(value.wastage || 0)/100) + Number(value.percent || 0) || 0) || 0).toFixed(3);
      value.makingCharges = Number(Number(Number(productMakingCharges || 0) 
      + (caculationShopData?.shop?.markup_type == "p" ? Number(Number(productMakingCharges || 0)*Number(Number(caculationShopData?.shop?.making_charges_markup)/100)) : (Number(caculationShopData?.shop?.making_charges_markup || 0))))
      * Number(value.netWeight) || 0);
      value.metal = Number(Number(value.goldPrice || 0) * Number(value.netWeight || 0));
      value.wastagePrice = (Number((pureGoldRate ? pureGoldRate 
        : Number(Number(value.goldPrice* percent2)/100)) * 
        (Number(Number(value.netWeight)*Number(Number(value.wastage)/100)) + (Number(value.wastage) ? (caculationShopData?.shop?.markup_type == "p" ? Number(Number
          (Number(value.netWeight)
          )
        *Number(Number(caculationShopData?.shop.wastage_markup || 0)/100)) : Number(caculationShopData?.shop.wastage_markup || 0) ) : 0))) || 0);
        
      if(["DIAMOND JEWELLERY","POLKI JEWELLERY","LOOSE DIAMOND","LABGROWN LOOSE DIAMOND","SOLITAIRES","LABGROWN SOLITAIRES"].includes(typeOfProduct.toUpperCase() || ""))
      {
        value.diamond = Number(Number(Number(value.diamondPrice || 0) * Number(value.diamondWeight || 0) || 0) + Number(Number(value.diamondPrice1 || 0) * Number(value.diamondWeight1 || 0) || 0) + Number(Number(value.diamondPrice2 || 0) * Number(value.diamondWeight2 || 0) || 0) + Number(Number(value.diamondPrice3 || 0) * Number(value.diamondWeight3 || 0) || 0) + Number(Number(value.diamondPrice4 || 0) * Number(value.diamondWeight4 || 0) || 0)) || 0;
        value.diamond = Number(Number(value.diamond) + ((Number(value.diamond)* Number(shopData?.shop?.balance?.admin_commission_rate || 0))/100)) || 0;
        value.stone = Number(Number(Number(value.stonePrice || 0) * Number(value.stoneWeight || 0) || 0)) || 0;
        value.stone = Number(Number(value.stone) + ((Number(value.stone)* Number(shopData?.shop?.balance?.admin_commission_rate || 0))/100)) || 0;
      }
      else{
        value.diamond = 0;
        value.stone = Number(Number(Number(value.diamondPrice || 0) * Number(value.diamondWeight || 0) || 0)) || 0;
        value.stone = Number(Number(value.stone) + ((Number(value.stone)* Number(shopData?.shop?.balance?.admin_commission_rate || 0))/100)) || 0;
      }
      value.price =
      ((
        value.metal
      + value.makingCharges
      + value.wastagePrice
      +
    value.diamond   
      +
    value.stone) || 0);
  });
} 
    const inputValues: any = {
      buy_back_policy: values.buy_back_policy,
      description: values.description,
      height: values.height,
      shape:values.shape,
  size:values.size,
  discount:values.discount,
  rate_per_unit:values.rate_per_unit,
  color:values.color,
  clarity:values.clarity,
  cut:values.cut,
  polish:values.polish,
  symmetry:values.symmetry,
  fluorescence:values.fluorescence,
  grading:values.grading,
  location:values.location,
      length: values.length,
      name: values.name,
      stylecode: values.stylecode,
      hsn: values.hsn,
      sku: values.sku,
      status: values.status,
      unit: values.unit || "0",
      makingCharges: values.makingCharges,
      zero_inventory_fill: values.zero_inventory_fill,
      width: values.width,
      quantity:
        values?.productTypeValue?.value === ProductType.Variable
          ? values?.quantity
          : calculateQuantity(values?.variation_options),
      product_type: values.productTypeValue?.value,
      type_id: type?.id,
      ...(initialValues
        ? { shop_id: initialValues?.shop_id }
        : { shop_id: Number(shopId) }),
      price: Number(values.price),
      sale_price: values.sale_price ? Number(values.sale_price) : null,
      categories: values?.categories?.map(({ id }: any) => id),
      tags: values?.tags?.map(({ id }: any) => id),
      image: {
        thumbnail: values?.image?.thumbnail,
        original: values?.image?.original,
        id: values?.image?.id,
      },
      image_link:values.image_link,
      video_link:values.video_link,
      is_featured_video:values.is_featured_video,
      certificate_link:values.certificate_link,
      cert_no:values.cert_no,
      video: {
        thumbnail: values?.video?.thumbnail,
        original: values?.video?.original,
        id: values?.video?.id,
      },
      gallery: values.gallery?.map(({ thumbnail, original, id }: any) => ({
        thumbnail,
        original,
        id,
      })),
      ...(productTypeValue?.value === ProductType.Variable && {
        variations: values?.variations?.flatMap(({ value }: any) =>
          value?.map(({ id }: any) => ({ attribute_value_id: id }))
        ),
      }),
      ...(productTypeValue?.value === ProductType.Variable
        ? {
            variation_options: {
              upsert: values?.variation_options?.map(
                ({ options, ...rest }: any) => ({
                  ...rest,
                  options: processOptions(options).map(
                    ({ name, value }: VariationOption) => ({
                      name,
                      value,
                    })
                  ),
                })
              ),
              delete: initialValues?.variation_options
                ?.map((initialVariationOption) => {
                  const find = values?.variation_options?.find(
                    (variationOption) =>
                      variationOption?.id === initialVariationOption?.id
                  );
                  if (!find) {
                    return initialVariationOption?.id;
                  }
                })
                .filter((item) => item !== undefined),
            },
          }
        : {
            variations: [],
            variation_options: {
              upsert: [],
              delete: initialValues?.variation_options?.map(
                (variation) => variation?.id
              ),
            },
          }),
      ...(values.productTypeValue?.value === "simple"
        ? {
            max_price: Number(values.price),
            min_price: Number(values.price),
          }
        : calculateMaxMinPrice(values?.variation_options)),
    };
    
    if(typeOfProduct == "SOLITAIRES")
    { 
      inputValues.unit = "0";
      if(!inputValues.stylecode.includes("SH"))
      {
        inputValues.stylecode = "SH"+inputValues.shop_id+"-"+inputValues.stylecode;
      }
      inputValues.shape = inputValues.shape?.value || inputValues.shape;
      inputValues.color = inputValues.color?.value || inputValues.color;
      inputValues.clarity = inputValues.clarity?.value || inputValues.clarity;
      inputValues.cut = inputValues.cut?.value || inputValues.cut;
      inputValues.polish = inputValues.polish?.value || inputValues.polish;
      inputValues.symmetry = inputValues.symmetry?.value || inputValues.symmetry;
      inputValues.fluorescence = inputValues.fluorescence?.value || inputValues.fluorescence;
      inputValues.grading = inputValues.grading?.value || inputValues.grading;
      inputValues.location = inputValues.location?.value || inputValues.location; 
      inputValues.rate_per_unit_before_commission = Number(inputValues.rate_per_unit || 0);
      let derived_rpu = Number(inputValues.rate_per_unit || 0) / (1+(Number(inputValues.discount || 0)/100));
      let discountAfterCommission = 0;
      if(Number(shopData?.shop?.balance?.admin_commission_rate_solitaire || 0) > 0 )
      {
        inputValues.commission = shopData?.shop?.balance?.admin_commission_rate_solitaire;
        discountAfterCommission = inputValues.discount + shopData?.shop?.balance?.admin_commission_rate_solitaire;
        inputValues.rate_per_unit = derived_rpu - (derived_rpu - (derived_rpu*(1+(discountAfterCommission/100))));
        inputValues.discount = discountAfterCommission;
      }
      else
      {
        inputValues.commission = 0;
        inputValues.discountAfterCommission = inputValues.discount;
        inputValues.rate_per_unit = derived_rpu - (derived_rpu - (derived_rpu*(1+(discountAfterCommission/100))));
        inputValues.discount = discountAfterCommission;
      }
      inputValues.price = (Number(inputValues.rate_per_unit || 0)*Number(inputValues.size || 0));
      inputValues.sale_price = inputValues.price - 1; 
    }
    if (initialValues) {
      // code to find difference between initial value and updated values
      let categoryMatch = true;
      let galleryMatch = true;
      let tagMatch = true;
      let variationMatch = true;
      let variationOptionMatch = true;
      for(let i=0; i<inputValues.categories.length; i++){
        if(inValue?.categories[i]?.id != inputValues?.categories[i])
        {
          categoryMatch = false;
        }
      }
      for(let i=0; i<inputValues?.gallery?.length; i++){
        if(inValue?.gallery[i]?.original != inputValues?.gallery[i]?.original)
        {
          galleryMatch = false;
        }
      }
      for(let i=0; i<inputValues.tags.length; i++){
        if(inValue?.tags[i]?.id != inputValues?.tags[i])
        {
          tagMatch = false;
        }
      }
      for(let i=0; i<inputValues.variations.length; i++){
        if(inValue?.variations[i]?.id != inputValues?.variations[i]?.attribute_value_id)
        {
          variationMatch = false;
        }
      }
      for(let i=0; i<inputValues.variation_options.length; i++){
        if(
          inValue?.variation_options[i]?.id != inputValues?.variation_options?.upserts[i]?.id
          ||
          inValue?.variation_options[i]?.goldWeight != inputValues?.variation_options?.upserts[i]?.goldWeight
          ||
          inValue?.variation_options[i]?.diamondWeight != inputValues?.variation_options?.upserts[i]?.diamondWeight
          ||
          inValue?.variation_options[i]?.diamondWeight1 != inputValues?.variation_options?.upserts[i]?.diamondWeight1
          ||
          inValue?.variation_options[i]?.diamondWeight2 != inputValues?.variation_options?.upserts[i]?.diamondWeight2
          ||
          inValue?.variation_options[i]?.diamondWeight3 != inputValues?.variation_options?.upserts[i]?.diamondWeight3
          ||
          inValue?.variation_options[i]?.diamondWeight4 != inputValues?.variation_options?.upserts[i]?.diamondWeight4
          ||
          inValue?.variation_options[i]?.diamondPrice != inputValues?.variation_options?.upserts[i]?.diamondPrice
          ||
          inValue?.variation_options[i]?.diamondPrice1 != inputValues?.variation_options?.upserts[i]?.diamondPrice1
          ||
          inValue?.variation_options[i]?.diamondPrice2 != inputValues?.variation_options?.upserts[i]?.diamondPrice2
          ||
          inValue?.variation_options[i]?.diamondPrice3 != inputValues?.variation_options?.upserts[i]?.diamondPrice3
          ||
          inValue?.variation_options[i]?.diamondPrice4 != inputValues?.variation_options?.upserts[i]?.diamondPrice4
          ||
          inValue?.variation_options[i]?.wastage != inputValues?.variation_options?.upserts[i]?.wastage
          ||
          inValue?.variation_options[i]?.sku != inputValues?.variation_options?.upserts[i]?.sku
          )
        {
          variationOptionMatch = false;
        }
      }
      if
      (
      (
      (
        inValue?.buy_back_policy?.buy_back_description != inputValues?.buy_back_policy?.buy_back_description
        ||
        inValue?.buy_back_policy?.buy_back_value != inputValues?.buy_back_policy?.buy_back_value
        ||
        inValue?.categories?.length != inputValues?.categories?.length
        ||
        !categoryMatch
        ||
        inValue?.description != inputValues?.description
        ||
        inValue?.gallery?.length != inputValues?.gallery?.length
        ||
        !galleryMatch
        ||
        inValue?.hsn != inputValues?.hsn
        ||
        inValue?.makingCharges != inputValues?.makingCharges
          ||
          inValue?.name != inputValues?.name
          ||
          inValue?.stylecode != inputValues?.stylecode
          ||
          !tagMatch
          ||
          inValue?.type?.id != inputValues?.type_id
          ||
          inValue?.zero_inventory_fill != inputValues?.zero_inventory_fill
          ||
          inValue?.price != inputValues?.price
          ||
          inValue?.sale_price != inputValues?.sale_price
          ||
          inValue?.sku != inputValues?.sku
        ||
        inValue?.width != inputValues?.width
        ||
        inValue?.height != inputValues?.height
        ||
        inValue?.length != inputValues?.length
        ||
        inValue?.image?.original != inputValues?.image?.original
        ||
        inValue?.video?.original != inputValues?.video?.original
        ||
        inValue?.is_featured_video != inputValues?.is_featured_video
        ||
        inValue?.image_link != inputValues?.image_link
        ||
        inValue?.video_link != inputValues?.video_link
        ||
        inValue?.certificate_link != inputValues?.certificate_link
        ||
        inValue?.cert_no != inputValues?.cert_no
        ||
        inValue?.shape != inputValues?.shape
        ||
        inValue?.size != inputValues?.size
        ||
        inValue?.color != inputValues?.color
        ||
        inValue?.clarity != inputValues?.clarity
        ||
        inValue?.cut != inputValues?.cut
        ||
        inValue?.polish != inputValues?.polish
        ||
        inValue?.symmetry != inputValues?.symmetry
        ||
        inValue?.fluorescence != inputValues?.fluorescence
        ||
        inValue?.grading != inputValues?.grading
        ||
        inValue?.location != inputValues?.location
        ||
        inValue?.discount != inputValues?.discount
        ||
        inValue?.rate_per_unit != inputValues?.rate_per_unit 
        ||  
        inValue?.makingCharges != inputValues?.makingCharges
        ||
        inValue?.name != inputValues?.name
        ||
        inValue?.stylecode != inputValues?.stylecode
        ||
        !tagMatch
        ||
        inValue?.type?.id != inputValues?.type_id
        ||
        inValue?.zero_inventory_fill != inputValues?.zero_inventory_fill
        ||
        inValue?.variations?.length != inputValues?.variations?.length
        ||
        !variationMatch
        ||
        inValue?.variation_options?.length != inputValues?.variation_options?.upsert?.length
        ||
        !variationOptionMatch
      )
      &&
      inValue?.product_type == ProductType.Variable
      &&
      me?.email != "zweler.web@gmail.com"
      )
      ||
      (
        (
          inValue?.buy_back_policy?.buy_back_description != inputValues?.buy_back_policy?.buy_back_description
          ||
          inValue?.buy_back_policy?.buy_back_value != inputValues?.buy_back_policy?.buy_back_value
          ||
          inValue?.categories?.length != inputValues?.categories?.length
          ||
          !categoryMatch
          ||
          inValue?.description != inputValues?.description
          ||
          inValue?.gallery?.length != inputValues?.gallery?.length
          ||
          !galleryMatch
          ||
          inValue?.hsn != inputValues?.hsn
          ||
          inValue?.image?.original != inputValues?.image?.original
          ||
          inValue?.video?.original != inputValues?.video?.original
          ||
          inValue?.is_featured_video != inputValues?.is_featured_video
          ||
          inValue?.image_link != inputValues?.image_link
          ||
          inValue?.video_link != inputValues?.video_link
          ||
          inValue?.certificate_link != inputValues?.certificate_link
          ||
          inValue?.cert_no != inputValues?.cert_no
          ||
          inValue?.makingCharges != inputValues?.makingCharges
          ||
          inValue?.name != inputValues?.name
          ||
          inValue?.stylecode != inputValues?.stylecode
          ||
          !tagMatch
          ||
          inValue?.type?.id != inputValues?.type_id
          ||
          inValue?.zero_inventory_fill != inputValues?.zero_inventory_fill
          ||
          inValue?.price != inputValues?.price
          ||
          inValue?.sale_price != inputValues?.sale_price
          ||
          inValue?.sku != inputValues?.sku
          ||
          inValue?.width != inputValues?.width
          ||
          inValue?.height != inputValues?.height
          ||
          inValue?.length != inputValues?.length
          ||
          inValue?.shape != inputValues?.shape
          ||
          inValue?.size != inputValues?.size
          ||
          inValue?.color != inputValues?.color
          ||
          inValue?.clarity != inputValues?.clarity
          ||
          inValue?.cut != inputValues?.cut
          ||
          inValue?.polish != inputValues?.polish
          ||
          inValue?.symmetry != inputValues?.symmetry
          ||
          inValue?.fluorescence != inputValues?.fluorescence
          ||
          inValue?.grading != inputValues?.grading
          ||
          inValue?.location != inputValues?.location
          ||
          inValue?.discount != inputValues?.discount
          ||
          inValue?.rate_per_unit != inputValues?.rate_per_unit    
        )
        &&
        inValue?.product_type == ProductType.Simple
        &&
        me?.email != "zweler.web@gmail.com"    
      )
      )
      {
        inputValues.status = ProductStatus.Draft
      }
      updateProduct(
        {
          variables: {
            id: initialValues.id,
            input: inputValues,
          },
        },
        {
          onError: (error: any) => {
            if (error?.response?.data?.message) {
              let errorMessage = error?.response?.data?.message;
              if(errorMessage.startsWith("SQLSTATE[23000]"))
              {
                errorMessage = "Product Style Code already exists";
              }
              setErrorMessage(errorMessage);
              animateScroll.scrollToTop();
            } else {
            Object.keys(error?.response?.data).forEach((field: any) => {
              setError(field, {
                type: "manual",
                message: error?.response?.data[field][0],
              });
            });
          }
        },
        onSuccess: ()=>{
    setTimeout(()=>{
      router.back();
    },1)
        }
      }
      );
    } else {
      createProduct(
        {
          ...inputValues,
        },
        {
          onError: (error: any) => {
            if (error?.response?.data?.message) {
              let errorMessage = error?.response?.data?.message;
              if(errorMessage.startsWith("SQLSTATE[23000]"))
              {
                errorMessage = "Product Code already exists";
              }
              setErrorMessage(errorMessage);
              animateScroll.scrollToTop();
            } else {
              Object.keys(error?.response?.data).forEach((field: any) => {
                setError(field, {
                  type: "manual",
                  message: error?.response?.data[field][0],
                });
              });
            }
          },
          onSuccess: ()=>{
            setTimeout(()=>{
              router.back();
            },1)
                }
        }
      );
    }
  };
  const productTypeValue = watch("productTypeValue");
  return (
    <>
      {errorMessage ? (
        <Alert
          message={t(`common:${errorMessage}`)}
          variant="error"
          closeable={true}
          className="mt-5"
          onClose={() => setErrorMessage(null)}
        />
      ) : null}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          { typeOfProduct != "SOLITAIRES" ?
          <div>
          <div className="flex flex-wrap pb-8 border-b border-dashed border-border-base my-5 sm:my-8">
            <Description
              title={t("form:featured-image-title")}
              details={t("form:featured-image-help-text") + " (600KB max)"}
              className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <FileInput name="image" control={control} multiple={false} />
            </Card>
          </div>

          <div className="flex flex-wrap pb-8 border-b border-dashed border-border-base my-5 sm:my-8">
            <Description
              title={"Video"}
              details={"Upload your product featured video here" + " (5MB max)"}
              className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <FileInput name="video" control={control} multiple={false} />
              <div className="my-5">
              <label htmlFor="terms-and-conditions">
					<input					
					{...register("is_featured_video")}
					type="checkbox"
					name="Is Featured Video"
					id="is-featured-video"
					className="form-checkbox text-accent h-4 w-4"
					/>
					<span className="ml-2 text-sm">Is Featured Video</span>
				</label>
        </div>
            </Card>
          </div>
 
          <div className="flex flex-wrap pb-8 border-b border-dashed border-border-base my-5 sm:my-8">
            <Description
              title={t("form:gallery-title")}
              details={t("form:gallery-help-text") + " (600KB max)"}
              className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <FileInput name="gallery" control={control} />
            </Card>
          </div>
          </div>
         :<div></div>
        }
          <div className="flex flex-wrap pb-8 border-b border-dashed border-border-base my-5 sm:my-8">
            <Description
              title={t("form:type-and-category")}
              details={t("form:type-and-category-help-text")}
              className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <ProductGroupInput
                control={control}
                error={t((errors?.type as any)?.message)}
                setProductType={setProductType}
                lengthVariationOption={lengthVariationOption}
              />
              <ProductCategoryInput control={control} setValue={setValue} />
              <ProductTagInput control={control} setValue={setValue} />
            </Card>
          </div>

          <div className="flex flex-wrap my-5 sm:my-8">
            <Description
              title={t("form:item-description")}
              details={`${
                initialValues
                  ? t("form:item-description-edit")
                  : t("form:item-description-add")
              } ${t("form:product-description-help-text")}`}
              className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <Input
                label={`${"Product Name"}*`}
                {...register("name")}
                onBlur={(e:any) => {
                  setProductName(e.target.value);
                }
                }
                error={t(errors.name?.message!)}
                variant="outline"
                className="mb-5"
              />
               <Input
                label={`${"Product Style Code"}*`}
                {...register("stylecode")}
                onBlur={(e:any) => {
                  setProductStyleCode(e.target.value);
                }
                }
                error={t(errors.stylecode?.message!)}
                variant="outline"
                className="mb-5"
              />

<Input
                label={`${"HSN"}`}
                {...register("hsn")}
                error={t(errors.hsn?.message!)}
                variant="outline"
                className="mb-5"
              />
<Input
                {...register("unit")}
type={"hidden"}
value={"1 pc"}
/>
  
{ typeOfProduct != "SOLITAIRES" ?
<div>
            <Input
            label={`${t("form:input-label-quantity")}*`}
            {...register("quantity")}
            error={t(errors.quantity?.message!)}
            variant="outline"
            className="mb-5"
          />

<Input
                label={`Making Charges / Gram`}
                {...register("makingCharges")}
                error={t(errors.makingCharges?.message!)}
                onBlur={(e:any) => 
                  setMakingCharges(e.target.value)
                }
                variant="outline"
                className="mb-5"
              />
              </div>
              :<span></span>
}
              <Input
                label={`Ready to ship / Number of days in case of zero inventory`}
                {...register("zero_inventory_fill")}
                defaultValue={1}
                error={t(errors.zero_inventory_fill?.message!)}
                variant="outline"
                className="mb-5"
              />

              <TextArea
                label={t("form:input-label-description")}
                {...register("description")}
                error={t(errors.description?.message!)}
                variant="outline"
                className="mb-5"
              />
              
            </Card>
          </div>

          <div className="flex flex-wrap pb-8 border-b border-dashed border-border-base my-5 sm:my-8">
            <Description
              title={t("form:form-title-product-type")}
              details={t("form:form-description-product-type")}
              className="w-full px-0 sm:pr-4 md:pr-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
            />
            <ProductTypeInput 
              typeOfProductProp={typeOfProduct}
            />
            <span></span>
            </div>

          {/* Simple Type */}
          {productTypeValue?.value === ProductType.Simple && (
            <ProductSimpleForm 
              initialValues={initialValues}
              typeOfProductProp={typeOfProduct}
            />
          )}

          {/* Variation Type */}
          {productTypeValue?.value === ProductType.Variable && (
            <ProductVariableForm
              shopId={shopId}
              initialValues={initialValues}
              productNameProp={productName}
              productStyleCode={productStyleCode}
              typeOfProductProp={typeOfProduct}
              productMakingCharges={productMakingCharges}
              setLengthVariationOption={setLengthVariationOption}
            />
          )}
                      <div className="flex flex-wrap pb-8 border-b border-dashed border-border-base my-5 sm:my-8">
              <Description
                title={"Buy Back Policy"}
                details={"Add buy back policy of your product is here"}
                className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
              />
              <Card className="w-full sm:w-8/12 md:w-2/3">
                <TextArea
                  label={"Buy Back Description"}
                  {...register("buy_back_policy.buy_back_description")}
                  variant="outline"
                  className="mb-5"
                  error={t(errors.buy_back_policy?.buy_back_description?.message!)}
                />
                <Input
                  label={"Buy Back %"}
                  {...register("buy_back_policy.buy_back_value")}
                  variant="outline"
                  className="mb-5"
                  error={t(errors.buy_back_policy?.buy_back_value?.message!)}
                />
              </Card>
            </div>
{
    initialValues?.status != 'publish' ?
          <div className="flex flex-wrap my-5 sm:my-8">
          <Description
              title={""}
              details={""}
              className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
            />
            <Card className="w-full sm:w-8/12 md:w-2/3">

              <div>
                <Label>{t("form:input-label-status")}</Label>
                <Radio
                  {...register("status")}
                  label={"Send For Approval"}
                  id="draft"
                  value="draft"
                  className="mb-2"
                />
                { 
                me?.email == "zweler.web@gmail.com" ?
                <Radio
                  {...register("status")}
                  id="published"
                  label={t("form:input-label-published")}
                  value="publish"
                /> : ""}
              </div> 
</Card>
</div>: ""
}
          <div className="mb-4 text-end">
            {initialValues && (
              <Button
                variant="outline"
                onClick={router.back}
                className="me-4"
                type="button"
              >
                {t("form:button-label-back")}
              </Button>
            )}
            <Button loading={updating || creating}>
              {initialValues
                ? t("form:button-label-update-product")
                : t("form:button-label-add-product")}
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
}
