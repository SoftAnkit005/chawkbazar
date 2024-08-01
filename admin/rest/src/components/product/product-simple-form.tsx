import Card from "@components/common/card";
import Description from "@components/ui/description";
import ValidationError from "@components/ui/form-validation-error";
import Input from "@components/ui/input";
import Label from "@components/ui/label";
import SelectInput from "@components/ui/select-input";
import { useTranslation } from "next-i18next";
import { useFormContext } from "react-hook-form";

type IProps = {
  initialValues: any;
  typeOfProductProp: any;
};

export default function ProductSimpleForm({ initialValues, typeOfProductProp }: IProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();
  const { t } = useTranslation();
  const shapeList = [
    {name:"ROUND",value:"ROUND"},
    {name:"PEAR",value:"PEAR"},
    {name:"OVAL",value:"OVAL"},
    {name:"MARQUISE",value:"MARQUISE"},
    {name:"HEART",value:"HEART"},
    {name:"RADIANT",value:"RADIANT"},
    {name:"PRINCESS",value:"PRINCESS"},
    {name:"EMERALD",value:"EMERALD"},
    {name:"ASSCHER",value:"ASSCHER"},
    {name:"SQ.EMERALD",value:"SQ.EMERALD"},
    {name:"ASSCHER & SQ.EMELARD",value:"ASSCHER & SQ.EMELARD"},
    {name:"SQUARE RADIANT",value:"SQUARE RADIANT"},
    {name:"CUSHION",value:"CUSHION"},
    {name:"BAGUETTE",value:"BAGUETTE"},
    {name:"EUROPEAN CUT",value:"EUROPEAN CUT"}
  ];
  const colorList=[
    {name:"D",value:"D"},
    {name:"E",value:"E"},
    {name:"F",value:"F"},
    {name:"G",value:"G"},
    {name:"H",value:"H"},
    {name:"I",value:"I"},
    {name:"J",value:"J"},
    {name:"K",value:"K"},
    {name:"L",value:"L"},
    {name:"M",value:"M"},
    {name:"N",value:"N"},
    {name:"O",value:"O"},
    {name:"P",value:"P"},
    {name:"Q",value:"Q"},
    {name:"R",value:"R"},
    {name:"S",value:"S"},
    {name:"T",value:"T"},
    {name:"U",value:"U"},
    {name:"V",value:"V"},
    {name:"W",value:"W"},
    {name:"X",value:"X"},
    {name:"Y",value:"Y"},
    {name:"Z",value:"Z"}
  ]
  const clarityList = [
    {name:"FL",value:"FL"},
    {name:"IF",value:"IF"},
    {name:"VVS1",value:"VVS1"},
    {name:"VVS2",value:"VVS2"},
    {name:"VS1",value:"VS1"},
    {name:"VS2",value:"VS2"},
    {name:"SI1",value:"SI1"},
    {name:"SI2",value:"SI2"},
    {name:"SI3",value:"SI3"},
    {name:"I1",value:"I1"},
    {name:"I2",value:"I2"},
    {name:"I3",value:"I3"},
  ];
  const cutPolishSymmetryList = [
    {name:"ANY",value:"ANY"},
    {name:"IDEAL",value:"IDEAL"},
    {name:"EXCELLENT",value:"EXCELLENT"},
    {name:"VERY GOOD",value:"VERY GOOD"},
    {name:"GOOD",value:"GOOD"},
    {name:"FAIR",value:"FAIR"},
    {name:"POOR",value:"POOR"}
  ]
  const fluorescenceList = [
    {name:"NONE",value:"NONE"},
    {name:"VERY SLIGHT",value:"VERY SLIGHT"},
    {name:"FAINT/SLIGHT",value:"FAINT/SLIGHT"},
    {name:"MEDIUM",value:"MEDIUM"},
    {name:"STRONG",value:"STRONG"},
    {name:"VERY STRONG",value:"VERY STRONG"}
  ]
  const gradingList = [
    {name:"GIA",value:"GIA"},
    {name:"AGS",value:"AGS"},
    {name:"DBIOD",value:"DBIOD"},
    {name:"DHI",value:"DHI"},
    {name:"HRD",value:"HRD"},
    {name:"NGTC",value:"NGTC"},
    {name:"GIA DOR",value:"GIA DOR"},
    {name:"CGL",value:"CGL"},
    {name:"GCAL",value:"GCAL"},
    {name:"GSI",value:"GSI"},
    {name:"IGI",value:"IGI"}
  ]
  const locationList = [
    {name:"INDIA",value:"INDIA"},
    {name:"USA",value:"USA"},
    {name:"NEW YORK",value:"NEW YORK"},
    {name:"LOS ANGELES",value:"LOS ANGELES"},
    {name:"HONG KONG",value:"HONG KONG"},
    {name:"BELGIUM",value:"BELGIUM"},
    {name:"ISRAEL",value:"ISRAEL"},
    {name:"CHINA",value:"CHINA"},
    {name:"EUROPE",value:"EUROPE"},
    {name:"JAPAN",value:"JAPAN"},
    {name:"UNITED KINGDOM",value:"UNITED KINGDOM"},
    {name:"AUSTRALIA",value:"AUSTRALIA"}
  ]
  return (
    <div className="flex flex-wrap my-5 sm:my-8">
      <Description
        title={t("form:form-title-simple-product-info")}
        details={`${
          initialValues
            ? t("form:item-description-edit")
            : t("form:item-description-add")
        } ${t("form:form-description-simple-product-info")}`}
        className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
      />

      <Card className="w-full sm:w-8/12 md:w-2/3">
        <div style={{display:typeOfProductProp == "SOLITAIRES" ? "none" : "block"}}>
        <Input
          label={`${t("form:input-label-price")}*`}
          {...register("price")}
          type="number"
          readOnly={typeOfProductProp == "SOLITAIRES"}
          error={t(errors.price?.message!)}
          variant="outline"
          className="mb-5"
        />
        <Input
          label={t("form:input-label-sale-price")}
          type="number"
          readOnly={typeOfProductProp == "SOLITAIRES"}
          {...register("sale_price")}
          error={t(errors.sale_price?.message!)}
          variant="outline"
          className="mb-5"
        />
        </div>
         {
         typeOfProductProp == "SOLITAIRES" ?
         <div>
        <Input
          label={"Discount %"}
          type="number"
          {...register("discount")}
          error={t(errors.discount?.message!)}
          variant="outline"
          className="mb-5"
        />
        <Input
          label={"Rate Per Ct ($)"}
          type="number"
          min={0}
          max={100}
          {...register("rate_per_unit")}
          error={t(errors.rate_per_unit?.message!)}
          variant="outline"
          className="mb-5"
        />
        </div>
        : ""
         }
        <Input
          label={`${t("form:input-label-sku")}*`}
          {...register("sku")}
          error={t(errors.sku?.message!)}
          variant="outline"
          className="mb-5"
        />

        <Input
          label={t("form:input-label-width")}
          {...register("width")}
          error={t(errors.width?.message!)}
          variant="outline"
          className="mb-5"
        />
        <Input
          label={t("form:input-label-height")}
          {...register("height")}
          error={t(errors.height?.message!)}
          variant="outline"
          className="mb-5"
        />
        <Input
          label={t("form:input-label-length")}
          {...register("length")}
          error={t(errors.length?.message!)}
          variant="outline"
          className="mb-5"
        />
        {
         typeOfProductProp == "SOLITAIRES" ?
         <div>
        <Input
          label={"Image Link"}
          {...register("image_link")}
          error={t(errors.image_link?.message!)}
          variant="outline"
          className="mb-5"
        />
        <Input
          label={"Video Link"}
          {...register("video_link")}
          error={t(errors.video_link?.message!)}
          variant="outline"
          className="mb-5"
        />
                <Input
          label={"Certificate Link"}
          {...register("certificate_link")}
          error={t(errors.certificate_link?.message!)}
          variant="outline"
          className="mb-5"
        />
              <Input
          label={"Certificate Number"}
          {...register("cert_no")}
          error={t(errors.cert_no?.message!)}
          variant="outline"
          className="mb-5"
        />
        {/* <Input
          {...register("shape")}
          type={"hidden"}
        /> */}
        <div className="mb-5">
        <Label>Shape</Label>
        <SelectInput
          name="shape"
          control={control}
          getOptionLabel={(option: any) => option.name}
          getOptionValue={(option: any) => option.value}
          options={shapeList}
        />
        <ValidationError message={t(errors.shape?.message)} />
      </div>
      <Input
          label={"Size In Ct"}
          {...register("size")}
          error={t(errors.size?.message!)}
          variant="outline"
          className="mb-5"
          type={"number"}
          min={0.01}
          max={10}
          defaultValue={0.01}
        />
        {/* <Input
          {...register("color")}
          type={"hidden"}
        /> */}
                <div className="mb-5">
        <Label>Color</Label>
        <SelectInput
          name="color"
          control={control}
          getOptionLabel={(option: any) => option.name}
          getOptionValue={(option: any) => option.value}
          options={colorList}
        />
        <ValidationError message={t(errors.color?.message)} />
      </div>
      {/* <Input
          {...register("clarity")}
          type={"hidden"}
        /> */}
      <div className="mb-5">
        <Label>Clarity</Label>
        <SelectInput
          name="clarity"
          control={control}
          getOptionLabel={(option: any) => option.name}
          getOptionValue={(option: any) => option.value}
          options={clarityList}
        />
        <ValidationError message={t(errors.clarity?.message)} />
      </div>
      {/* <Input
          {...register("cut")}
          type={"hidden"}
        /> */}
      <div className="mb-5">
        <Label>Cut</Label>
        <SelectInput
          name="cut"
          control={control}
          getOptionLabel={(option: any) => option.name}
          getOptionValue={(option: any) => option.value}
          options={cutPolishSymmetryList}
        />
        <ValidationError message={t(errors.cut?.message)} />
      </div>
      {/* <Input
          {...register("polish")}
          type={"hidden"}
        /> */}
      <div className="mb-5">
        <Label>Polish</Label>
        <SelectInput
          name="polish"
          control={control}
          getOptionLabel={(option: any) => option.name}
          getOptionValue={(option: any) => option.value}
          options={cutPolishSymmetryList}
        />
        <ValidationError message={t(errors.polish?.message)} />
      </div>
      {/* <Input
          {...register("symmetry")}
          type={"hidden"}
        /> */}
      <div className="mb-5">
        <Label>Symmetry</Label>
        <SelectInput
          name="symmetry"
          control={control}
          getOptionLabel={(option: any) => option.name}
          getOptionValue={(option: any) => option.value}
          options={cutPolishSymmetryList}
        />
        <ValidationError message={t(errors.symmetry?.message)} />
      </div>
      {/* <Input
          {...register("fluorescence")}
          type={"hidden"}
        /> */}

      <div className="mb-5">
        <Label>Fluorescence</Label>
        <SelectInput
          name="fluorescence"
          control={control}
          getOptionLabel={(option: any) => option.name}
          getOptionValue={(option: any) => option.value}
          options={fluorescenceList}
        />
        <ValidationError message={t(errors.fluorescence?.message)} />
      </div>
      {/* <Input
          {...register("grading")}
          type={"hidden"}
        /> */}
      <div className="mb-5">
        <Label>Grading</Label>
        <SelectInput
          name="grading"
          control={control}
          getOptionLabel={(option: any) => option.name}
          getOptionValue={(option: any) => option.value}
          options={gradingList}
        />
        <ValidationError message={t(errors.grading?.message)} />
      </div>
      {/* <Input
          {...register("location")}
          type={"hidden"}
        /> */}
      <div className="mb-5">
        <Label>Location</Label>
        <SelectInput
          name="location"
          control={control}
          getOptionLabel={(option: any) => option.name}
          getOptionValue={(option: any) => option.value}
          options={locationList}
        />
        <ValidationError message={t(errors.location?.message)} />
      </div>
      </div> : ""
}
      </Card>
    </div>
  );
}
