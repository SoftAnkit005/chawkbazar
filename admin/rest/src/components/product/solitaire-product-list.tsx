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
	Product,
	ProductPaginator,
	ProductType,
	Shop,
	SortOrder,
} from "@ts-types/generated";
import { useIsRTL } from "@utils/locals";
import { useState } from "react";
import TitleWithSort from "@components/ui/title-with-sort";
import { useMeQuery } from "@data/user/use-me.query";

export type IProps = {
	products?: ProductPaginator;
	onPagination: (current: number) => void;
	onSort: (current: any) => void;
	onOrder: (current: string) => void;
};

type SortingObjType = {
	sort: SortOrder;
	column: string | null;
};

const SolitaireProductList = ({ products, onPagination, onSort, onOrder }: IProps) => {
	const { data:me } = useMeQuery();
	setInterval(()=>{
		clearInterval(Number(localStorage.getItem("refreshIntervalId")));
	},1000);
	function clearBeforeEdit(){
		localStorage.clear();
		localStorage.setItem("counterMulti","0");
		localStorage.setItem("multiDiamondArr",JSON.stringify([]));
	}
	const { data, paginatorInfo } = products! ?? {};
	const router = useRouter();
	const { t } = useTranslation();
	const { alignLeft, alignRight } = useIsRTL();
	localStorage.setItem("multiDiamondArr",JSON.stringify([]));
	["Diamond","Precious Stones","Gold","Silver","Platinum","selectedAttributeValueMain","selectedAttributeValue","selectedAttributeName","Metal Tone"].map((s)=>{
		localStorage.removeItem(s);
	})
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
						"Name"
					}
					ascending={
						sortingObj.sort === SortOrder.Asc && sortingObj.column === "name"
					}
					isActive={sortingObj.column === "name"}
				/>
			),
			className: "cursor-pointer",
			dataIndex: "name",
			key: "name",
			align: alignLeft,
			width: 200,
			ellipsis: true,
			onHeaderCell: () => onHeaderClick("name"),
		},
		{
			title: (
				<TitleWithSort
					title={
						"Style Code"
					}
					ascending={
						sortingObj.sort === SortOrder.Asc && sortingObj.column === "stylecode"
					}
					isActive={sortingObj.column === "stylecode"}
				/>
			),
			className: "cursor-pointer",
			dataIndex: "stylecode",
			key: "stylecode",
			align: alignLeft,
			width: 200,
			ellipsis: true,
			onHeaderCell: () => onHeaderClick("stylecode"),
		},
		{
			title: (
				<TitleWithSort
					title={
						"Shape"
					}
					ascending={
						sortingObj.sort === SortOrder.Asc && sortingObj.column === "shape"
					}
					isActive={sortingObj.column === "shape"}
				/>
			),
			className: "cursor-pointer",
			dataIndex: "shape",
			key: "shape",
			align: alignLeft,
			width: 120,
			ellipsis: true,
			onHeaderCell: () => onHeaderClick("shape"),
		},
		{
			title: (
				<TitleWithSort
					title={
						"Size"
					}
					ascending={
						sortingObj.sort === SortOrder.Asc && sortingObj.column === "size"
					}
					isActive={sortingObj.column === "size"}
				/>
			),
			className: "cursor-pointer",
			dataIndex: "size",
			key: "size",
			align: alignLeft,
			width: 120,
			ellipsis: true,
			onHeaderCell: () => onHeaderClick("size"),
		},
		{
			title: (
				<TitleWithSort
					title={
						"Color"
					}
					ascending={
						sortingObj.sort === SortOrder.Asc && sortingObj.column === "color"
					}
					isActive={sortingObj.column === "color"}
				/>
			),
			className: "cursor-pointer",
			dataIndex: "color",
			key: "color",
			align: alignLeft,
			width: 120,
			ellipsis: true,
			onHeaderCell: () => onHeaderClick("color"),
		},
		{
			title: (
				<TitleWithSort
					title={
						"Clarity"
					}
					ascending={
						sortingObj.sort === SortOrder.Asc && sortingObj.column === "clarity"
					}
					isActive={sortingObj.column === "clarity"}
				/>
			),
			className: "cursor-pointer",
			dataIndex: "clarity",
			key: "clarity",
			align: alignLeft,
			width: 120,
			ellipsis: true,
			onHeaderCell: () => onHeaderClick("clarity"),
		},
		{
			title: (
				<TitleWithSort
					title={
						"Cut"
					}
					ascending={
						sortingObj.sort === SortOrder.Asc && sortingObj.column === "cut"
					}
					isActive={sortingObj.column === "cut"}
				/>
			),
			className: "cursor-pointer",
			dataIndex: "cut",
			key: "cut",
			align: alignLeft,
			width: 120,
			ellipsis: true,
			onHeaderCell: () => onHeaderClick("cut"),
		},
		{
			title: (
				<TitleWithSort
					title={
						"Polish"
					}
					ascending={
						sortingObj.sort === SortOrder.Asc && sortingObj.column === "polish"
					}
					isActive={sortingObj.column === "polish"}
				/>
			),
			className: "cursor-pointer",
			dataIndex: "polish",
			key: "polish",
			align: alignLeft,
			width: 120,
			ellipsis: true,
			onHeaderCell: () => onHeaderClick("polish"),
		},
		{
			title: (
				<TitleWithSort
					title={
						"Symmetry"
					}
					ascending={
						sortingObj.sort === SortOrder.Asc && sortingObj.column === "symmetry"
					}
					isActive={sortingObj.column === "symmetry"}
				/>
			),
			className: "cursor-pointer",
			dataIndex: "symmetry",
			key: "symmetry",
			align: alignLeft,
			width: 120,
			ellipsis: true,
			onHeaderCell: () => onHeaderClick("symmetry"),
		},
		{
			title: (
				<TitleWithSort
					title={
						"Fluorescence"
					}
					ascending={
						sortingObj.sort === SortOrder.Asc && sortingObj.column === "fluorescence"
					}
					isActive={sortingObj.column === "fluorescence"}
				/>
			),
			className: "cursor-pointer",
			dataIndex: "fluorescence",
			key: "fluorescence",
			align: alignLeft,
			width: 150,
			ellipsis: true,
			onHeaderCell: () => onHeaderClick("fluorescence"),
		},
		{
			title: (
				<TitleWithSort
					title={
						"Grading"
					}
					ascending={
						sortingObj.sort === SortOrder.Asc && sortingObj.column === "grading"
					}
					isActive={sortingObj.column === "grading"}
				/>
			),
			className: "cursor-pointer",
			dataIndex: "grading",
			key: "grading",
			align: alignLeft,
			width: 120,
			ellipsis: true,
			onHeaderCell: () => onHeaderClick("grading"),
		},
		{
			title: (
				<TitleWithSort
					title={
						"Location"
					}
					ascending={
						sortingObj.sort === SortOrder.Asc && sortingObj.column === "location"
					}
					isActive={sortingObj.column === "location"}
				/>
			),
			className: "cursor-pointer",
			dataIndex: "location",
			key: "location",
			align: alignLeft,
			width: 120,
			ellipsis: true,
			onHeaderCell: () => onHeaderClick("location"),
		},
		{
			title: "Image Link",
			className: "cursor-pointer",
			dataIndex: "image_link",
			key: "image_link",
			align: alignLeft,
			width: 200,
			ellipsis: true,
			render: (image_link:string) => (
				<a href={image_link}>
					<span className="whitespace-nowrap truncate">{image_link}</span>
				</a>
			),
		},
		{
			title: 	"Video Link",
			className: "cursor-pointer",
			dataIndex: "video_link",
			key: "video_link",
			align: alignLeft,
			width: 200,
			ellipsis: true,
			render: (video_link:string) => (
				<a href={video_link}>
					<span className="whitespace-nowrap truncate">{video_link}</span>
				</a>
			),
		},
		{
			title: "Certificate Link",
			className: "cursor-pointer",
			dataIndex: "certificate_link",
			key: "certificate_link",
			align: alignLeft,
			width: 200,
			ellipsis: true,
			render: (certificate_link:string) => (
				<a href={certificate_link}>
					<span className="whitespace-nowrap truncate">{certificate_link}</span>
				</a>
			),
		},
		{
			title: "Certificate Number",
			className: "cursor-pointer",
			dataIndex: "cert_no",
			key: "cert_no",
			align: alignLeft,
			width: 200,
			ellipsis: true,
			render: (cert_no:string) => (
				<a href={cert_no}>
					<span className="whitespace-nowrap truncate">{cert_no}</span>
				</a>
			),
		},
		{
			title: t("table:table-item-shop"),
			dataIndex: "shop",
			key: "shop",
			width: 120,
			align: "center",
			ellipsis: true,
			render: (shop: Shop) => (
				<span className="whitespace-nowrap truncate">{shop?.name}</span>
			),
		},
		{
			title:"Discount %",
			className: "cursor-pointer",
			dataIndex: "discount",
			key: "discount",
			align: alignRight,
			width: 120,
			ellipsis: true,
			render: (discount:number,{commission}) => (
				<span className="whitespace-nowrap truncate">{
					me?.email != "zweler.web@gmail.com"
					?(discount == null ? "" : discount - (Number(commission) || 0))
					:(discount == null ? "" : discount)
					+" %"}</span>
			),
		},
		{
			title:"Rate Per Ct ($)",
			className: "cursor-pointer",
			dataIndex: "rate_per_unit",
			key: "rate_per_unit",
			align: alignRight,
			width: 120,
			ellipsis: true,
			render: (rate_per_unit:number,{rate_per_unit_before_commission}) => (
				<span className="whitespace-nowrap truncate">
					{
				me?.email != "zweler.web@gmail.com"
				?(rate_per_unit_before_commission == null ? "" : rate_per_unit_before_commission.toFixed(2))
				:(rate_per_unit == null ? "" : rate_per_unit.toFixed(2))
				}
				</span>
			),
			
		},
		{
			title: (
				<TitleWithSort
					title={t("table:table-item-unit") + " ($)"}
					ascending={
						sortingObj.sort === SortOrder.Asc && sortingObj.column === "price"
					}
					isActive={sortingObj.column === "price"}
				/>
			),
			className: "cursor-pointer",
			dataIndex: "price",
			key: "price",
			align: alignRight,
			width: 120,
			onHeaderCell: () => onHeaderClick("price"),
			render: (value: number, record: Product) => {
				if (record?.product_type === ProductType.Variable) {
					const { price: max_price } = usePrice({
						amount: record?.max_price as number,
					});
					const { price: min_price } = usePrice({
						amount: record?.min_price as number,
					});
					return (
						<span
							className="whitespace-nowrap"
							title={`${min_price} - ${max_price}`}
						>{`${min_price} - ${max_price}`}</span>
					);
				} else {
					return (
						<span className="whitespace-nowrap">
							{
				me?.email != "zweler.web@gmail.com"
				? (Number(record?.rate_per_unit_before_commission || 0) * record?.size)
				: value.toFixed(2)
							}
						</span>
					);
				}
			},
		},
		// {
		// 	title: (
		// 		<TitleWithSort
		// 			title={t("table:table-item-quantity")}
		// 			ascending={
		// 				sortingObj.sort === SortOrder.Asc &&
		// 				sortingObj.column === "quantity"
		// 			}
		// 			isActive={sortingObj.column === "quantity"}
		// 		/>
		// 	),
		// 	className: "cursor-pointer",
		// 	dataIndex: "quantity",
		// 	key: "quantity",
		// 	align: "center",
		// 	width: 100,
		// 	onHeaderCell: () => onHeaderClick("quantity"),
		// },
		{
			title: t("table:table-item-status"),
			dataIndex: "status",
			key: "status",
			align: "center",
			width: 100,
			render: (status: string) => (
				<Badge
					text={status}
					color={
						status.toLocaleLowerCase() === "draft"
							? "bg-yellow-400"
							: "bg-accent"
					}
				/>
			),
		},
		{
			title: t("table:table-item-actions"),
			dataIndex: "slug",
			key: "actions",
			align: "center",
			width: 80,
			render: (slug: string, record: Product) => (
				<span onClick={clearBeforeEdit} >
				<ActionButtons
					id={record?.id}
					editUrl={`${router.asPath}/${slug}/edit`}
					deleteModalView="DELETE_PRODUCT"
				/>
				</span>
			),
		},
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

			{!!paginatorInfo?.total && (
				<div className="flex justify-end items-center">
					<Pagination
						total={paginatorInfo?.total}
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

export default SolitaireProductList;
