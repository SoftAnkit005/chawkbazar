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
import { toast } from "react-toastify";

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

const ProductList = ({ products, onPagination, onSort, onOrder }: IProps) => {
	console.log('products list',products);
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

	const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  	const [selectAll, setSelectAll] = useState(false);

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

	const handleSelectAll = () => {
		if (!selectAll) {
			let filtereddata = data?.filter((product: Product) => product.status !== "publish").map((i) => i.id)

			console.log(filtereddata)
			const numberArray: number[] = filtereddata.map(str => parseFloat(str));
			setSelectedProducts(numberArray || []);
		  
		} else {
		  setSelectedProducts([]);
		}
		setSelectAll(!selectAll);
		
	  };
	
	  const handleSelectProduct = (id: number) => {
		if (selectedProducts.includes(id)) {
		  setSelectedProducts(selectedProducts.filter((productId) => productId !== id));
		} else {
		  setSelectedProducts([...selectedProducts, id]);
		}
	  };
	  const handleActionButtonClick = async () => {
		try {
			const selectedIdsString = selectedProducts.join(",	");

			const formData = new FormData();
			formData.append('product_id', selectedIdsString);

			const response = await fetch('http://127.0.0.1:8000/multiple-publish-products', {
			method: 'POST',
			body: formData,
			});

			if (!response.ok) {
			throw new Error('Network response was not ok');
			}

			const responseData = await response.json();
			console.log('Response:', responseData);
			toast.success('Products published successfully');
			setSelectedProducts([]);
			setSelectAll(false);
			setTimeout(() => {
				window.location.reload();
			  }, 3000);

		} catch (error) {
			console.error('Error:', error);
			toast.error('Something went wrong');
		}
	};
	

	let columns = [
		{
			title: (
			  <input
				type="checkbox"
				checked={selectAll}
				onChange={handleSelectAll}
			  />
			),
			dataIndex: "select",
			key: "select",
			align: "center",
			width: 50,
			render: (text: any, record: Product) => (
				(record.status !== "publish")?
					<input
						type="checkbox"
						checked={selectedProducts.includes(record.id)}
						onChange={() => handleSelectProduct(record.id)}
					/>
				:
					<input
						type="checkbox"
						checked={selectedProducts.includes(record.id)}
						onChange={() => handleSelectProduct(record.id)}
						disabled
					/>
			),
		  },
		{
			title: t("table:table-item-image"),
			dataIndex: "image",
			key: "image",
			align: alignLeft,
			width: 74,
			render: (image: any, { name }: { name: string }) => (
				<Image
					src={image?.thumbnail ?? siteSettings.product.placeholder}
					alt={name}
					layout="fixed"
					width={42}
					height={42}
					className="rounded overflow-hidden object-cover"
				/>
			),
		},
		{
			title: (
				<TitleWithSort
					title={t("table:table-item-title")}
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
			width: 120,
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
			width: 120,
			ellipsis: true,
			onHeaderCell: () => onHeaderClick("stylecode"),
		},
		{
			title: t("table:table-item-group"),
			dataIndex: "type",
			key: "type",
			width: 120,
			align: "center",
			ellipsis: true,
			render: (type: any) => (
				<span className="whitespace-nowrap truncate">{type?.name}</span>
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
			title: "Product Type",
			dataIndex: "product_type",
			key: "product_type",
			width: 120,
			align: "center",
			render: (product_type: string) => (
				<span className="whitespace-nowrap truncate">{product_type}</span>
			),
		},
		{
			title: (
				<TitleWithSort
					title={t("table:table-item-unit")}
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
			width: 200,
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
					const { price } = usePrice({
						amount: value,
					});
					return (
						<span className="whitespace-nowrap" title={price}>
							{price}
						</span>
					);
				}
			},
		},
		{
			title: (
				<TitleWithSort
					title={t("table:table-item-quantity")}
					ascending={
						sortingObj.sort === SortOrder.Asc &&
						sortingObj.column === "quantity"
					}
					isActive={sortingObj.column === "quantity"}
				/>
			),
			className: "cursor-pointer",
			dataIndex: "quantity",
			key: "quantity",
			align: "center",
			width: 100,
			onHeaderCell: () => onHeaderClick("quantity"),
		},
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
			{selectedProducts.length > 0 && (
				<div className="border-transparent font-semibold text-light px-3 rounded bg-accent bottom-4 right-4 mb-5 ms-auto" style={{width:'fit-content'}}>
					<button className="btn btn-primary p-2" onClick={handleActionButtonClick}>
						Publish All
					</button>
				</div>
			)}

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

export default ProductList;
