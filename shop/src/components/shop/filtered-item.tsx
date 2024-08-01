// import { useRouter } from "next/router";
// import { IoClose } from "@react-icons/all-files/io5/IoClose";
// import isEmpty from "lodash/isEmpty";

// interface Props {
// 	itemKey: string;
// 	itemValue: string;
// }

// export const FilteredItem = ({ itemKey, itemValue }: Props) => {
// 	const router = useRouter();
// 	const { pathname, query } = router;

// 	function handleClose() {
// 		let item = (query[itemKey]! as string) + '';
// 		const currentItem = item?.split(",")?.filter((i) => i !== itemValue);
// 		delete query[itemKey];
// 		router.push({
// 			pathname,
// 			query: {
// 				...query,
// 				...(!isEmpty(currentItem) ? { [itemKey]: currentItem.join(",") } : {}),
// 			},
// 		});
// 	}
// 	return (
// 		<div
// 			className="group flex flex-shrink-0 m-1.5 items-center border border-gray-300 bg-borderBottom rounded-lg text-xs px-3.5 py-2.5 capitalize text-heading cursor-pointer transition duration-200 ease-in-out hover:border-heading"
// 			onClick={handleClose}
// 		>
// 			{itemValue}
// 			<IoClose className="text-sm text-body ltr:ml-2 rtl:mr-2 flex-shrink-0 ltr:-mr-0.5 rtl:-ml-0.5 mt-0.5 transition duration-200 ease-in-out group-hover:text-heading" />
// 		</div>
// 	);
// };
import { useRouter } from "next/router";
import { IoClose } from "@react-icons/all-files/io5/IoClose";
import isEmpty from "lodash/isEmpty";

interface Props {
	itemKey: string;
	itemValue: string;
	filterType:string;
	filterChanged:any;
}

export const FilteredItem = ({ itemKey, itemValue, filterType, filterChanged }: Props) => {
	const router = useRouter();
	const { pathname, query } = router;

	function handleClose() {
		let item = (query[itemKey]! as string) + '';
		const currentItem = item?.split(",")?.filter((i) => i !== itemValue);
		delete query[itemKey];
		router.push({
			pathname,
			query: {
				...query,
				...(!isEmpty(currentItem) ? { [itemKey]: currentItem.join(",") } : {}),
			},
		}, undefined, { scroll: false });

		if(filterChanged !== undefined){
			filterChanged(itemValue);
		}
	}
	return (
		<>
			{filterType === "solitaire" ? 
				<div onClick={handleClose} className="group flex flex-shrink-0 m-1.5 items-center text-xs capitalize text-heading cursor-pointer transition duration-200 ease-in-out" >
					<span className="px-2 bg-[#24182E] border border-[#24182E] text-white py-2 hover:border-heading rounded-l-lg">{itemKey}</span>
					<span className="px-2 py-2 flex border border-[#24182E] fw-semibold hover:shadow-md rounded-r-lg">
						{itemValue}
						<IoClose className="text-sm text-body ltr:ml-2 rtl:mr-2 flex-shrink-0 ltr:-mr-0.5 rtl:-ml-0.5 mt-0.5 transition duration-200 ease-in-out group-hover:text-heading" />
					</span>
				</div>
			:
				<div
					className="group flex flex-shrink-0 m-1.5 items-center border border-gray-300 bg-borderBottom rounded-lg text-xs px-3.5 py-2.5 capitalize text-heading cursor-pointer transition duration-200 ease-in-out hover:border-heading"
					onClick={handleClose}
				>
					{itemValue}
					<IoClose className="text-sm text-body ltr:ml-2 rtl:mr-2 flex-shrink-0 ltr:-mr-0.5 rtl:-ml-0.5 mt-0.5 transition duration-200 ease-in-out group-hover:text-heading" />
				</div>
			}
		</>
	);
};
