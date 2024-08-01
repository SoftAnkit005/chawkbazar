import Input from "@components/ui/input";
import { useForm, FormProvider } from "react-hook-form";
import Button from "@components/ui/button";
import Description from "@components/ui/description";
import Card from "@components/common/card";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import { menuBuilderValidationSchema } from "./menu-builder-validation-schema";
import { AttachmentInput, UpdateMenuBuilder } from "@ts-types/generated";
import { useCreateMenuBuilderMutation } from "@data/menu-builder/menu-builder-create.mutation";
import { useTranslation } from "next-i18next";
import { useUpdateMenuBuilderMutation } from "@data/menu-builder/menu-builder-update.mutation";
import Alert from "@components/ui/alert";
import { useState } from "react";
import { animateScroll } from "react-scroll";
import Label from "@components/ui/label";
import { useCategoriesQuery } from "@data/category/use-categories.query";
import SelectInput from "@components/ui/select-input";
import { useMenuBuilderQuery } from "@data/menu-builder/menu-builders.query";
import FileInput from "@components/ui/file-input";
import { useTagsQuery } from "@data/tag/use-tags.query";
import Image from "next/image";


type FormValues = {
  label: string;
  categories: {
    name: string,
    slug: string,
    id: number
  };
  collections: {
    name: string,
    slug: string,
    id: number
  };
  types: {
    name: string,
    id: string
  };
  type:string;
  id?: number;
  parent:number,
  parents?: {
    id:number;
    label:string;
    slug:string;
  }
  banners?:AttachmentInput[];
  icon?:AttachmentInput;
  bannerSlug1:string;
  bannerSlug2:string;
  sequence:number;
};

const defaultValues = {
  label: "",
  categories: {
    name: "",
    slug: "",
    id: 0
  },
  parents: {
    label: "",
    slug: "",
    id: 0
  },
  collections: {
    name: "",
    slug: "",
    id: 0
  },
  types:{
    id:"cat",
    name:"Category"
  },
  type:"cat",
  banners:[],
  icon:{},
  bannerSlug1:'',
  bannerSlug2:'',
  sequence:0,
};

type IProps = {
  initialValues?: UpdateMenuBuilder | null;
};


export default function CreateOrUpdateMenuBuilderForm({
  initialValues,
}: IProps) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { t } = useTranslation();
  const [parentState,setParentState] = useState<string>("");
  const [typeState,setTypeState] = useState<string>("cat");
  const methods = useForm<FormValues>({
    resolver: yupResolver(menuBuilderValidationSchema),
    shouldUnregister: true,
    defaultValues: initialValues ? initialValues : defaultValues,
  });


  if(initialValues)
  {
    initialValues.categories = {
    id:initialValues?.category,
    name: initialValues?.categoryName,
    slug: initialValues?.path.replaceAll("/search?category=",""),
  };
  initialValues.collections = {
    id:initialValues?.tag,
    name: initialValues?.tagName,
    slug: initialValues?.path.replaceAll("/collections/",""),
  };
  initialValues.parents = {
    id:initialValues?.parent,
    label: initialValues?.parentName,
    slug: initialValues?.path.replaceAll("/search?category=","").replaceAll("/collections/",""),
  };
  initialValues.types = {
    id:initialValues?.type,
    name:initialValues?.type == "col" ? "Sub Category" : "Category"
  };
  initialValues.icon = initialValues.icon;
}

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    watch,
    getValues,
    formState: { errors },
  } = methods;

  const {
    mutate: createMenuBuilder,
    isLoading: creating,
  } = useCreateMenuBuilderMutation();
  const {
    mutate: updateMenuBuilder,
    isLoading: updating,
  } = useUpdateMenuBuilderMutation();

  const { data, isLoading: loading } = useCategoriesQuery({
    limit: 999,
  });
  const { data: tagData } = useTagsQuery({
    limit: 999,
  });

  const {
    data: parentData,
    isLoading: loadingParent
  } = useMenuBuilderQuery({limit: 999})

  const onFormSubmit = async (values: FormValues) => {
    const {label, categories, collections, id, parent, types, parents, banners, icon, type, bannerSlug1, bannerSlug2, sequence} = values
    if(!label)
    {
      alert("Label is required");
      return;
    }
    else if((parent && parent?.id) && (!type || !type?.id))
    {
      alert("Type is required");
      return;
    }
    const inputValues: any = {
      label: label,
      bannerSlug1: bannerSlug1,
      bannerSlug2: bannerSlug2,
      categoryName: categories?.name || "",
      path: (categories?.slug || collections?.slug) ? ( (!types || types?.id == 'cat') ? `/search?category=${categories.slug}` : `/collections/${collections?.slug}`) : '/',
      category: categories?.id || 0,
      tagName:collections?.name || "",
      tag:collections?.id || 0,
      type: types?.id || "cat",
      id: id ? id : 0,
      parentName: parents?.label || "",
      parent: parents?.id || 0,
      banners: banners ? banners : [],
      icon: icon ? icon : {},
      sequence: sequence ? sequence : 0
    };


    if (initialValues) {
      updateMenuBuilder(
        {
          variables: {
            id: initialValues.id,
            input: inputValues,
          },
        },
        {
          onError: (error: any) => {
            Object.keys(error?.response?.data).forEach((field: any) => {
              setError(field, {
                type: "manual",
                message: error?.response?.data[field][0],
              });
            });
          },
        }
      );
    } else {
      createMenuBuilder(
        {
          ...inputValues,
        },
        {
          onError: (error: any) => {
            if (error?.response?.data?.message) {
              setErrorMessage(error?.response?.data?.message);
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
        }
      );
    }
  };
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
        <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
          <div className="flex flex-wrap my-5 sm:my-8">
            <Description
              title={t("form:item-description")}
              details={`${
                initialValues
                  ? t("form:item-description-edit")
                  : t("form:item-description-add")
              } ${t("form:menu-builder-description-help-text")}`}
              className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              {/* <Input
                {...register("id")}
                variant="outline"
                type="hidden"
                className="mb-5"
              />
               
              <Input
                {...register("path")}
                variant="outline"
                type="hidden"
                className="mb-5"
              /> */}
              <Input
                label={`${t("form:menu-builder-label")}*`}
                {...register("label")}
                variant="outline"
                className="mb-5"
              />
              <Label className="text-sm">Parent*</Label>

              <SelectInput
                {...register("parents")}
                control={control}
                getOptionLabel={(option: any) => option.label}
                getOptionValue={(option: any) => 
                  {
                    setParentState(option.id);
                    return option.id
                  }
                }
                // @ts-ignore
                options={parentData?.menuBuilder?.data.filter((x:any)=>x.id!=initialValues?.id && x.parent == 0)}
                isLoading={loadingParent}
              />
              <Input
                label={"Sequence"}
                {...register("sequence")}
                variant="outline"
                defaultValue={0}
                className="mb-5 mt-5"
              />
              {
              parentState
              ?
              <div>
              <Label className="mt-5">{"Type"}*</Label>
              <SelectInput
                {...register("types")}
                isRequired
                control={control}
                getOptionLabel={(option: any) => option.name}
                getOptionValue={(option: any) => 
                  {
                    setTypeState(option.id);
                    return option.id;
                  }
                }
                // @ts-ignore
                options={[
                  {id:"cat",name:"Category"},
                  {id:"col",name:"Sub Category"}
                ]}
                isLoading={loading}
              />
              </div>
              :<div></div>
}
              {
                typeState == "cat" ?
              <div>
              <Label className="mt-5">{t("form:input-label-categories")}*</Label>
              <SelectInput
                {...register("categories")}
                isRequired
                control={control}
                getOptionLabel={(option: any) => option.name}
                getOptionValue={(option: any) => option.id}
                options={data?.categories?.data || []}
                isLoading={loading}
              />
              </div>
              : <div></div>
}
{
                typeState == "col" && parentState ?
              <div>
              <Label className="mt-5">{"Sub Category"}*</Label>
              <SelectInput
                {...register("collections")}
                isRequired
                control={control}
                getOptionLabel={(option: any) => option.name}
                getOptionValue={(option: any) => option.id}
                options={tagData?.tags?.data || []}
                isLoading={loading}
              />
              </div>
              : <div></div>
}
              {
                parentState
              ?
                <div>
                <Label className="mt-5">{"Icon ( 50 x 50 )"}*</Label>
                <FileInput name="icon" control={control} multiple={false}/>
                {(initialValues?.icon?.original) ?
                <div className="mt-5">
                  <Label>On Server : </Label>
                <Image
					src={initialValues?.icon?.original ?? "/"}
					alt={'test'}
					layout="fixed"
					width={50}
					height={50}
					className="rounded overflow-hidden object-cover"
				/> 
        </div>
        : <span></span>
                }
                </div>
              :
                <div>
                <Label className="mt-5">{"Banners ( 400 x 300 )"}*</Label>
                <FileInput name="banners" control={control} />
                <Input
                label={"Banner Slug 1*"}
                {...register("bannerSlug1")}
                variant="outline"
                className="mt-5 mb-5"
              />
              <Input
                label={"Banner Slug 2*"}
                {...register("bannerSlug2")}
                variant="outline"
                className="mb-5"
              />
                </div>
              }
            </Card>
          </div>
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
                ? "Update Menu Builder"
                : t("form:button-label-add-menu-builder")}
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
}
