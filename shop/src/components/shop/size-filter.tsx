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
        <>
            <div className="text-center border border-b-0 lg:border-b border-gray-300 border-t-0 pt-5 lg:pb-5 flex items-center justify-center col-span-2">
                <p className="text-black text-base font-bold">Weight</p>
            </div>
            <div className="text-center border border-gray-300 border-t-0 py-5 col-span-10">
                <div className="w-[90%] m-auto">
                    <div className="flex items-center justify-center lg:w-1/2">
                        <p className="font-semibold text-sm my-0 mr-5">From</p>
                        <input
                            type="text"
                            className="px-4 my-1 h-10 flex items-center w-2/5 rounded-lg appearance-none transition duration-300 ease-in-out text-heading text-sm my-0 focus:ring-0 border border-border-base focus:border-accent bg-gray-100"
                            value={weightFrom}
                            onChange={handleFromChange}
                            onKeyPress={handleApplyRange}
                        />
                        <p className="font-semibold text-sm my-0 mx-5">To</p>
                        <input
                            type="text"
                            className="px-4 my-1 h-10 flex items-center w-2/5 rounded-lg appearance-none transition duration-300 ease-in-out text-heading text-sm focus:ring-0 border border-border-base focus:border-accent bg-gray-100"
                            value={weightTo}
                            onChange={handleToChange}
                            onKeyPress={handleApplyRange}
                        />
                        <button className="text-xs py-1 px-2 ml-2 focus:outline-none shadow-md" onClick={clearSizeFilter} >
                            <svg width="20px" height="20px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#000000" d="M13.9907,1.31133017e-07 C14.8816,1.31133017e-07 15.3277,1.07714 14.6978,1.70711 L13.8556,2.54922 C14.421,3.15654 14.8904,3.85028 15.2448,4.60695 C15.8028,5.79836 16.0583,7.109 15.9888,8.42277 C15.9193,9.73654 15.5268,11.0129 14.8462,12.1388 C14.1656,13.2646 13.2178,14.2053 12.0868,14.8773 C10.9558,15.5494 9.67655,15.9322 8.3623,15.9918 C7.04804,16.0514 5.73937,15.7859 4.55221,15.2189 C3.36505,14.652 2.33604,13.8009 1.55634,12.7413 C0.776635,11.6816 0.270299,10.446 0.0821822,9.14392 C0.00321229,8.59731 0.382309,8.09018 0.928918,8.01121 C1.47553,7.93224 1.98266,8.31133 2.06163,8.85794 C2.20272,9.83451 2.58247,10.7612 3.16725,11.556 C3.75203,12.3507 4.52378,12.989 5.41415,13.4142 C6.30452,13.8394 7.28602,14.0385 8.27172,13.9939 C9.25741,13.9492 10.2169,13.6621 11.0651,13.158 C11.9133,12.6539 12.6242,11.9485 13.1346,11.1041 C13.6451,10.2597 13.9395,9.30241 13.9916,8.31708 C14.0437,7.33175 13.8521,6.34877 13.4336,5.45521 C13.178,4.90949 12.8426,4.40741 12.4402,3.96464 L11.7071,4.69779 C11.0771,5.32776 9.99996,4.88159 9.99996,3.99069 L9.99996,1.31133017e-07 L13.9907,1.31133017e-07 Z M1.499979,4 C2.05226,4 2.499979,4.44772 2.499979,5 C2.499979,5.55229 2.05226,6 1.499979,6 C0.947694,6 0.499979,5.55228 0.499979,5 C0.499979,4.44772 0.947694,4 1.499979,4 Z M3.74998,1.25 C4.30226,1.25 4.74998,1.69772 4.74998,2.25 C4.74998,2.80229 4.30226,3.25 3.74998,3.25 C3.19769,3.25 2.74998,2.80228 2.74998,2.25 C2.74998,1.69772 3.19769,1.25 3.74998,1.25 Z M6.99998,0 C7.55226,0 7.99998,0.447716 7.99998,1 C7.99998,1.55229 7.55226,2 6.99998,2 C6.44769,2 5.99998,1.55229 5.99998,1 C5.99998,0.447716 6.44769,0 6.99998,0 Z"></path> </g></svg>
                        </button>
                    </div>
                </div>
            </div>
        </>
        // <div className="block border-b border-gray-300 pb-7 mb-7 mx-auto my-4 bg-gray-300 rounded-lg" style={{ padding: '10px', width: '100%', maxWidth: "300px", margin: '1rem', overflowX: 'auto' }}>
        //     <hr className="border-b border-gray-800 mt-0" style={{ marginTop: '-20px', marginBottom: '17px' }} />
        //     {/* <div className="mt-2 flex flex-col space-y-4">
		// 		<div className="flex items-center justify-center mt-4" style={{ margin: '11px 0px' }}>
		// 			<button
		// 				className="text-xs mr-4 px-2 py-1 bg-gray-400 text-black rounded hover:bg-gray-500 focus:outline-none focus:bg-gray-500 shadow-md"
		// 				onClick={clearSizeFilter}
		// 			>
		// 				Clear
		// 			</button>
		// 			<button
		// 				className="text-xs px-2 py-1 bg-black text-white rounded hover:bg-opacity-80 focus:outline-none focus:bg-opacity-80 shadow-md"
		// 				onClick={handleApplyRange}
		// 			>
		// 				Apply
		// 			</button>
		// 		</div>

        //     </div> */}
        // </div>
    );
};
