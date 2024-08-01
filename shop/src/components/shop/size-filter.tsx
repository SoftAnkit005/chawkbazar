import { useRouter } from "next/router";
import React from "react";
import { useState } from "react";
import { useTranslation } from "next-i18next";

const sizeFilterItems = [
	{
		id: "1",
		name: "Under 1",
		slug: "0-1",
	},
	{
		id: "2",
		name: "1 to 2",
		slug: "1-2",
	},
	{
		id: "3",
		name: "2 to 3",
		slug: "2-3",
	},
	{
		id: "4",
		name: "3 to 4",
		slug: "3-4",
	},
	{
		id: "5",
		name: "4 to 5",
		slug: "4-5",
	},
	{
		id: "6",
		name: "Over 5",
		slug: "5+",
	},
];

export const SizeFilter = () => {
    const { t } = useTranslation("common");
    const router = useRouter();
    const { pathname, query } = router;
    const selectedSizes = query?.size ? [(query.size as string).split(",")[(query.size as string).split(",").length - 1]] : [];
    const [formState, setFormState] = React.useState<string[]>(selectedSizes);
    const [weightFrom, setWeightFrom] = useState("");
    const [weightTo, setWeightTo] = useState("");

    React.useEffect(() => {
        setFormState(selectedSizes);
    }, [query?.size]);

    function handleItemClick(e: React.FormEvent<HTMLInputElement>): void {
        const { value } = e.currentTarget;
        if (value.includes("Select")) {
            return;
        }
        let currentFormState = formState.includes(value)
            ? formState.filter((i) => i !== value)
            : [...formState, value];
        const { size, ...restQuery } = query;
        router.push(
            {
                pathname,
                query: {
                    ...restQuery,
                    ...(!!currentFormState.length
                        ? { size: currentFormState[currentFormState.length - 1] }
                        : {}),
                },
            },
            undefined,
            { scroll: false }
        );
    }

    function handleFromChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const { value } = e.target;
        setWeightFrom(value);
    }

    function handleToChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const { value } = e.target;
        setWeightTo(value);
    }

    function handleApplyRange(): void {
        if (!weightFrom || !weightTo) {
            return;
        }
        const range = `${weightFrom}-${weightTo}`;
        const { size, ...restQuery } = query;
        router.push(
            {
                pathname,
                query: {
                    ...restQuery,
                    size: range,
                },
            },
            undefined,
            { scroll: false }
        );
    }

    function clearSizeFilter() {
        setFormState([]); // Clear the filter state
        setWeightFrom(""); // Clear weightFrom state
        setWeightTo(""); // Clear weightTo state
        const { size, ...restQuery } = query;
        router.push(
            {
                pathname,
                query: restQuery, // Remove the size query parameter
            },
            undefined,
            { scroll: false }
        );
    }
    
	
    return (
        <div className="block border-b border-gray-300 pb-7 mb-7 mx-auto my-4 bg-gray-300 rounded-lg" style={{ padding: '10px', width: '100%', maxWidth: "300px", margin: '1rem', overflowX: 'auto' }}>
            <h3 className="text-heading text-sm md:text-base font-semibold mb-7 w-44">
                Weight
            </h3>
            <hr className="border-b border-gray-800 mt-0" style={{ marginTop: '-20px', marginBottom: '17px' }} />
            <div className="mt-2 flex flex-col space-y-4">
                <div className="flex items-center justify-center">
                    <input
                        type="text"
                        placeholder="From"
                        className="px-4 my-1 h-10 flex items-center w-2/5 rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent bg-white"
                        value={weightFrom}
                        onChange={handleFromChange}
                    />
                    <span className="mx-4">-</span>
                    <input
                        type="text"
                        placeholder="To"
                        className="px-4 my-1 h-10 flex items-center w-2/5 rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent bg-white"
                        value={weightTo}
                        onChange={handleToChange}
                    />
                </div>
				<div className="flex items-center justify-center mt-4" style={{ margin: '11px 0px' }}>
					<button
						className="text-xs mr-4 px-2 py-1 bg-gray-400 text-black rounded hover:bg-gray-500 focus:outline-none focus:bg-gray-500 shadow-md"
						onClick={clearSizeFilter}
					>
						Clear
					</button>
					<button
						className="text-xs px-2 py-1 bg-black text-white rounded hover:bg-opacity-80 focus:outline-none focus:bg-opacity-80 shadow-md"
						onClick={handleApplyRange}
					>
						Apply
					</button>
				</div>

            </div>
        </div>
    );
};
