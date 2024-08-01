import Input from "@components/ui/input";
import { useForm } from "react-hook-form";
import Button from "@components/ui/button";
import Description from "@components/ui/description";
import Card from "@components/common/card";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { CustomerType } from "@ts-types/generated";
import { useCreateCustomerTypeMutation } from "@data/customer-types/use-customer-type-create.mutation";
import { useUpdateCustomerTypeMutation } from "@data/customer-types/use-customer-type-update.mutation";
import { useState } from "react";
import Alert from "@components/ui/alert";
import { animateScroll } from "react-scroll";
import { customerTypeValidationSchema } from "@components/customer-type/customer_type-validation-schema";
import { yupResolver } from "@hookform/resolvers/yup";

type FormValues = {
  name?: string | null;
  values: any;
};

type IProps = {
  initialValues?: CustomerType | null;
};
export default function CreateOrUpdateCustomerTypeForm({ initialValues }: IProps) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: initialValues ? initialValues : { name: "" },
    resolver: yupResolver(customerTypeValidationSchema)
  });
  setValue("name",initialValues?.name || '');
  const { mutate: createCustomerType, isLoading: creating } =
    useCreateCustomerTypeMutation();
    const { mutate: updateCustomerType, isLoading: updating } =
    useUpdateCustomerTypeMutation();
  const onSubmit = (values: FormValues) => {
    if (!initialValues) {
      createCustomerType(
        {
          variables: {
            input: {
              name: values.name!,
            },
          },
        },
        {
          onError: (error: any) => {
            setErrorMessage(error?.response?.data?.message);
            animateScroll.scrollToTop();
          },
        }
      );
    } else {
      updateCustomerType({
        variables: {
          id: initialValues.id || '',
          input: {
            name: values.name!,
          },
        }
      },
      {
        onError: (error: any) => {
          setErrorMessage(error?.response?.data?.message);
          animateScroll.scrollToTop();
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap pb-8 border-b border-dashed border-border-base my-5 sm:my-8">
          <Description
            title={"Vendor Type"}
            details={`${
              initialValues
                ? t("form:item-description-update")
                : t("form:item-description-add")
            } ${"Vendor Type"}`}
            className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <Input
              label={t("form:input-label-name")}
              {...register("name")}
              defaultValue={initialValues?.name || ''}
              error={t(errors.name?.message!)}
              variant="outline"
              className="mb-5"
            />
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

          <Button loading={creating || updating}>
            {initialValues
              ? t("form:item-description-update")
              : t("form:item-description-add")}{" "}
            {"Vendor Type"}
          </Button>
        </div>
      </form>
    </>
  );
}
