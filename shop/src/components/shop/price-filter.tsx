// import { CheckBox } from "@components/ui/checkbox";
// import { useRouter } from "next/router";
// import React from "react";
// import { useTranslation } from "next-i18next";
// const priceFilterItems = [
// 	{
// 		id: "1",
// 		name: "Under 5000",
// 		slug: "0-5000",
// 	},
// 	{
// 		id: "2",
// 		name: "5000 to 10000",
// 		slug: "5000-10000",
// 	},
// 	{
// 		id: "3",
// 		name: "10000 to 50000",
// 		slug: "10000-50000",
// 	},
// 	{
// 		id: "4",
// 		name: "50000 to 100000",
// 		slug: "50000-100000",
// 	},
// 	{
// 		id: "5",
// 		name: "100000 to 500000",
// 		slug: "100000-500000",
// 	},
// 	{
// 		id: "6",
// 		name: "Over 500000",
// 		slug: "500000+",
// 	},
// ];

// export const PriceFilter = () => {
// 	const { t } = useTranslation("common");
// 	const router = useRouter();
// 	const { pathname, query } = router;
// 	const selectedPrices = query?.price ? [(query.price as string).split(",")[(query.price as string).split(",").length-1]] : [];
// 	const [formState, setFormState] = React.useState<string[]>(selectedPrices);
// 	React.useEffect(() => {
// 		setFormState(selectedPrices);
// 	}, [query?.price]);
// 	function handleItemClick(e: React.FormEvent<HTMLInputElement>): void {
// 		const { value } = e.currentTarget;
// 		if(value.includes("Select"))
//     {
//       return;
//     }
// 		let currentFormState = formState.includes(value)
// 			? formState.filter((i) => i !== value)
// 			: [...formState, value];
// 		// setFormState(currentFormState);
// 		const { price, ...restQuery } = query;
// 		router.push(
// 			{
// 				pathname,
// 				query: {
// 					...restQuery,
// 					...(!!currentFormState.length
// 						? { price: currentFormState[currentFormState.length-1] }
// 						: {}),
// 				},
// 			},
// 			undefined,
// 			{ scroll: false }
// 		);
// 	}
// 	const items = priceFilterItems;

// 	return (
// 		<div className="block border-b border-gray-300 pb-7 mb-7 mx-auto my-4 bg-gray-300 rounded-lg" style={{ padding: "10px", maxWidth: "300px", margin: '1rem' }}>
// 			<h3 className="text-heading text-sm md:text-base font-semibold mb-7 w-44">
// 				{t("text-price")}
// 			</h3>
// 			<hr className="border-b border-gray-800 mt-0" style={{ marginTop: '-20px', marginBottom: '20px' }} />
// 			<div className="mt-2 flex flex-col space-y-4">
// 				{/* {items?.map((item: any) => (
// 					<CheckBox
// 						key={item.id}
// 						label={item.name}
// 						name={item.name.toLowerCase()}
// 						checked={formState.includes(item.slug)}
// 						value={item.slug}
// 						onChange={handleItemClick}
// 					/>
// 				))} */}
// 				<select 
// 				className="px-4 my-1 h-10 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent bg-white"
//                 onChange={handleItemClick}
//         >
//           <option>Select...</option>
//         {
//           items?.map((item: any) => {
//             return  <option value={item?.slug} selected={formState.includes(item?.slug)}>{item?.name}</option>
//         })
// 	}     
//         </select>
// 			</div>
// 		</div>
// 	);
// };
import { CheckBox } from "@components/ui/checkbox";
import { useRouter } from "next/router";
import React from "react";
import { useTranslation } from "next-i18next";
const priceFilterItems = [
	{
		id: "1",
		name: "Under 5000",
		slug: "0-5000",
	},
	{
		id: "2",
		name: "5000 to 10000",
		slug: "5000-10000",
	},
	{
		id: "3",
		name: "10000 to 50000",
		slug: "10000-50000",
	},
	{
		id: "4",
		name: "50000 to 100000",
		slug: "50000-100000",
	},
	{
		id: "5",
		name: "100000 to 500000",
		slug: "100000-500000",
	},
	{
		id: "6",
		name: "Over 500000",
		slug: "500000+",
	},
];

export const PriceFilter = () => {
	const { t } = useTranslation("common");
	const router = useRouter();
	const { pathname, query } = router;
	const selectedPrices = query?.price ? [(query.price as string).split(",")[(query.price as string).split(",").length-1]] : [];
	const [formState, setFormState] = React.useState<string[]>(selectedPrices);
	React.useEffect(() => {
		setFormState(selectedPrices);
	}, [query?.price]);
	function handleItemClick(e: React.FormEvent<HTMLInputElement>): void {
		const { value } = e.currentTarget;
		if(value.includes("Select"))
    {
      return;
    }
		let currentFormState = formState.includes(value)
			? formState.filter((i) => i !== value)
			: [...formState, value];
		// setFormState(currentFormState);
		const { price, ...restQuery } = query;
		router.push(
			{
				pathname,
				query: {
					...restQuery,
					...(!!currentFormState.length
						? { price: currentFormState[currentFormState.length-1] }
						: {}),
				},
			},
			undefined,
			{ scroll: false }
		);
	}
	const items = priceFilterItems;

	return (
		<div className="text-center border border-gray-300 border-t-0 p-5 col-span-6 lg:rounded-br-3xl">
			<div className="block mx-auto rounded-lg">
				<div className="flex flex-col space-y-4">
					<div className="flex items-center w-full lg:w-1/2 m-auto">
						<h3 className="text-black text-base font-bold mr-3"> {t("text-price")} </h3>
						<select 
							className="px-4 h-10 flex items-center w-full rounded text-black text-sm focus:outline-none focus:ring-0 border-none bg-gray-100"
							onChange={handleItemClick}>
								<option></option>
								{
								items?.map((item: any) => {
									return  <option value={item?.slug} selected={formState.includes(item?.slug)}>{item?.name}</option>
								})
							}     
						</select>
					</div>
				</div>
			</div>
		</div>
	);
};
