import { Table } from "@components/ui/table";
import ActionButtons from "@components/common/action-buttons";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import {
  MenuBuilderPaginator,
	MenuBuilder
} from "@ts-types/generated";

export type IProps = {
	menuBuilders?: MenuBuilderPaginator;
	onPagination: (current: number) => void;
	onSort: (current: any) => void;
	onOrder: (current: string) => void;
};

const MenuBuilderList = ({ menuBuilders}: IProps) => {
  const { data, paginatorInfo } = menuBuilders! ?? {};
	const router = useRouter();
	const { t } = useTranslation();
  
	let columns = [
		{
			title: "Id",
			dataIndex: "id",
			key: "id",
			width: 120,
			align: "center",
			ellipsis: true,
			render: (id: any) => (
				<span className="whitespace-nowrap truncate">{id}</span>
			),
		},
		{
			title: t("table:table-item-menu-builder-label"),
			dataIndex: "label",
			key: "label",
			width: 120,
			align: "center",
			ellipsis: true,
			render: (label: any) => (
				<span className="whitespace-nowrap truncate">{label}</span>
			),
		},
		{
			title: "Parent",
			dataIndex: "parentName",
			key: "parentName",
			width: 120,
			align: "center",
			ellipsis: true,
			render: (parentName: any) => (
				<span className="whitespace-nowrap truncate">{parentName || "-"}</span>
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
				<span className="whitespace-nowrap truncate">{sequence || 0}</span>
			),
		},
		{
			title: t("table:table-item-menu-builder-category-name"),
			dataIndex: "categoryName",
			key: "categoryName",
			width: 120,
			align: "center",
			ellipsis: true,
			render: (categoryName: any) => (
				<span className="whitespace-nowrap truncate">{categoryName || "-"}</span>
			),
		},
		{
			title: `Sub ${t("table:table-item-menu-builder-category-name")}`,
			dataIndex: "tagName",
			key: "tagName",
			width: 120,
			align: "center",
			ellipsis: true,
			render: (tagName: any) => (
				<span className="whitespace-nowrap truncate">{tagName || "-"}</span>
			),
		},
		{
			title: "Slug",
			dataIndex: "path",
			key: "path",
			width: 120,
			align: "center",
			ellipsis: true,
			render: (path: any) => (
				<span className="whitespace-nowrap truncate">{path?.replaceAll("/search?category=","").replaceAll("/collections/","") || "-"}</span>
			),
		},
   		{
			title: t("table:table-item-actions"),
			dataIndex: "id",
			key: "actions",
			align: "center",
			width: 80,
			render: (id: string, record: MenuBuilder) => (
				<ActionButtons
					id={record?.id}
					editUrl={`${router.asPath}/${id}/edit`}
					deleteModalView="DELETE_MENU_BUILDER"
				/>
			),
		},
	];

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
		</>
	);
};

export default MenuBuilderList
