import Pagination from "@components/ui/pagination";
import { Table } from "@components/ui/table";
import ActionButtons from "@components/common/action-buttons";
import usePrice from "@utils/use-price";
import Badge from "@components/ui/badge/badge";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import {
	ImportedCsv,
	ImportedCsvPaginator,
	SortOrder,
} from "@ts-types/generated";
import { useIsRTL } from "@utils/locals";
import { useState } from "react";
import TitleWithSort from "@components/ui/title-with-sort";
import { useMeQuery } from "@data/user/use-me.query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";


export type IProps = {
	csvs?: ImportedCsvPaginator;
	onPagination: (current: number) => void;
	onSort: (current: any) => void;
	onOrder: (current: string) => void;
};

type SortingObjType = {
	sort: SortOrder;
	column: string | null;
};

const ImportedCsvList = ({ csvs, onPagination, onSort, onOrder }: IProps) => {
	const { data:me } = useMeQuery();
	const { data, paginatorInfo } = csvs! ?? {};
	const router = useRouter();
	const { t } = useTranslation();
	const { alignLeft, alignRight } = useIsRTL();
	const [sortingObj, setSortingObj] = useState<SortingObjType>({
		sort: SortOrder.Desc,
		column: null,
	});

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
			title: (
				<TitleWithSort
					title={
						"Shop"
					}
					ascending={
						sortingObj.sort === SortOrder.Asc && sortingObj.column === "shop_name"
					}
					isActive={sortingObj.column === "shop_name"}
				/>
			),
			className: "cursor-pointer",
			dataIndex: "shop_name",
			key: "shop_name",
			align: alignLeft,
			width: 250,
			ellipsis: true,
			onHeaderCell: () => onHeaderClick("shop_name"),
		},
		{
			title: "Csv Link",
			dataIndex: "csv_link",
			key: "csv_link",
			align: "center",
			render: (csv_link: string) => (
				<a target={"_blank"} href={"https://zweler.com/backend/storage/"+csv_link}>{csv_link.replace("csv-files/","")}</a>
			),
		},
		{
			title: "Status",
			className: "cursor-pointer",
			dataIndex: "status",
			key: "status",
			align: alignLeft,
			width: 250,
			render: (status: string) => (
				<Badge
					text={status}
					color={
						status.toLocaleLowerCase() === "waiting"
							? "bg-red-600"
							: "bg-accent"
					}
				/>
			),
		},
		{
			title: (
				<TitleWithSort
					title={
						"Updated On"
					}
					ascending={
						sortingObj.sort === SortOrder.Asc && sortingObj.column === "updated_at"
					}
					isActive={sortingObj.column === "updated_at"}
				/>
			),
			className: "cursor-pointer",
			dataIndex: "updated_at",
			key: "updated_at",
			align: alignLeft,
			width: 250,
			ellipsis: true,
			onHeaderCell: () => onHeaderClick("updated_at"),
			render: (date: string) => {
				dayjs.extend(relativeTime);
				dayjs.extend(utc);
				dayjs.extend(timezone);
				return (
					<span className="whitespace-nowrap">
						{dayjs.utc(date).tz(dayjs.tz.guess()).fromNow()}
					</span>
				);
			},
		},
		{
			title: t("table:table-item-actions"),
			dataIndex: "id",
			key: "actions",
			align: alignRight,
			render: (id: string, { shop_id, status }: any) => {
			  return (
				status == 'waiting' ? 
				<ActionButtons
				  id={id}
				  shop_id={shop_id}
				  approveSolitaireCsvButton={true}
				/>
				:<span></span>
			  );
			},
		  }

	];

	if (router?.query?.shop) {
		columns = columns?.filter((column) => column?.key !== "shop");
	}

	// if(me?.email != "zweler.web@gmail.com"){
	// 	columns = columns?.filter((column) => column?.key !== "price");
	// }

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

			{!!paginatorInfo.total && (
				<div className="flex justify-end items-center">
					<Pagination
						total={paginatorInfo.total}
						current={paginatorInfo.currentPage}
						pageSize={paginatorInfo.perPage}
						onChange={onPagination}
						showLessItems
					/>
				</div>
			)}
		</>
	);
};

export default ImportedCsvList;
