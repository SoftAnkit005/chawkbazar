import SelectInput from "@components/ui/select-input";
import Label from "@components/ui/label";
import ValidationError from "@components/ui/form-validation-error";
import { Control } from "react-hook-form";
import { useTypesQuery } from "@data/type/use-types.query";
import { useTranslation } from "next-i18next";
import { orderBy } from "lodash";

interface Props {
  control: Control<any>;
  error: string | undefined;
  setProductType:any;
  lengthVariationOption:number;
}

const ProductGroupInput = ({ control, error, setProductType, lengthVariationOption }: Props) => {
  const { t } = useTranslation();
  const { data, isLoading: loading } = useTypesQuery({
    limit: 999,
  });

  let sequences = [
    "DIAMOND JEWELLERY",
    "GOLD JEWELLERY",
    "SILVER JEWELLERY",
    "POLKI JEWELLERY",
    "PLATINUM JEWELLERY",
    "SOLITAIRES",
    "LOOSE DIAMOND",
    "LABGROWN SOLITAIRES",
    "LABGROWN LOOSE DIAMOND",
    "SEMI PRECIOUS BEADS",
    "GEMSTONES",
  ]

  if(data && data.types && data.types.data && data.types.data.length && data.types.data.length > 0 )
  {
    data.types.data = data.types.data.map((x:any)=>{
      x.sequence = sequences.findIndex((y:any)=>x.name == y);
      return x;
    }); 
    data.types.data = orderBy(data.types.data,['sequence'],['asc']);
  }


  return (
    <div className="mb-5">
      <Label>{t("form:input-label-group")}*</Label>
      <SelectInput
        name="type"
        control={control}
        getOptionLabel={(option: any) => {
          return option.name;
        }}
        getOptionValue={(option: any) => {
          localStorage.setItem("typeOfProduct",option.name);
          setProductType(option.name);
          return option.id
        }}
        options={!lengthVariationOption ? data?.types?.data! : []}
        isLoading={loading}
      />
      <ValidationError message={t(error!)} />
    </div>
  );
};

export default ProductGroupInput;
