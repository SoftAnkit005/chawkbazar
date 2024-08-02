import { CheckBox } from "@components/ui/checkbox";
import { useRouter } from "next/router";
import React from "react";
import { useTranslation } from "next-i18next";
import { Attribute, AttributeValue } from "@framework/types";

type Props = {
  attribute: Attribute
}

export const ColorFilter: React.FC<Props> = ({attribute}) => {
	const { t } = useTranslation("common");
	const router = useRouter();
	const { pathname, query } = router;
	const selectedColors = query?.variations ? (query.variations as string).split(",") : [];
	const [formState, setFormState] = React.useState<string[]>(selectedColors);

	React.useEffect(() => {
		setFormState(selectedColors);
	}, [query?.variations]);

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
		const { variations, ...restQuery } = query;
		router.push(
			{
				pathname,
				query: {
					...restQuery,
					...(!!currentFormState.length
						? { variations: currentFormState.join(",") }
						: {}),
				},
			},
			undefined,
			{ scroll: false }
		);
	}

	return (
		<div className="block border-b border-gray-300 pb-7 mb-7 m-1 w-44 bg-gray-300" style={{ padding: '10px' }}>
			<h3 className="text-heading text-sm md:text-base font-semibold mb-7">
				{t("text-colors")}
			</h3>
			<hr className="border-b border-gray-800 mt-0" style={{ marginTop: '-20px', marginBottom: '20px' }} />
			<div className="mt-2 flex flex-col space-y-4">
				{/* {attribute.values?.map((item: AttributeValue) => (
					<CheckBox
						key={item.id}
						label={
							<span className="flex items-center">
								<span
									className={`w-5 h-5 rounded-full block ltr:mr-3 rtl:ml-3 mt-0.5 border border-black border-opacity-20`}
									style={{ backgroundColor: item.meta ?? item.value }}
								/>
								{item.value}
							</span>
						}
						name={item.value.toLowerCase()}
						checked={formState.includes(item.value)}
						value={item.value}
						onChange={handleItemClick}
					/>
				))} */}
				<select 
				className="px-4 my-1 h-10 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent bg-white"
                onChange={handleItemClick}
        >
          <option>Select...</option>
        {
          attribute?.values?.map((item: AttributeValue) => {
              return <option value={item?.value} selected={formState.includes(item?.value)}>{item?.value}</option>
          })
        }     
        </select>
			</div>
		</div>
	);
};
