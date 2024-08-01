import Pagination from "@components/ui/pagination";
import Image from "next/image";
import { Table } from "@components/ui/table";
import ActionButtons from "@components/common/action-buttons";
import { siteSettings } from "@settings/site.settings";
import usePrice from "@utils/use-price";
import Badge from "@components/ui/badge/badge";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import {
  BannerPaginator,
	Product,
	ProductPaginator,
	ProductType,
	Shop,
	SortOrder,
} from "@ts-types/generated";
import { useIsRTL } from "@utils/locals";
import { useState } from "react";
import TitleWithSort from "@components/ui/title-with-sort";

export type IProps = {
	banners?: BannerPaginator;
	onPagination: (current: number) => void;
	onSort: (current: any) => void;
	onOrder: (current: string) => void;
};

type SortingObjType = {
	sort: SortOrder;
	column: string | null;
};

const BannerList = ({ banners, onPagination, onSort, onOrder }: IProps) => {
  const { data, paginatorInfo } = banners! ?? {};
	const router = useRouter();
	const { t } = useTranslation();
	const { alignLeft, alignRight } = useIsRTL();

	const [sortingObj, setSortingObj] = useState<SortingObjType>({
		sort: SortOrder.Desc,
		column: null,
	});
  console.log("data", data);
  
	const onHeaderClick = (column: string | null) => ({
		onClick: () => {
			onSort((currentSortDirection: SortOrder) =>
				currentSortDirection === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc
			);
			onOrder(column!);

			setSortingObj({
				sort:
					sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
				column: column,
			});
		},
	});
  
	let columns = [
		{
			title: t("table:table-item-banner-mobile-image"),
			dataIndex: "imageMobileUrl",
			key: "imageMobileUrl",
			align: alignLeft,
			width: 74,
			render: (imageMobileUrl: any, { name }: { name: string }) => (
        <>
        <Image
					src={imageMobileUrl ?? "/"}
					alt={'test'}
					layout="fixed"
					width={42}
					height={42}
					className="rounded overflow-hidden object-cover"
				/>
        </>
			),
		},
		{
			title: t("table:table-item-banner-desktop-image"),
			dataIndex: "imageDesktopUrl",
			key: "imageDesktopUrl",
			align: alignLeft,
			width: 74,
			render: (imageDesktopUrl: any, { name }: { name: string }) => (
				<Image
					src={imageDesktopUrl ?? "/"}
					alt={'test'}
					layout="fixed"
					width={42}
					height={42}
					className="rounded overflow-hidden object-cover"
				/>
			),
		},
		{
			title: t("table:table-item-banner-title"),
			dataIndex: "title",
			key: "title",
			width: 120,
			align: "center",
			ellipsis: true,
			render: (title: any) => (
				<span className="whitespace-nowrap truncate">{title}</span>
			),
		},
		{
			title: "Type",
			dataIndex: "type",
			key: "type",
			width: 120,
			align: "center",
			ellipsis: true,
			render: (type: any) => (
				<span className="whitespace-nowrap truncate">{type}</span>
			),
		},
		{
			title: t("table:table-item-banner-sub-type"),
			dataIndex: "bannerType",
			key: "bannerType",
			width: 120,
			align: "center",
			ellipsis: true,
			render: (bannerType: any) => (
				<span className="whitespace-nowrap truncate">{bannerType}</span>
			),
		},
		{
			title: "Sequence",
			dataIndex: "sequence",
			key: "sequence",
			width: 120,
			align: "center",
			ellipsis: true,
			render: (sequence: any) => (
				<span className="whitespace-nowrap truncate">{sequence}</span>
			),
		},
		{
			title: t("table:table-item-banner-slug"),
			dataIndex: "slug",
			key: "slug",
			width: 120,
			align: "center",
			ellipsis: true,
			render: (slug: any) => (
				<span className="whitespace-nowrap truncate">{slug}</span>
			),
		},
    {
			title: t("table:table-item-actions"),
			dataIndex: "id",
			key: "actions",
			align: "center",
			width: 80,
			render: (id: string, record: Product) => (
				<ActionButtons
					id={record?.id}
					editUrl={`${router.asPath}/${id}/edit`}
					deleteModalView="DELETE_BANNER"
				/>
			),
		},
	];

	if (router?.query?.shop) {
		columns = columns?.filter((column) => column?.key !== "shop");
	}

	return (
		<>
			<div className="rounded overflow-hidden shadow mb-6">
				<Table
					/* @ts-ignore */
					columns={columns}
					emptyText={t("table:empty-table-data")}
					data={data}
					rowKey="id"
					scroll={{ x: 900 }}
				/>
			</div>

			{/* {!!paginatorInfo.total && (
				<div className="flex justify-end items-center">
					<Pagination
						total={paginatorInfo.total}
						current={paginatorInfo.currentPage}
						pageSize={paginatorInfo.perPage}
						onChange={onPagination}
						showLessItems
					/>
				</div>
			)} */}
		</>
	);
};

export default BannerList
