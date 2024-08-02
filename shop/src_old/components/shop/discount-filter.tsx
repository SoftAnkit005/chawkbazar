import { CheckBox } from "@components/ui/checkbox";
import { useRouter } from "next/router";
import React from "react";
import { useTranslation } from "next-i18next";
const discountFilterItems = [
	{
		id: "1",
		name: "0 to 10",
		slug: "0-10",
	},
	{
		id: "2",
		name: "10 to 20",
		slug: "10-20",
	},
	{
		id: "3",
		name: "20 to 30",
		slug: "20-30",
	},
	{
		id: "4",
		name: "30 to 40",
		slug: "30-40",
	},
	{
		id: "5",
		name: "40 to 50",
		slug: "40-50",
	},
	{
		id: "6",
		name: "50 to 60",
		slug: "50-60",
	},
	{
		id: "7",
		name: "60 to 70",
		slug: "60-70",
	},
	{
		id: "8",
		name: "70 to 80",
		slug: "70-80",
	},
	{
		id: "9",
		name: "80 to 90",
		slug: "80-90",
	},
	{
		id: "10",
		name: "90 to 100",
		slug: "90-100",
	}
];

export const DiscountFilter = () => {
	const { t } = useTranslation("common");
	const router = useRouter();
	const { pathname, query } = router;
	const selectedDiscounts = query?.discount ? [(query.discount as string).split(",")[(query.discount as string).split(",").length-1]] : [];
	const [formState, setFormState] = React.useState<string[]>(selectedDiscounts);
	React.useEffect(() => {
		setFormState(selectedDiscounts);
	}, [query?.discount]);
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
		const { discount, ...restQuery } = query;
		router.push(
			{
				pathname,
				query: {
					...restQuery,
					...(!!currentFormState.length
						? { discount: currentFormState[currentFormState.length-1] }
						: {}),
				},
			},
			undefined,
			{ scroll: false }
		);
	}
	const items = discountFilterItems;

	return (
		<div className="block border-b border-gray-300 pb-7 mb-7 m-1 bg-gray-300" style={{ padding: '10px' }}>
			<h3 className="text-heading text-sm md:text-base font-semibold mb-7 w-44">
				Discount (%)
			</h3>
			<hr className="border-b border-gray-800 mt-0" style={{ marginTop: '-20px', marginBottom: '20px' }} />
			<div className="mt-2 flex flex-col space-y-4">
				{/* {items?.map((item: any) => (
					<CheckBox
						key={item.id}
						label={item.name}
						name={item.name.toLowerCase()}
						checked={formState.includes(item.slug)}
						value={item.slug}
						onChange={handleItemClick}
					/>
				))} */}
				<select 
				className="px-4 my-1 h-10 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent bg-white"
                onChange={handleItemClick}
        >
          <option>Select...</option>
        {
          items?.map((item: any) => {
            return  <option value={item?.slug} selected={formState.includes(item?.slug)}>{item?.name}</option>
        })
	}     
        </select>
			</div>
		</div>
	);
};
