import { useState } from "react";
import { Table } from "@components/ui/table";
import ActionButtons from "@components/common/action-buttons";
import { Attribute, SortOrder } from "@ts-types/generated";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import TitleWithSort from "@components/ui/title-with-sort";
import { uniq } from "lodash";

export type IProps = {
	attributes: Attribute[] | undefined;
	onSort: (current: any) => void;
	onOrder: (current: string) => void;
};
const AttributeList = ({ attributes, onSort, onOrder }: IProps) => {
	const { t } = useTranslation();
	const router = useRouter();

	const alignLeft =
		router.locale === "ar" || router.locale === "he" ? "right" : "left";
	const alignRight =
		router.locale === "ar" || router.locale === "he" ? "left" : "right";

	const [sortingObj, setSortingObj] = useState<{
		sort: SortOrder;
		column: string | null;
	}>({
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
			title: t("table:table-item-id"),
			dataIndex: "id",
			key: "id",
			align: "center",
			width: 60,
		},
		{
			// title: t("table:table-item-title"),
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
			width: 60,
			onHeaderCell: () => onHeaderClick("name"),
			render: (name: any) => <span className="whitespace-nowrap">{name}</span>,
		},
		{
			title: t("table:table-item-values"),
			dataIndex: "values",
			key: "values",
			align: alignLeft,
			render: (values: any) => {
				values = values.map((v:any)=>{
					return v.value;
				})
				values = uniq(values);
				values = values?.map((singleValues: any, index: number) => {
					return index > 0
						? ((singleValues) ? `, ${singleValues}` : "")
						: `${singleValues}`;
				})
				return (
					<span className="block truncate">
						{
							values.length > 10 ? values.toString().substring(0,100)+"..." : values
						}
					</span>
				);
			},
		},
		{
			title: t("table:table-item-actions"),
			dataIndex: "id",
			key: "actions",
			align: alignRight,
			render: (id: string) => (
				<ActionButtons
					id={id}
					editUrl={`${router.asPath}/${id}/edit`}
					deleteModalView={ Number(id) > 50 ? "DELETE_ATTRIBUTE" : ""}
				/>
			),
		},
	];

	if (router?.query?.shop) {
		columns = columns?.filter((column) => column?.key !== "shop");
	}
	return (
		<div className="rounded overflow-hidden shadow mb-8">
			<Table
				// @ts-ignore
				columns={columns}
				emptyText={t("table:empty-table-data")}
				data={attributes}
				rowKey="id"
				scroll={{ x: 380 }}
			/>
		</div>
	);
};

export default AttributeList;
