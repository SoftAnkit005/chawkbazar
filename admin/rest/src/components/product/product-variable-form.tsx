import Card from "@components/common/card";
import Button from "@components/ui/button";
import Description from "@components/ui/description";
import Input from "@components/ui/input";
import Label from "@components/ui/label";
import { useModalAction } from "@components/ui/modal/modal.context";
import SelectInput from "@components/ui/select-input";
import Title from "@components/ui/title";
import { useAttributesQuery } from "@data/attributes/use-attributes.query";
import { useShopQuery } from "@data/shop/use-shop.query";
import { Product } from "@ts-types/generated";
import { cartesian } from "@utils/cartesian";
import { uniq } from "lodash";
import isEmpty from "lodash/isEmpty";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import useWindowSize from "react-use/lib/useWindowSize";

type IProps = {
  initialValues?: Product | null;
  shopId: string | undefined;
  productNameProp: string | null;
  productStyleCode: string | null;
  typeOfProductProp: string | null;
  productMakingCharges: number | null;
  setLengthVariationOption:any;
};

function getCartesianProduct(values: any, shopData:any) {
  const formattedValues = values
    ?.map((v: any) =>
      v.value?.map((a: any) => {
        let rate = Number(v.attribute.values?.find((x:any)=>x.value == a.value && x.vendor_type === (shopData?.shop?.customer_type || 1))?.rate) || 0;
        return {
        name: v.attribute.name,
        value: a.value,
        rate,
      }
       }))
    .filter((i: any) => i !== undefined);
  if (isEmpty(formattedValues)) return [];
  return cartesian(...formattedValues);
}

let counterMulti = 0;
let alreadyExistsVariations = [];

export default function ProductVariableForm({ initialValues, productNameProp,
  setLengthVariationOption,
  productStyleCode,
  typeOfProductProp,
  productMakingCharges }: IProps) {
  const [multiArrState, setMultiArrState] = useState([]);
 
let typeOfProduct = typeOfProductProp || "";
  const [stoneAttributeValueLength, setStoneAttributeValueLength] = useState(1);
  const router = useRouter();
  let {
    query: { shop },
  } = router;
  shop = shop ? shop : initialValues?.shop?.slug
  const { data: shopData } = useShopQuery(shop as string, { enabled: !!shop });
  localStorage.setItem("shopData",JSON.stringify(shopData));
  const { t } = useTranslation();
  const { data, isLoading } = useAttributesQuery({});
  const {
    register,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();
  counterMulti = Number(localStorage.getItem("counterMulti") || "0");
  if(!counterMulti)
  {
localStorage.setItem("multiDiamondArr",JSON.stringify([]));
localStorage.setItem("old_variation_options",JSON.stringify(getValues("variation_options")));
localStorage.setItem("oldVariation",JSON.stringify(getValues("variations")));
let variation_options = getValues("variation_options");
variation_options.forEach((x:any)=>{
    for(let i=0;i<x.options?.length; i++)
    {
      if(x.options[i].name == "Gold")
      {
        alreadyExistsVariations.push(x.options[i]?.value);
        localStorage.setItem('"'+x.options[i]?.value+'"',x.goldWeight.toString());
      }
      if(x.options[i].name == "Diamond")
      {
        alreadyExistsVariations.push(x.options[i]?.value);
        localStorage.setItem('"'+x.options[i]?.value.split(" ").join("")+'"',x.diamondWeight.toString());
      }
    }
});
localStorage.setItem("counterMulti","1");
counterMulti++;  
}
const oldVariation = JSON.parse(localStorage.getItem("oldVariation") || "[]");
const variationsNew = getValues("variations");
if(oldVariation.length < variationsNew.length)
{
  let oldvariationoptions = JSON.parse(localStorage.getItem("old_variation_options") || "[]");
  let variationoptions = getValues("variation_options");
  oldvariationoptions.map((x:any)=>{
    let founded = variationoptions.filter((y:any)=>y.title?.includes(x.title));
    if(founded.length)
    {
        founded = founded.map((found:any)=>{
        found.diamond = x.diamond || 0;
                            found.diamondPrice = x.diamondPrice || 0;
                            found.diamondPrice1 = x.diamondPrice1 || 0;
                            found.diamondPrice2 = x.diamondPrice2 || 0;
                            found.diamondPrice3 = x.diamondPrice3 || 0;
                            found.diamondPrice4 = x.diamondPrice4 || 0;
                            found.diamondPricePerCt = x.diamondPricePerCt || 0;
                            found.diamondPurity = x.diamondPurity || 0;
                            found.diamondQty = x.diamondQty || 0;
                            found.diamondValue1 = x.diamondValue1 || 0;
                            found.diamondValue2 = x.diamondValue2 || 0;
                            found.diamondValue3 = x.diamondValue3 || 0;
                            found.diamondValue4 = x.diamondValue4 || 0;
                            found.diamondWeight = x.diamondWeight || 0;
                            found.diamondWeight1 = x.diamondWeight1 || 0;
                            found.diamondWeight2 = x.diamondWeight2 || 0;
                            found.diamondWeight3 = x.diamondWeight3 || 0;
                            found.diamondWeight4 = x.diamondWeight4 || 0;
                            found.diamondWeightInG1 = x.diamondWeightInG1 || 0;
                            found.diamondWeightInG2 = x.diamondWeightInG2 || 0;
                            found.diamondWeightInG3 = x.diamondWeightInG3 || 0;
                            found.diamondWeightInG4 = x.diamondWeightInG4 || 0;
                            found.goldPrice = x.goldPrice || 0;
                            found.goldWeight = x.goldWeight || 0;
                            found.is_disable = x.is_disable || 0;
                            found.makingCharges = x.makingCharges || 0;
                            found.metal = x.metal || 0;
                            found.netWeight = x.netWeight || 0;
                            found.options = x.options || 0;
                            found.polkiPrice = x.polkiPrice || 0;
                            found.polkiQty = x.polkiQty || 0;
                            found.polkiWeight = x.polkiWeight || 0;
                            found.price = x.price || 0;
                            found.pureWeight = x.pureWeight || 0;
                            found.quantity = x.quantity || 0;
                            found.sale_price = x.sale_price || 0;
                            found.silverPrice = x.silverPrice || 0;
                            found.silverWeight = x.silverWeight || 0;
                            found.stone = x.stone || 0;
                            found.stonePrice = x.stonePrice || 0;
                            found.stoneWeight = x.stoneWeight || 0;
                            found.stoneWeightInG = x.stoneWeightInG || 0;
                            found.wastage = x.wastage || 0;
                            found.wastagePrice = x.wastagePrice || 0;
                            return found;
                          });
                          setValue(`variation_options`,variationoptions);
    }
  });
}
  const { fields, append, remove } = useFieldArray({
    shouldUnregister: true,
    control,
    name: "variations",
  });
  function getHidden(index:number,value:number){
    return JSON.parse(JSON.stringify(multiArrState)).filter((x:any)=> (x.split(" ").length > 1 ? x.split(" ")[1] : x) == variation_options[index]?.title?.split("/")[0])?.length <= value-1;
  }
  function onBlurAttr(index:any){
  const variation_options = getValues("variation_options");
    for(let i = 0; i <variations.find((y:any)=>y.attribute?.name == "Diamond")?.value?.length; i ++)
    {
    let selectedAttributeValue = JSON.stringify(variations.find((y:any)=>y.attribute?.name == "Diamond")?.value[i]?.value)
    if(variation_options[index]?.options?.includes(selectedAttributeValue))
    {
      let enteredCt = localStorage.getItem(selectedAttributeValue?.replaceAll(" ",""));
      setValue(`variation_options.${index}.diamondWeight`,enteredCt || 0);  
    }
  }
  for(let i = 0; i <variations.find((y:any)=>y.attribute?.name == "Precious Stones")?.value?.length; i ++)
  {
  let selectedAttributeValue = JSON.stringify(variations.find((y:any)=>y.attribute?.name == "Precious Stones")?.value[i]?.value)
  if(variation_options[index]?.options?.includes(selectedAttributeValue))
  {
    let enteredCt = localStorage.getItem(selectedAttributeValue?.replaceAll(" ",""));
    if(["DIAMOND JEWELLERY","SOLITAIRES","POLKI JEWELLERY","LABGROWN SOLITAIRES"].includes(typeOfProduct))
    {
      setValue(`variation_options.${index}.stoneWeight`,enteredCt || 0);  
    }
    else{
      setValue(`variation_options.${index}.diamondWeight`,enteredCt || 0);  
    }
  }
}
  for(let i = 0; i <variations.find((y:any)=>["Gold","Silver","Platinum"].includes(y.attribute.name))?.value?.length; i ++)
    {
    let selectedAttributeValue = JSON.stringify(variations.find((y:any)=>["Gold","Silver","Platinum"]?.includes(y.attribute?.name))?.value[i]?.value)
    if(variation_options[index]?.options?.includes(selectedAttributeValue))
    {
      let enteredGrm = localStorage.getItem(selectedAttributeValue?.replaceAll(" ",""));
      setValue(`variation_options.${index}.goldWeight`,enteredGrm || 0);  
    }
  }
  
  }
  const cartesianProduct = getCartesianProduct(getValues("variations"), shopData);
  const variations = watch("variations");
  const variation_options = getValues("variation_options");
  let attributes = data?.attributes;
  let goldAttribute = attributes?.find((x:any)=>x.name?.toUpperCase() == "GOLD");
  let pureGoldRate = (Number(goldAttribute?.values.find(x=>x.value.includes('24') && x.vendor_type === shopData?.shop?.customer_type)?.rate) || 0);
  //const { data: meData } = useMeQuery();
	const { width:deviceWidth } = useWindowSize();

  function getAttrbiuteOptions(index:number){
    setLengthVariationOption(attributes?.length || 0);
    let typeOfProduct = typeOfProductProp || "";
    if(index == 0 && !["SEMI PRECIOUS BEADS","GEMSTONES"].includes(typeOfProduct.toUpperCase()))
    {
      return [];
    }
    if(index == 0 && ["SEMI PRECIOUS BEADS"].includes(typeOfProduct.toUpperCase()))
    {
      return attributes?.filter((x:any) => !["Gold","Platinum","Silver","Diamond","Polki","Precious Stones","SOLITAIRE","Lab Grown Diamond"].includes(x.name));
    }
    if(index == 1 && ["DIAMOND JEWELLERY","POLKI JEWELLERY","SOLITAIRES","LABGROWN SOLITAIRES"].includes(typeOfProduct.toUpperCase()))
    {
      return attributes?.filter((x:any) => ["Gold","Platinum"].includes(x.name));
    }
    if(index == 1 && ["LOOSE DIAMOND","LABGROWN LOOSE DIAMOND","LABGROWN SOLITAIRES","GENSTONES"].includes(typeOfProduct.toUpperCase()))
    {
      return attributes?.filter((x:any) => !["Gold","Platinum","Silver","Diamond","Polki","SOLITAIRE","Lab Grown Diamond","Precious Stones"].includes(x.name));
    }
    if((index == 1 && !["GOLD JEWELLERY","SILVER JEWELLERY","DIAMOND JEWELLERY","POLKI JEWELLERY","SOLITAIRES","PLATINUM JEWELLERY","LABGROWN SOLITAIRES"].includes(typeOfProduct.toUpperCase())) 
    || (index == 1 && ["GOLD JEWELLERY","SILVER JEWELLERY","PLATINUM JEWELLERY"].includes(typeOfProduct.toUpperCase()))
    )
    {
      return attributes?.filter((x:any) => !["Gold","Platinum","Silver","Diamond","Polki","SOLITAIRE","Lab Grown Diamond"].includes(x.name));
    }
    if(index == 2)
    {
      return attributes?.filter((x:any) => !["Gold","Platinum","Silver","Diamond","Polki","SOLITAIRE","Lab Grown Diamond"].includes(x.name) && !variations?.map((y:any)=>y.attribute?.name).includes(x.name));
    }
    if(index == 3)
    {
      return attributes?.filter((x:any) => !["Gold","Platinum","Silver","Diamond","Polki","SOLITAIRE","Lab Grown Diamond"].includes(x.name) && !variations?.map((y:any)=>y.attribute?.name).includes(x.name));
    }
    if(index == 4)
    {
      return attributes?.filter((x:any) => !["Gold","Platinum","Silver","Diamond","Polki","SOLITAIRE","Lab Grown Diamond"].includes(x.name) && !variations?.map((y:any)=>y.attribute?.name).includes(x.name));
    }
    return attributes;
  }

  function autofill(event:any){
    event.preventDefault();
    let variation_options = getValues("variation_options");
    variation_options.forEach((value: any) => {
      value.diamondWeight = variation_options[0].diamondWeight;
      value.diamondWeight1 = variation_options[0].diamondWeight1;
      value.diamondWeight2 = variation_options[0].diamondWeight2;
      value.diamondWeight3 = variation_options[0].diamondWeight3;
      value.diamondWeight4 = variation_options[0].diamondWeight4;
      value.stoneWeight = variation_options[0].stoneWeight;
      value.stonePrice = variation_options[0].stonePrice;
      value.goldWeight = variation_options[0].goldWeight;
      value.wastage = variation_options[0].wastage;
    });
    setValue("variation_options", variation_options);
    calculatePrice();
  }

  function calculatePrice() {
    let variation_options = getValues("variation_options");
    variation_options.forEach((value: any) => {
      value.diamondWeightInG = Number(Number(Number(value.diamondWeight) || 0)/5) || 0;
      value.diamondWeightInG1 = Number(Number(Number(value.diamondWeight1) || 0)/5) || 0;
      value.diamondWeightInG2 = Number(Number(Number(value.diamondWeight2) || 0)/5) || 0;
      value.diamondWeightInG3 = Number(Number(Number(value.diamondWeight3) || 0)/5) || 0;
      value.diamondWeightInG4 = Number(Number(Number(value.diamondWeight4) || 0)/5) || 0;
      value.stoneWeightInG = Number(Number(Number(value.stoneWeight) || 0)/5) || 0;
      value.netWeight = (Number(value.goldWeight) || 0)- Number(value.diamondWeightInG || 0)- Number(value.diamondWeightInG1 || 0)- Number(value.diamondWeightInG2 || 0)- Number(value.diamondWeightInG3 || 0) - Number(value.diamondWeightInG4 || 0) - Number(value.stoneWeightInG || 0) || 0;
      value.netWeight = value.netWeight < 0 ? 0 : Number(value.netWeight).toFixed(3);
      value.percent = value.title?.includes("22KT") ? 0.92 : (value.title?.includes("18KT") ? 0.76 : ( value.title?.includes("92.5") ? 0.925 : 0.595));
      value.percent = value.title?.includes("24KT") ? 1 : value.percent;
      value.percent = value.title?.includes("99.9") ? 1 : value.percent;
      let percent2 = value.title?.includes("22KT") ? 8.696 : (value.title?.includes("18KT") ? 33.34 : 70.95);
      percent2 = value.title?.includes("24KT") ? 0 : percent2;
      percent2 = value.title?.includes("99.9") ? 0 : percent2;
      percent2 = value.title?.includes("92.5") ? 8.1125 : percent2;
      value.pureWeight = Number(Number(value.netWeight || 0) * Number(Number(Number(value.wastage || 0)/100) + Number(value.percent || 0) || 0) || 0).toFixed(3);
      value.makingCharges = Number(Number(Number(productMakingCharges || 0) 
      + (shopData?.shop?.markup_type == "p" ? Number(Number(productMakingCharges || 0)*Number(Number(shopData?.shop?.making_charges_markup)/100)) : (Number(shopData?.shop?.making_charges_markup || 0))))
      * Number(value.netWeight) || 0);
      value.metal = Number(Number(value.goldPrice || 0) * Number(value.netWeight || 0));
      value.wastagePrice = (Number((pureGoldRate ? pureGoldRate 
        : Number(Number(value.goldPrice* percent2)/100)) * 
        (Number(Number(value.netWeight)*Number(Number(value.wastage)/100)) + (Number(value.wastage) ? (shopData?.shop?.markup_type == "p" ? Number(Number
          (Number(value.netWeight)
          )
        *Number(Number(shopData?.shop.wastage_markup || 0)/100)) : Number(shopData?.shop.wastage_markup || 0) ) : 0))) || 0);
      if(["DIAMOND JEWELLERY","POLKI JEWELLERY","LOOSE DIAMOND","LABGROWN LOOSE DIAMOND","SOLITAIRES","LABGROWN SOLITAIRES"].includes(typeOfProductProp?.toString().toUpperCase() || ""))
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
    setValue("variation_options", variation_options);
  }
  const { closeModal, openModal } = useModalAction();
  let multiDiamondArr:any = localStorage.getItem("multiDiamondArr") || [];
  multiDiamondArr = JSON.parse(multiDiamondArr || "[]");
  function changedVariation(index:any){
    let variation_options = getValues("variation_options");
    let obj:any = {};
    let getCount = localStorage.getItem(variations[index]?.attribute?.name);
    obj[variations[index]?.attribute?.name] = variations[index]?.value?.map(x=>x.value);
    let selectedAttributeValue = JSON.stringify(variations[index]?.value?.[variations[index]?.value?.length-1]?.value)
    localStorage.setItem(variations[index]?.attribute?.name,variations[index]?.value?.length);
    if(["Diamond","Precious Stones","Gold","Silver","Platinum","SOLITAIRE"].includes(variations[index]?.attribute?.name) && (Number(getCount || 0) < Number(variations[index]?.value?.length || 0)))
    {
      closeModal();
      for(let i=0; i<variation_options.length; i++) 
      {
        calculateAndBlur(i);
      }
      let variationsNewTemp = [];
      for(let i=0; i< variations.length; i++)
      {
        if(["Diamond","Precious Stones","Gold","Silver","Platinum","SOLITAIRE"].includes(variations[i].attribute.name))
        {
          for(let j=0; j< variations[i].value.length; j++)
          {
            variationsNewTemp.push(variations[i].value[j].value);
          }
        }
      }
      if(uniq(alreadyExistsVariations).length < uniq(variationsNewTemp).length)
      {
          localStorage.setItem("selectedAttributeName",variations[index]?.attribute?.name);
          localStorage.setItem("selectedAttributeValue",selectedAttributeValue);
          localStorage.setItem("selectedAttributeValueMain",selectedAttributeValue);
          openModal("ENTER_CT");
      }
      // if(!initialValues)
      // {
        let refreshIntervalId = setInterval(()=>{
       if(localStorage.getItem("justClosed") == "1")
       {
      for(let i=0; i<variation_options.length; i++) 
      {
        calculateAndBlur(i);
      }
      for(let i=0; i<variation_options.length; i++) 
      {
        calculateAndBlur(i);
      }
      setValue("variation_options", variation_options);
      setMultiArrState(multiDiamondArr);
      localStorage.setItem("justClosed","0");
    }
      },1);
      localStorage.setItem("refreshIntervalId",String(refreshIntervalId));
   // }
    }

  }

  function calculateAndBlur(index:any){
    let variations = watch("variations");
    let variation_options = getValues("variation_options");
    if(!initialValues)
    {
      changedVariation(index);
      onBlurAttr(index);
      multiDiamondArr = localStorage.getItem("multiDiamondArr") || [];
      multiDiamondArr = JSON.parse(multiDiamondArr || "[]");
      for(let j=0; j<variation_options.length;j++)
      {
        for(let k=1; k<5; k++)
      {
        variation_options[j]["diamondValue"+k] = "";
        variation_options[j]["diamondWeight"+k] = 0;
        variation_options[j]["diamondPrice"+k] = 0;
      }
        let filteredMultiDiamondArr = multiDiamondArr.filter((z:any)=>z.includes(variation_options[j]?.title?.split("/")[0]))
        if(filteredMultiDiamondArr.length > 4)
        {
          return;
        }
      for(let i=0; i< filteredMultiDiamondArr.length; i++)
      {
          variation_options[j]["diamondValue"+Number(i+1).toString()] = filteredMultiDiamondArr[i];
          variation_options[j]["diamondWeight"+Number(i+1).toString()] = localStorage.getItem('"'+filteredMultiDiamondArr[i].replaceAll(" ","")+'"');
          variation_options[j]["diamondPrice"+Number(i+1).toString()] = attributes.find((x:any)=>x.name == "Diamond")?.values?.find((y:any)=>y.value == filteredMultiDiamondArr[i] && y.vendor_type == shopData?.shop?.customer_type)?.rate || 0;
          variation_options[j]["diamondPrice"+Number(i+1).toString()] = Number(variation_options[j]["diamondPrice"+Number(i+1).toString()]).toFixed(0);
        }
      }
    }
    else{
      let oldvariations = JSON.parse(localStorage.getItem("oldVariation") || "[]");
      let oldvariationoptions = JSON.parse(localStorage.getItem("old_variation_options") || "[]");
      if(oldvariations?.length < variations?.length || oldvariationoptions?.length < variation_options?.length)
      {
        changedVariation(index);
        onBlurAttr(index);
      multiDiamondArr = localStorage.getItem("multiDiamondArr") || [];
      multiDiamondArr = JSON.parse(multiDiamondArr || "[]");
      for(let j=0; j<variation_options.length;j++)
      {
        for(let k=1; k<5; k++)
      {
        variation_options[j]["diamondValue"+k] = "";
        variation_options[j]["diamondWeight"+k] = 0;
        variation_options[j]["diamondPrice"+k] = 0;
      }
        let filteredMultiDiamondArr = multiDiamondArr.filter((z:any)=>z.includes(variation_options[j]?.title?.split("/")[0]))
        if(filteredMultiDiamondArr.length > 4)
        {
          return;
        }
      for(let i=0; i< filteredMultiDiamondArr.length; i++)
      {
          variation_options[j]["diamondValue"+Number(i+1).toString()] = filteredMultiDiamondArr[i];
          variation_options[j]["diamondWeight"+Number(i+1).toString()] = localStorage.getItem('"'+filteredMultiDiamondArr[i].replaceAll(" ","")+'"');
          variation_options[j]["diamondPrice"+Number(i+1).toString()] = attributes.find((x:any)=>x.name == "Diamond")?.values?.find((y:any)=>y.value == filteredMultiDiamondArr[i] && y.vendor_type == shopData?.shop?.customer_type)?.rate || 0;
          variation_options[j]["diamondPrice"+Number(i+1).toString()] = Number(variation_options[j]["diamondPrice"+Number(i+1).toString()]).toFixed(0);
        }
      }
      }
    }
    setValue("variation_options", variation_options);
    calculatePrice();
  }


  return (
    <div className="flex flex-wrap my-5 sm:my-8">
      <Description
        title={t("form:form-title-variation-product-info")}
        details={`${
          initialValues
            ? t("form:item-description-update")
            : t("form:item-description-choose")
        } ${t("form:form-description-variation-product-info")}`}
        className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:py-8"
      />
      <Card className="w-full p-0 md:p-0">
        <div className="border-t border-dashed border-border-200 mb-5 md:mb-8">
          <Title className="text-lg uppercase text-center px-5 md:px-8 mb-0 mt-8">
            {t("form:form-title-options")}
          </Title>
          <div>
            {fields?.map((field: any, index: number) => {
              return (
                <div
                  key={field.id}
                  className="border-b border-dashed border-border-200 last:border-0 p-5 md:p-8"
                >
                  <div className="flex items-center justify-between">
                    <Title className="mb-0">
                      {t("form:form-title-options")} {index + 1}
                    </Title>
                    <button
                      onClick={ () =>
                        {
                        if((index != 0 && (index == 1 && !["DIAMOND JEWELLERY","POLKI JEWELLERY","GOLD JEWELLERY","PLATINUM JEWELLERY","SILVER JEWELLERY","SOLITAIRES"].includes(typeOfProductProp || ""))) || index >= 2)
                        { 
                          remove(index);
                          const variation_options = getValues("variation_options");
                          const old_variation_options = JSON.parse(localStorage.getItem("old_variation_options") || "[]");
                          for(let ii=0; ii < old_variation_options.length; ii++)
                          {
                            variation_options[ii].diamond = old_variation_options[ii]?.diamond || 0;
                            variation_options[ii].diamondPrice = old_variation_options[ii]?.diamondPrice || 0;
                            variation_options[ii].diamondPrice1 = old_variation_options[ii]?.diamondPrice1 || 0;
                            variation_options[ii].diamondPrice2 = old_variation_options[ii]?.diamondPrice2 || 0;
                            variation_options[ii].diamondPrice3 = old_variation_options[ii]?.diamondPrice3 || 0;
                            variation_options[ii].diamondPrice4 = old_variation_options[ii]?.diamondPrice4 || 0;
                            variation_options[ii].diamondPricePerCt = old_variation_options[ii]?.diamondPricePerCt || 0;
                            variation_options[ii].diamondPurity = old_variation_options[ii]?.diamondPurity || 0;
                            variation_options[ii].diamondQty = old_variation_options[ii]?.diamondQty || 0;
                            variation_options[ii].diamondValue1 = old_variation_options[ii]?.diamondValue1 || 0;
                            variation_options[ii].diamondValue2 = old_variation_options[ii]?.diamondValue2 || 0;
                            variation_options[ii].diamondValue3 = old_variation_options[ii]?.diamondValue3 || 0;
                            variation_options[ii].diamondValue4 = old_variation_options[ii]?.diamondValue4 || 0;
                            variation_options[ii].diamondWeight = old_variation_options[ii]?.diamondWeight || 0;
                            variation_options[ii].diamondWeight1 = old_variation_options[ii]?.diamondWeight1 || 0;
                            variation_options[ii].diamondWeight2 = old_variation_options[ii]?.diamondWeight2 || 0;
                            variation_options[ii].diamondWeight3 = old_variation_options[ii]?.diamondWeight3 || 0;
                            variation_options[ii].diamondWeight4 = old_variation_options[ii]?.diamondWeight4 || 0;
                            variation_options[ii].diamondWeightInG1 = old_variation_options[ii]?.diamondWeightInG1 || 0;
                            variation_options[ii].diamondWeightInG2 = old_variation_options[ii]?.diamondWeightInG2 || 0;
                            variation_options[ii].diamondWeightInG3 = old_variation_options[ii]?.diamondWeightInG3 || 0;
                            variation_options[ii].diamondWeightInG4 = old_variation_options[ii]?.diamondWeightInG4 || 0;
                            variation_options[ii].goldPrice = old_variation_options[ii]?.goldPrice || 0;
                            variation_options[ii].goldWeight = old_variation_options[ii]?.goldWeight || 0;
                            variation_options[ii].is_disable = old_variation_options[ii]?.is_disable || 0;
                            variation_options[ii].makingCharges = old_variation_options[ii]?.makingCharges || 0;
                            variation_options[ii].metal = old_variation_options[ii]?.metal || 0;
                            variation_options[ii].netWeight = old_variation_options[ii]?.netWeight || 0;
                            variation_options[ii].options = old_variation_options[ii]?.options || 0;
                            variation_options[ii].polkiPrice = old_variation_options[ii]?.polkiPrice || 0;
                            variation_options[ii].polkiQty = old_variation_options[ii]?.polkiQty || 0;
                            variation_options[ii].polkiWeight = old_variation_options[ii]?.polkiWeight || 0;
                            variation_options[ii].price = old_variation_options[ii]?.price || 0;
                            variation_options[ii].pureWeight = old_variation_options[ii]?.pureWeight || 0;
                            variation_options[ii].quantity = old_variation_options[ii]?.quantity || 0;
                            variation_options[ii].sale_price = old_variation_options[ii]?.sale_price || 0;
                            variation_options[ii].silverPrice = old_variation_options[ii]?.silverPrice || 0;
                            variation_options[ii].silverWeight = old_variation_options[ii]?.silverWeight || 0;
                            variation_options[ii].stone = old_variation_options[ii]?.stone || 0;
                            variation_options[ii].stonePrice = old_variation_options[ii]?.stonePrice || 0;
                            variation_options[ii].stoneWeight = old_variation_options[ii]?.stoneWeight || 0;
                            variation_options[ii].stoneWeightInG = old_variation_options[ii]?.stoneWeightInG || 0;
                            variation_options[ii].wastage = old_variation_options[ii]?.wastage || 0;
                            variation_options[ii].wastagePrice = old_variation_options[ii]?.wastagePrice || 0;
                          }
                          setValue("variation_options", variation_options);
                        }
                      }
                      }
                      type="button"
                      className="text-sm text-red-500 hover:text-red-700 transition-colors duration-200 focus:outline-none"
                    >
                      {t("form:button-label-remove")}
                    </button>
                  </div>

                  <div className="grid">
                    <div className="mt-5 col-span-2">
                      <Label>{t("form:input-label-attribute-name")}*</Label>
                      <SelectInput
                        name={`variations[${index}].attribute`}
                        control={control}
                        defaultValue={field.attribute}
                        getOptionLabel={(option: any) => {
                          return option.name}}
                        getOptionValue={(option: any) => option.id}
                        options={
                          getAttrbiuteOptions(index)
                        }
                        isLoading={isLoading}
                      />
                    </div>
                    <div className="mt-5 col-span-2">
                      <Label>{t("form:input-label-attribute-value")}*</Label>
                      <SelectInput
                        isMulti
                        name={`variations[${index}].value`}
                        control={control}
                        defaultValue={field.value}
                        onFocus={calculateAndBlur(index)}
                        onBlur={calculateAndBlur(index)}
                        getOptionLabel={(option: any) => 
                          {

                            if(variations?.find((y:any)=>y.attribute?.name == "Diamond")?.value?.length == 0)
  {
                            localStorage.setItem("multiDiamondArr",JSON.stringify([]));
  }
                            return option?.value;
                          }
                          }
                          onKeyUp={
                            calculateAndBlur(index)
                          }
                        getOptionValue={(option: any) => option.id}
                        options={
                            stoneAttributeValueLength > 1 ? [] : ["Diamond","SOLITAIRE","Lab Grown Diamond","Gold","Silver","Platinum"].includes(variations[index]?.attribute?.name || "") ? watch(`variations[${index}].attribute`)?.values?.filter((x:any)=>x.vendor_type === 1 && 
                            //Number(x.rate) > 0 && 
                            ( (typeOfProduct == "POLKI JEWELLERY") && (variations[index]?.attribute?.name == "Diamond") ? x.value?.includes("POLKI") : true) && ![field.value]?.includes(x.value) && !(variations?.find((y:any)=>y.attribute?.name == "Diamond")?.value.map((y:any)=>y.value?.split(" ")?.length > 1 ? y.value?.split(" ")[1] : y.value))?.includes(x.value?.split(" ")?.length > 1 ? x.value?.split(" ")[1] : x.value)) : watch(`variations[${index}].attribute`)?.values?.filter((x:any)=>x.vendor_type === 1)
                        }
                      />
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          <div className="px-5 md:px-8">
            <Button
              disabled={fields.length === attributes?.length || fields.length > 4}
              onClick={(e: any) => {
                let typeOfProduct = typeOfProductProp || "";
                let productCode = productStyleCode || "";              
                let productName = productNameProp || "";              
                e.preventDefault();
                if(!typeOfProduct)
                {
                  alert("Type Of Product is required");
                  return;
                }
                else if(!productName && fields.length == 0)
                {
                  alert("Product Name is required");
                  return;
                }
                else if(!productCode && fields.length == 0)
                {
                  alert("Product Style Code is required");
                  return;
                }
                if(typeOfProduct?.toString().toUpperCase() === "GOLD JEWELLERY" && fields.length == 0)
                {
                append({ attribute: attributes.find( (x:any)=> x.name === "Gold" ) , value: [] });
                append({ attribute: attributes.find( (x:any)=> ["Precious Stones"].includes(x.name) ) , value: [] });
              }
              else if(typeOfProduct?.toString().toUpperCase() === "PLATINUM JEWELLERY" && fields.length == 0)
              {
                append({ attribute: attributes.find( (x:any)=> x.name === "Platinum" ) , value: [] });
            }
              else if(typeOfProduct?.toString().toUpperCase() === "DIAMOND JEWELLERY" && fields.length == 0)
                {
                append({ attribute: attributes.find( (x:any)=> ["Diamond"].includes(x.name) ) , value: [] });
                append({ attribute: attributes.find( (x:any)=> ["Gold"].includes(x.name) ) , value: [] });
              }
              else if(typeOfProduct?.toString().toUpperCase() === "POLKI JEWELLERY" && fields.length == 0)
                {
                append({ attribute: attributes.find( (x:any)=> ["Diamond"].includes(x.name) ) , value: [] });
                append({ attribute: attributes.find( (x:any)=> ["Gold"].includes(x.name) ) , value: [] });
              }

              else if(typeOfProduct?.toString().toUpperCase() === "SILVER JEWELLERY" && fields.length == 0)
                {
                  append({ attribute: attributes.find( (x:any)=> x.name === "Silver" ) , value: [] });
              }
              else if((typeOfProduct?.toString().toUpperCase() || "") == "LOOSE DIAMOND" && fields.length == 0)
                {
                  append({ attribute: attributes.find( (x:any)=> x.name === "Diamond" ) , value: [] });
              }
              else if(typeOfProduct?.toString().toUpperCase() === "GEMSTONES" && fields.length == 0)
                {
                  append({ attribute: attributes.find( (x:any)=> ["Precious Stones"].includes(x.name) ) , value: [] });
              }
              else if(["SOLITAIRES"].includes(typeOfProduct?.toString().toUpperCase()) && fields.length == 0)
                {
                  append({ attribute: attributes.find( (x:any)=> ["SOLITAIRE"].includes(x.name) ) , value: [] });
                append({ attribute: attributes.find( (x:any)=> ["Gold"].includes(x.name) ) , value: [] });
              }
              else if(["LABGROWN SOLITAIRES"].includes(typeOfProduct?.toString().toUpperCase()) && fields.length == 0)
              {
                append({ attribute: attributes.find( (x:any)=> ["SOLITAIRE"].includes(x.name) ) , value: [] });
            }
              else if((typeOfProduct?.toString().toUpperCase() || "") == "LABGROWN LOOSE DIAMOND" && fields.length == 0)
              {
                append({ attribute: attributes.find( (x:any)=> x.name === "Lab Grown Diamond" ) , value: [] });
            }
                else{
                append({ attribute: "", value: [] });
                }
              }}
              type="button"
            >
              {t("form:button-label-add-option")}
            </Button>
          </div>
        </div>
        </Card>
          {!!cartesianProduct?.length && (
            <div className="border-t border-dashed border-border-200 pt-5 md:pt-8 mt-5 md:mt-8">

<br/>
                <br/>
              <Title className="text-lg uppercase text-start px-5 md:px-8 mb-0">
                
                {cartesianProduct?.length} {t("form:total-variation-added")}
              </Title>
              <br />
              {
                  <div style={{textAlign:"right"}}>  
                  <Button onClick={autofill}>
                    Auto Fill As First Row
                  </Button>
              <br />
              <br />

                  </div>
                }
              <div style={{overflowX:"auto", maxWidth:`${deviceWidth-(deviceWidth/10)}px`, border: "1px solid black" }}>
              <table className="w-full" style={{ border: "1px solid black" }}>
                <thead>
                <tr style={{ border: "1px solid black" }}>
                  <th></th>
                  {
                    ["GOLD JEWELLERY","PLATINUM JEWELLERY","SILVER JEWELLERY","DIAMOND JEWELLERY","POLKI JEWELLERY","SOLITAIRES"].includes(typeOfProductProp?.toString().toUpperCase() || "")
                    ?
                  <th style={{ border: "1px solid black", minWidth:"80px" }}>Gr. Wt. (Gms)</th> : ""
}

{
                                        (["GOLD JEWELLERY","PLATINUM JEWELLERY","SILVER JEWELLERY","DIAMOND JEWELLERY","POLKI JEWELLERY","SOLITAIRES"].includes(typeOfProductProp?.toString().toUpperCase() || "") && variations.find((x:any)=>["Precious Stones","Diamond","Polki","SOLITAIRE"].includes(x.attribute.name)))
                                        ?
                  <th style={{ border: "1px solid black", minWidth:"80px" }}>Nt. Wt. (Gms)</th> : ""
                  }
                  {
                    ["GOLD JEWELLERY","PLATINUM JEWELLERY","DIAMOND JEWELLERY","POLKI JEWELLERY","SOLITAIRES"].includes(typeOfProductProp?.toString().toUpperCase() || "")
                    ?                    
                 <th style={{ border: "1px solid black", minWidth:"40px"  }}>Wastage (%)</th> : ""
}
{
                    ["GOLD JEWELLERY","PLATINUM JEWELLERY","SILVER JEWELLERY","DIAMOND JEWELLERY","POLKI JEWELLERY","SOLITAIRES"].includes(typeOfProductProp?.toString().toUpperCase() || "")
                    ?
                  <th style={{ border: "1px solid black", minWidth:"80px"  }}>Pure Wt. (Gms)</th> : ""
}
{
                    (["DIAMOND JEWELLERY","POLKI JEWELLERY","LOOSE DIAMOND","LABGROWN LOOSE DIAMOND","SOLITAIRES","LABGROWN SOLITAIRES"].includes(typeOfProductProp?.toString().toUpperCase() || "")  && variations.find((x:any)=>["Diamond","Polki","Lab Grown Diamond","SOLITAIRE"].includes(x.attribute.name)))
                    ?
                  <th style={{ border: "1px solid black", minWidth:"80px" }}>
                    {
                    ["SOLITAIRES","LABGROWN SOLITAIRES"].includes(typeOfProductProp?.toString().toUpperCase() || "") ? "Sol Wt. (Ct)" : "Diam Wt. (Ct)"
                    }
                    </th> : ""
                  }
                  

                  {
                    (["DIAMOND JEWELLERY","POLKI JEWELLERY","LOOSE DIAMOND","LABGROWN LOOSE DIAMOND","SOLITAIRES","LABGROWN SOLITAIRES"].includes(typeOfProductProp?.toString().toUpperCase() || "") && variations.find((x:any)=>["Diamond","Polki","SOLITAIRE","Lab Grown Diamond"].includes(x.attribute.name)))
                    ?
                  <th style={{ border: "1px solid black", minWidth:"80px" }}>
                    {
                                        ["SOLITAIRES","LABGROWN SOLITAIRES"].includes(typeOfProductProp?.toString().toUpperCase() || "") ? "Sol Rate (Ct)" : "Diam Rate (Ct)"
                  }
                    </th> : ""
                  }
{
                    (["DIAMOND JEWELLERY","GOLD JEWELLERY","PLATINUM JEWELLERY","SILVER JEWELLERY","GEMSTONES","SOLITAIRES"].includes(typeOfProductProp?.toString().toUpperCase() || "") && variations.find((x:any)=>x.attribute.name === "Precious Stones"))
                    ?
                  <th style={{ border: "1px solid black", minWidth:"80px" }}>Stone Wt. (Ct)</th> : ""
                  }
                  {
                    (!["GOLD JEWELLERY","PLATINUM JEWELLERY","SILVER JEWELLERY","GEMSTONES","DIAMOND JEWELLERY","POLKI JEWELLERY","LOOSE DIAMOND","LABGROWN LOOSE DIAMOND","SOLITAIRES","LABGROWN SOLITAIRES"].includes(typeOfProductProp?.toString().toUpperCase() || ""))
                    ?
                  <th style={{ border: "1px solid black", minWidth:"80px" }}>Ct</th> : ""
                  }
                  

{
                    (["DIAMOND JEWELLERY","GOLD JEWELLERY","PLATINUM JEWELLERY","SILVER JEWELLERY","GEMSTONES","SOLITAIRES"].includes(typeOfProductProp?.toString().toUpperCase() || "") && variations.find((x:any)=>x.attribute.name === "Precious Stones"))
                    ?
                  <th style={{ border: "1px solid black", minWidth:"80px" }}>Stone Rate (Ct)</th> : ""
                  }
                  {
                    (!["GOLD JEWELLERY","PLATINUM JEWELLERY","SILVER JEWELLERY","GEMSTONES","DIAMOND JEWELLERY","POLKI JEWELLERY","LOOSE DIAMOND","LABGROWN LOOSE DIAMOND","SOLITAIRES","LABGROWN SOLITAIRES"].includes(typeOfProductProp?.toString().toUpperCase() || ""))
                    ?
                  <th style={{ border: "1px solid black", minWidth:"80px" }}>Rate</th> : ""
                  }
                  <th style={{ border: "1px solid black", minWidth:"200px" }}>SKU</th>
                  <th style={{ border: "1px solid black", minWidth:"80px" }}>Qty</th>
                </tr></thead>
                {cartesianProduct.map(
                  (fieldAttributeValue: any, index: number) => {
                    return (
                      <tbody key={`fieldAttributeValues-${index}`}> 
                      <tr>
                        <td style={{ border: "1px solid black", textAlign:"center" }}>
                          <span className="text-base text-blue-600 font-normal">
                            {Array.isArray(fieldAttributeValue)
                              ? fieldAttributeValue
                                  ?.map((a) => ["SOLITAIRES","LABGROWN SOLITAIRES"].includes(typeOfProductProp?.toString().toUpperCase() || "") ? (a.value.split(" ").length > 1 ? a.value.split(" ")[2] : a.value) : (a.value.split(" ").length > 1 ? a.value.split(" ")[1] : a.value))
                                  .join(" ")
                              : fieldAttributeValue?.value}
                          </span>
						  <TitleAndOptionsInput
                        register={register}
                        setValue={setValue}
                        index={index}
                        shopData={shopData}
                        calculateAndBlur={calculateAndBlur}
                        fieldAttributeValue={fieldAttributeValue}
                        variation_options={variation_options}
                        initialValues={initialValues}
                        variations={variations}
                      />
                      <input
                        {...register(`variation_options.${index}.id`)}
                        type="hidden"
                      />
                   <input
                        {...register(`variation_options.${index}.goldPrice`)}
                        type="hidden"
                      />
                        </td>
{
   ((["DIAMOND JEWELLERY","POLKI JEWELLERY","SOLITAIRES"].includes(typeOfProductProp?.toString().toUpperCase() || "") && variations.find((x:any)=>["Diamond","Polki","SOLITAIRE"].includes(x.attribute.name)))
   || (["GOLD JEWELLERY","PLATINUM JEWELLERY","SILVER JEWELLERY"].includes(typeOfProductProp?.toString().toUpperCase() || "")))
?
                        <td style={{ border: "1px solid black"}}>
                          <span style={{fontSize:"10px"}}>
    .
</span>
                        <Input
                          type="text"
                          onKeyUp={calculatePrice}
                          
                          {...register(`variation_options.${index}.goldWeight`)}
                          variant="outline"
						  defaultValue={0}
                        />
						</td> : ""
                  }
                  {
                                        (["GOLD JEWELLERY","PLATINUM JEWELLERY","SILVER JEWELLERY","DIAMOND JEWELLERY","POLKI JEWELLERY","SOLITAIRES"].includes(typeOfProductProp?.toString().toUpperCase() || "") && variations.find((x:any)=>["Precious Stones","Diamond","Polki","SOLITAIRE"].includes(x.attribute.name)))
?
                        <td style={{ border: "1px solid black" }}>
                          <span style={{fontSize:"10px"}}>
    .
</span>
<Input
                          
                          onKeyUp={calculatePrice}
                          {...register(`variation_options.${index}.netWeight`)}
						  defaultValue={0}
                          variant="outline"
						  readOnly={true}
                        />
						</td> : ""
                  }
                  {
                    ["GOLD JEWELLERY","PLATINUM JEWELLERY","DIAMOND JEWELLERY","POLKI JEWELLERY","SOLITAIRES"].includes(typeOfProductProp?.toString().toUpperCase() || "")
                    ?                    
                        <td style={{ border: "1px solid black" }}>
                          <span style={{fontSize:"10px"}}>
    .
</span>
						<Input
            readOnly={["DIAMOND JEWELLERY","POLKI JEWELLERY","SOLITAIRES"].includes(typeOfProductProp?.toString().toUpperCase() || "")}
                          onKeyUp={calculatePrice}
						              defaultValue={0}
                          min={0}
                          max={20}
                          {...register(`variation_options.${index}.wastage`)}
                          variant="outline"
                        />
						</td> : ""
                  }
                  {
                    ["GOLD JEWELLERY","PLATINUM JEWELLERY","SILVER JEWELLERY","POLKI JEWELLERY","DIAMOND JEWELLERY","SOLITAIRES"].includes(typeOfProductProp?.toString().toUpperCase() || "")
                    ?                    
            <td style={{ border: "1px solid black" }} >
  <span style={{fontSize:"10px"}}>
    .
</span>
            	<Input
                          
                          onKeyUp={calculatePrice}
                          {...register(`variation_options.${index}.pureWeight`)}
						  defaultValue={0}
                          variant="outline"
						  readOnly={true}
                        />
						</td> : ""
                  }
                   {
                    ((["DIAMOND JEWELLERY","POLKI JEWELLERY","LOOSE DIAMOND","LABGROWN LOOSE DIAMOND","SOLITAIRES","LABGROWN SOLITAIRES"].includes(typeOfProductProp?.toString().toUpperCase() || "") && variations.find((x:any)=>["Diamond","Polki","Lab Grown Diamond","SOLITAIRE"].includes(x.attribute.name)))
                    || (["GOLD JEWELLERY","PLATINUM JEWELLERY","SILVER JEWELLERY","GEMSTONES"].includes(typeOfProductProp?.toString().toUpperCase() || "") && variations.find((x:any)=>x.attribute.name === "Precious Stones"))
                    || !["GOLD JEWELLERY","PLATINUM JEWELLERY","SILVER JEWELLERY","GEMSTONES","DIAMOND JEWELLERY","POLKI JEWELLERY","LOOSE DIAMOND","LABGROWN LOOSE DIAMOND","SOLITAIRES","LABGROWN SOLITAIRES"].includes(typeOfProductProp?.toString().toUpperCase() || "")
                    )

                                    ?
                             <td style={{ border: "1px solid black" }} >
                             <tr>                    
<td>
  <span style={{fontSize:"9px"}}>
  {
    fieldAttributeValue?.length ? fieldAttributeValue?.find((x:any)=>["Diamond","SOLITAIRE"].includes(x.name))?.value || "." : fieldAttributeValue?.value
  }
  </span>
						<Input
                          type="text"
                          onKeyUp={calculatePrice}
                          
                          {...register(`variation_options.${index}.diamondWeight`)}
						  defaultValue={0}
                          variant="outline"
                        />
                        </td>
                        </tr>
                        <tr hidden={getHidden(index,1) && !variation_options[index].diamondValue1}>                    
<td>
  <span style={{fontSize:"9px"}}>
  {
    variation_options[index].diamondValue1 || "."
  }
  </span>
						<Input
                          type="text"
                          onKeyUp={calculatePrice}
                          
                          {...register(`variation_options.${index}.diamondWeight1`)}
						  defaultValue={0}
                          variant="outline"
                        />
                        </td>
                        </tr>
                        <tr hidden={getHidden(index,2) && !variation_options[index].diamondValue2}>                    
<td>
  <span style={{fontSize:"9px"}}>
  {
    variation_options[index].diamondValue2 || "."
  }
  </span>
						<Input
                          type="text"
                          onKeyUp={calculatePrice}
                          
                          {...register(`variation_options.${index}.diamondWeight2`)}
						  defaultValue={0}
                          variant="outline"
                        />
                        </td>
                        </tr>
                        <tr  hidden={getHidden(index,3) && !variation_options[index].diamondValue3}>                    
<td>
  <span style={{fontSize:"9px"}}>
  {
    variation_options[index].diamondValue3 || "."
  }
  </span>
						<Input
                          type="text"
                          onKeyUp={calculatePrice}
                          
                          {...register(`variation_options.${index}.diamondWeight3`)}
						  defaultValue={0}
                          variant="outline"
                        />
                        </td>
                        </tr>                        
                        <tr hidden={getHidden(index,4) && !variation_options[index].diamondValue4}>                    
<td>
  <span style={{fontSize:"9px"}}>
  {
    variation_options[index].diamondValue4 || "."
  }
  </span>
						<Input
                          type="text"
                          onKeyUp={calculatePrice}
                          
                          {...register(`variation_options.${index}.diamondWeight4`)}
						  defaultValue={0}
                          variant="outline"
                        />
                        </td>
                        </tr>
                        </td>
                         : ""
                  }
                 
                  {
                    ((["DIAMOND JEWELLERY","POLKI JEWELLERY","LOOSE DIAMOND","LABGROWN LOOSE DIAMOND","SOLITAIRES","LABGROWN SOLITAIRES"].includes(typeOfProductProp?.toString().toUpperCase() || "") && variations.find((x:any)=>["Diamond","Polki","Lab Grown Diamond","SOLITAIRE"].includes(x.attribute.name)))
                    || (["GOLD JEWELLERY","PLATINUM JEWELLERY","SILVER JEWELLERY","GEMSTONES"].includes(typeOfProductProp?.toString().toUpperCase() || "") && variations.find((x:any)=>x.attribute.name === "Precious Stones"))
                    || !["GOLD JEWELLERY","PLATINUM JEWELLERY","SILVER JEWELLERY","GEMSTONES","DIAMOND JEWELLERY","POLKI JEWELLERY","LOOSE DIAMOND","LABGROWN LOOSE DIAMOND","SOLITAIRES","LABGROWN SOLITAIRES"].includes(typeOfProductProp?.toString().toUpperCase() || ""))
                                    ?
                                    <td style={{ border: "1px solid black" }}  >
                                      <tr>                   
                                    <td>
       <span style={{fontSize:"10px"}}>
    .
</span>     
                                    <Input
                          type={
                            variations.find((x:any)=>["Precious Stones","Polki","Diamond",,"SOLITAIRE","Lab Grown Diamond"].includes(x.attribute.name)) || variations.find((x:any)=>!["Gold","Silver","Platinum"].includes(x.attribute.name)) ? "" : "hidden"
                          }
                          onKeyUp={calculatePrice}
                          {...register(`variation_options.${index}.diamondPrice`)}
						  defaultValue={0}
                          variant="outline"
                        />
                        </td> 
                        </tr>
                        <tr  hidden={getHidden(index,1) && !variation_options[index].diamondValue1}>                   
                                    <td>
       <span style={{fontSize:"10px"}}>
    .
</span>     
                                    <Input
                          type={
                            variations.find((x:any)=>["Diamond"].includes(x.attribute.name)) || variations.find((x:any)=>!["Gold","Silver","Platinum"].includes(x.attribute.name)) ? "" : "hidden"
                          }
                          onKeyUp={calculatePrice}
                          {...register(`variation_options.${index}.diamondPrice1`)}
						  defaultValue={0}
              
                          variant="outline"
                        />
                        </td> 
                        </tr>
                         <tr hidden={getHidden(index,2) && !variation_options[index].diamondValue2}>                   
                                    <td>
       <span style={{fontSize:"10px"}}>
    .
</span>     
                                    <Input
                          type={
                            variations.find((x:any)=>["Diamond"].includes(x.attribute.name)) || variations.find((x:any)=>!["Gold","Silver","Platinum"].includes(x.attribute.name)) ? "" : "hidden"
                          }
                          onKeyUp={calculatePrice}
              

                          {...register(`variation_options.${index}.diamondPrice2`)}
						  defaultValue={0}
                          variant="outline"
                        />
                        </td> 
                        </tr>
                        <tr hidden={getHidden(index,3) && !variation_options[index].diamondValue3}>                   
                                    <td>
       <span style={{fontSize:"10px"}}>
    .
</span>     
                                    <Input
                          type={
                            variations.find((x:any)=>["Diamond"].includes(x.attribute.name)) || variations.find((x:any)=>!["Gold","Silver","Platinum"].includes(x.attribute.name)) ? "" : "hidden"
                          }
              

                          onKeyUp={calculatePrice}
                          {...register(`variation_options.${index}.diamondPrice3`)}
						  defaultValue={0}
                          variant="outline"
                        />
                        </td> 
                        </tr>
                        <tr hidden={getHidden(index,4) && !variation_options[index].diamondValue4}>                   
                                    <td>
       <span style={{fontSize:"10px"}}>
    .
</span>     
                                    <Input
                          type={
                            variations.find((x:any)=>["Diamond"].includes(x.attribute.name)) || variations.find((x:any)=>!["Gold","Silver","Platinum"].includes(x.attribute.name)) ? "" : "hidden"
                          }
                          onKeyUp={calculatePrice}
              

                          {...register(`variation_options.${index}.diamondPrice4`)}
						  defaultValue={0}
                          variant="outline"
                        />
                        </td> 
                        </tr>
                        </td>
                        : ""
                  }
                  {
                                       (["DIAMOND JEWELLERY"].includes(typeOfProductProp?.toString().toUpperCase() || "") && variations.find((x:any)=>x.attribute.name === "Precious Stones"))

                                    ?                    
<td style={{ border: "1px solid black" }} >
<span style={{fontSize:"10px"}}>
    .
</span>
						<Input
                          type="text"
                          onKeyUp={calculatePrice}
                          
                          {...register(`variation_options.${index}.stoneWeight`)}
						  defaultValue={0}
                          variant="outline"
                        />
                        </td> : ""
                  }
                 
                  {
                    (["DIAMOND JEWELLERY"].includes(typeOfProductProp?.toString().toUpperCase() || "") && variations.find((x:any)=>x.attribute.name === "Precious Stones"))
                    
                    ?                    
                                    <td style={{ border: "1px solid black" }} >
       <span style={{fontSize:"10px"}}>
    .
</span>     
                                    <Input
                          type={
                            variations.find((x:any)=>["Precious Stones","Polki","Diamond",,"SOLITAIRE","Lab Grown Diamond"].includes(x.attribute.name)) || variations.find((x:any)=>!["Gold","Silver","Platinum"].includes(x.attribute.name)) ? "" : "hidden"
                          }
                          onKeyUp={calculatePrice}
                          {...register(`variation_options.${index}.stonePrice`)}
						  defaultValue={0}
                          variant="outline"
                        />
                        </td> : ""
                  }
						  <td style={{ border: "1px solid black" }} >
              <span style={{fontSize:"10px"}}>
    .
</span>
      			<Input
                          type={"text"
                          }
                          {...register(`variation_options.${index}.sku`)}
                          variant="outline"
                          defaultValue={ productStyleCode && Array.isArray(fieldAttributeValue)
                            ? productStyleCode?.replaceAll(" ","_") + "-" + fieldAttributeValue
                                ?.map((a) => ["SOLITAIRES","LABGROWN SOLITAIRES"].includes(typeOfProductProp?.toString().toUpperCase() || "") ? (a.value.split(" ").length > 1 ? a.value.split(" ")[2] : a.value) : (a.value.split(" ").length > 1 ? a.value.split(" ")[1] : a.value))
                                .join("/")
                            : productStyleCode?.replaceAll(" ","_") + "-" + fieldAttributeValue?.value}
                        />
						</td>
						<td style={{ border: "1px solid black" }} >
            <span style={{fontSize:"10px"}}>
    .
</span>
      			<Input
                          type={"hidden"
                          }
                          {...register(`variation_options.${index}.price`)}
                          variant="outline"
						  defaultValue={1}
                        />
						<Input
                          type={"hidden"
                          }
                          {...register(`variation_options.${index}.sale_price`)}
                          variant="outline"
                        />
						<Input
						  defaultValue={0}
                          {...register(`variation_options.${index}.quantity`)}
                          variant="outline"
                        />
						</td>
                      </tr>
                      </tbody>
                      )}
                )}
              </table>
              </div>
            </div>
          )}
          {
            variation_options.length > 0 && deviceWidth < 1000 ?
                    <img style={{margin:"15px 150px", width: "50px"}} src={"/admin/icons/swiping.png"} /> : ""
          }
    </div>

  );
}

export const TitleAndOptionsInput = ({
  fieldAttributeValue,
  index,
  setValue,
  register,
  variation_options,
  variations,
  calculateAndBlur,
  initialValues,
  shopData
}: any) => {
  let typeOfProduct = localStorage.getItem("typeOfProduct") || "";
  const title = Array.isArray(fieldAttributeValue)
    ? fieldAttributeValue?.map((a) => 
    ["SOLITAIRES","LABGROWN SOLITAIRES"].includes(typeOfProduct?.toString().toUpperCase() || "") ?
    a.value.split(" ").length > 1 ? a.value.split(" ")[2] : a.value
    :
    a.value.split(" ").length > 1 ? a.value.split(" ")[1] : a.value
    ).join("/")
    : fieldAttributeValue?.value;
  const options = Array.isArray(fieldAttributeValue)
    ? JSON.stringify(fieldAttributeValue)
    : JSON.stringify([fieldAttributeValue]);
  useEffect(() => {
    setValue(`variation_options.${index}.title`, title);
    setValue(`variation_options.${index}.options`, options);
    if(fieldAttributeValue && fieldAttributeValue.length && fieldAttributeValue?.find((x:any)=>["Diamond","Polki","Lab Grown Diamond","SOLITAIRE"].includes(x.name)))
    {
      if(!variation_options?.[index]?.diamondPrice || variation_options?.[index]?.diamondPrice == 0)
        {
          setValue(`variation_options.${index}.diamondPrice`, fieldAttributeValue?.length
          ? (Number(fieldAttributeValue?.find((x:any)=>(["Diamond","Polki","Lab Grown Diamond","SOLITAIRE"].includes(x.name)))?.rate)) : (fieldAttributeValue?.rate || 0));      
        }
        if(!variation_options?.[index]?.diamondPricePerCt || variation_options?.[index]?.diamondPricePerCt == 0)
      {
    setValue(`variation_options.${index}.diamondPricePerCt`, fieldAttributeValue?.length
     ? (Number(fieldAttributeValue?.find((x:any)=>(["Diamond","Polki","Lab Grown Diamond","SOLITAIRE"].includes(x.name)))?.rate)) : (fieldAttributeValue?.rate || 0));
      }
    }
    else if(fieldAttributeValue && fieldAttributeValue?.rate && ["LOOSE DIAMOND","LABGROWN LOOSE DIAMOND"].includes(typeOfProduct)){
      if(!variation_options?.[index]?.diamondPrice || variation_options?.[index]?.diamondPrice == 0)
        {
      setValue(`variation_options.${index}.diamondPrice`,(fieldAttributeValue?.rate || 0));
        }
        if(!variation_options?.[index]?.diamondPricePerCt || variation_options?.[index]?.diamondPricePerCt == 0)
          {
      setValue(`variation_options.${index}.diamondPricePerCt`,(fieldAttributeValue?.rate || 0));
          }
    }
    if(fieldAttributeValue && fieldAttributeValue.length && fieldAttributeValue?.find((x:any)=>["Gold","Silver","Platinum"].includes(x.name))){
    
      setValue(`variation_options.${index}.goldPrice`, fieldAttributeValue?.length
    ? (Number(fieldAttributeValue?.find((x:any)=>(["Gold","Silver","Platinum"].includes(x.name)))?.rate) || 0) : (fieldAttributeValue?.rate || 0));
    }
      calculateAndBlur(index);
  }, [fieldAttributeValue]);
  return (
    <>
      <input {...register(`variation_options.${index}.title`)} type="hidden" />
      <input
        {...register(`variation_options.${index}.options`)}
        type="hidden"
      />
    </>
  );
};
