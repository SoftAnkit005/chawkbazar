import Card from "@components/common/card";
import Layout from "@components/layouts/admin";
import Image from "next/image";
import { Table } from "@components/ui/table";
import ProgressBox from "@components/ui/progress-box/progress-box";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Button from "@components/ui/button";
import ErrorMessage from "@components/ui/error-message";
import { siteSettings } from "@settings/site.settings";
import usePrice from "@utils/use-price";
import { formatAddress } from "@utils/format-address";
import Loader from "@components/ui/loader/loader";
import ValidationError from "@components/ui/form-validation-error";
import { Attachment } from "@ts-types/generated";
import { useOrderQuery } from "@data/order/use-order.query";
import { useUpdateOrderMutation } from "@data/order/use-order-update.mutation";
import { useOrderStatusesQuery } from "@data/order-status/use-order-statuses.query";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import SelectInput from "@components/ui/select-input";
import { useIsRTL } from "@utils/locals";
import Input from "@components/ui/input";

const OrderItemList = (_: any, record: any) => {
  let name = record.name;
  if (record?.pivot?.variation_option_id) {
    const variationTitle = record?.variation_options?.find(
      (vo: any) => vo?.id === record?.pivot?.variation_option_id
    )["title"];
    name = `${name} - ${variationTitle}`;
  }
  return (
    <div className="flex items-center">
      <div className="flex mb-2 text-body">
          <span className="text-[15px] truncate inline-block overflow-hidden">
            {name} - <b>{record.stylecode}</b> x&nbsp;
          </span>
          <span className="text-[15px] text-heading font-semibold truncate inline-block overflow-hidden">
            {record.unit > 0 ? record.unit : record.quantity}
          </span>
        </div>
    </div>
  );
};

type FormValues = {
	order_status: any;
	tracking_number:string;
	courier:string;
};
export default function OrderDetailsPage() {
	const { t } = useTranslation();
	const { query } = useRouter();
	const { alignLeft, alignRight } = useIsRTL();
	const { mutate: updateOrder, isLoading: updating } = useUpdateOrderMutation();
	const { data: orderStatusData } = useOrderStatusesQuery({});
	const {
		data,
		isLoading: loading,
		error,
	} = useOrderQuery(query.orderId as string);

	const {
		handleSubmit,
		control,
		register,
		formState: { errors },
	} = useForm<FormValues>({
		defaultValues: { 
			order_status: data?.order?.status?.id ?? "",
			tracking_number: data?.order?.tracking_number,
			courier:data?.order?.courier
		},
	});
	const ChangeStatus = ({ order_status, tracking_number, courier }: FormValues) => {
		updateOrder({
			variables: {
				id: data?.order?.id as string,
				input: {
					status: (order_status?.id || 1) as string,
					tracking_number,
					courier,
				},
			},
		});
	};
	const { price: subtotal } = usePrice(
		data && {
			amount: data?.order?.amount!,
		}
	);
	const { price: total } = usePrice(
		data && {
			amount: data?.order?.paid_total!,
		}
	);
	const { price: discount } = usePrice(
		data && {
			amount: data?.order?.discount!,
		}
	);
	const { price: delivery_fee } = usePrice(
		data && {
			amount: data?.order?.delivery_fee!,
		}
	);
	const { price: sales_tax } = usePrice(
		data && {
			amount: data?.order?.sales_tax!,
		}
	);
	if (loading) return <Loader text={t("common:text-loading")} />;
	if (error) return <ErrorMessage message={error.message} />;

	const columns = [
		{
			dataIndex: "image",
			key: "image",
			width: 70,
			render: (image: Attachment) => (
				<Image
					src={image?.thumbnail ?? siteSettings.product.placeholder}
					alt="alt text"
					layout="fixed"
					width={50}
					height={50}
				/>
			),
		},
		{
			title: t("table:table-item-products"),
			dataIndex: "name",
			key: "name",
			align: alignLeft, 
			render: OrderItemList,
		},
		{
			title: t("table:table-item-total"),
			dataIndex: "price",
			key: "price",
			align: alignRight,
			render: (_: any, item: any) => {
				const { price } = usePrice({
					amount: parseFloat(item.pivot.subtotal),
				});
				return <span>{price}</span>;
			},
		},
	];

	return (
		<Card>
			<div className="flex flex-col items-center lg:flex-row">
				<h3 className="w-full mb-8 text-2xl font-semibold text-center text-heading lg:text-start lg:w-1/3 lg:mb-0 whitespace-nowrap">
					{t("form:input-label-order-id")} - {data?.order?.tracking_number}
				</h3>

				<form
					onSubmit={handleSubmit(ChangeStatus)}
					className="flex items-start w-full ms-auto lg:w-2/4"
				>
					<div className="z-20 w-full me-5">
						<SelectInput
							name="order_status"
							control={control}
							getOptionLabel={(option: any) => option.name}
							getOptionValue={(option: any) => option.id}
							options={orderStatusData?.order_statuses?.data}
							placeholder={t("form:input-placeholder-order-status")}
						/>

						<ValidationError message={t(errors?.order_status?.message)} />
					<Input
					label="Tracking Number"
					defaultValue={data?.order?.tracking_number}
					{...register("tracking_number")}
					/>
					<Input
					label="Courier Name"
					defaultValue={data?.order?.courier}
					{...register("courier")}
					/>
					</div>
					<Button loading={updating}>
						<span className="hidden sm:block">
							{t("form:button-label-change-status")}
						</span>
						<span className="block sm:hidden">
							{t("form:button-label-change")}
						</span>
					</Button>
				</form>
			</div>

			<div className="flex items-center justify-center my-5 lg:my-10">
				<ProgressBox
					data={orderStatusData?.order_statuses?.data}
					status={data?.order?.status?.serial!}
				/>
			</div>

			<div className="mb-10">
				{data?.order ? (
					<Table
						//@ts-ignore
						columns={columns}
						emptyText={t("table:empty-table-data")}
						data={data?.order?.products!}
						rowKey="id"
						scroll={{ x: 300 }}
					/>
				) : (
					<span>{t("common:no-order-found")}</span>
				)}

				<div className="flex flex-col w-full px-4 py-4 space-y-2 border-t-4 border-double border-border-200 sm:w-1/2 md:w-1/3 ms-auto">
					<div className="flex items-center justify-between text-sm text-body">
						<span>{t("common:order-sub-total")}</span>
						<span>{subtotal}</span>
					</div>
					<div className="flex items-center justify-between text-sm text-body">
						<span>{t("common:order-tax")}</span>
						<span>{sales_tax}</span>
					</div>
					<div className="flex items-center justify-between text-sm text-body">
						<span>{t("common:order-delivery-fee")}</span>
						<span>{delivery_fee}</span>
					</div>
					<div className="flex items-center justify-between text-sm text-body">
						<span>{t("common:order-discount")}</span>
						<span>{discount}</span>
					</div>
					<div className="flex items-center justify-between text-base font-semibold text-heading">
						<span>{t("common:order-total")}</span>
						<span>{total}</span>
					</div>
				</div>
			</div>

			<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
				<div className="w-full mb-10 sm:w-1/2 sm:pe-8 sm:mb-0">
					<h3 className="pb-2 mb-3 font-semibold border-b text-heading border-border-200">
						{t("common:billing-address")}
					</h3>

					<div className="flex flex-col items-start space-y-1 text-sm text-body">
						<span>{data?.order?.customer?.name}</span>
						{data?.order?.billing_address && (
							<span>{formatAddress(data.order.billing_address)}</span>
						)}
						{data?.order?.customer_contact && (
							<span>{data?.order?.customer_contact}</span>
						)}
					</div>
				</div>

				<div className="w-full sm:w-1/2 sm:ps-8">
					<h3 className="pb-2 mb-3 font-semibold border-b text-heading text-start sm:text-end border-border-200">
						{t("common:shipping-address")}
					</h3>

					<div className="flex flex-col items-start space-y-1 text-sm text-body text-start sm:text-end sm:items-end">
						<span>{data?.order?.customer?.name}</span>
						{data?.order?.shipping_address && (
							<span>{formatAddress(data.order.shipping_address)}</span>
						)}
						{data?.order?.customer_contact && (
							<span>{data?.order?.customer_contact}</span>
						)}
					</div>
				</div>
			</div>
		</Card>
	);
}
OrderDetailsPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ["common", "form", "table"])),
	},
});