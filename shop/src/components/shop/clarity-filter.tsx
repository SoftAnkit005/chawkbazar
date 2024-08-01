import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";

const clarityFilterItems = [
    { id: "1", name: "FL", slug: "FL" },
    { id: "2", name: "IF", slug: "IF" },
    { id: "3", name: "VVS1", slug: "VVS1" },
    { id: "4", name: "VVS2", slug: "VVS2" },
    { id: "5", name: "VS1", slug: "VS1" },
    { id: "6", name: "VS2", slug: "VS2" },
    { id: "7", name: "SI1", slug: "SI1" },
    { id: "8", name: "SI2", slug: "SI2" },
    { id: "9", name: "SI3", slug: "SI3" },
    { id: "10", name: "I1", slug: "I1" },
    { id: "11", name: "I2", slug: "I2" },
    { id: "12", name: "I3", slug: "I3" },
];




export const ClarityFilter = () => {
    const router = useRouter();
    const { pathname, query } = router;
    const [selectedValues, setSelectedValues] = useState<string[]>([]);
    const [clarityRangeFrom, setClarityRangeFrom] = useState<string>("");
    const [clarityRangeTo, setClarityRangeTo] = useState<string>("");

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768); // Adjust the threshold as needed
      };
  
      // Initial check for mobile/desktop view
      handleResize();
  
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);

    useEffect(() => {
        const selectedClarities = query?.clarity ? query.clarity as string[] : [];
        setSelectedValues(selectedClarities);
    }, [query?.clarity]);

	function handleApplyRange() {
		if (!clarityRangeFrom || !clarityRangeTo) {
			return;
		}
	
		// Get the index of the clarity values in the clarityFilterItems array
		const startIndex = clarityFilterItems.findIndex(item => item.slug === clarityRangeFrom);
		const endIndex = clarityFilterItems.findIndex(item => item.slug === clarityRangeTo);
	
		// Extract the clarity values within the specified range
		const range = clarityFilterItems.slice(startIndex, endIndex + 1).map(item => item.slug);
	
		setSelectedValues(range);
	
		const updatedQuery = { ...query, clarity: range };
	
		router.push(
			{
				pathname,
				query: updatedQuery,
			},
			undefined,
			{ scroll: false }
		);
	}
	

    function clearClarityFilter() {
        setClarityRangeFrom("");
        setClarityRangeTo("");
        setSelectedValues([]); // Reset selected values
        const { clarity, ...restQuery } = query;
        const updatedQuery = { ...restQuery }; // Remove clarity from query
        delete updatedQuery.clarity; // Delete clarity from query object
        router.push({
            pathname,
            query: updatedQuery,
        });
    }

	

    const options = clarityFilterItems.map((item) => ({
        value: item.slug,
        label: item.name,
    }));

    return (
        <div className="block border-b border-gray-300 pb-7 mb-7 mx-auto my-4 bg-gray-300 rounded-lg" style={{ padding: "10px", maxWidth: "300px", margin: '1rem' }}>
            <h3 className="text-heading text-sm md:text-base font-semibold mb-7 w-44">{"Clarity"}</h3>
            <hr className="border-b border-gray-800 mt-0" style={{ marginTop: "-20px", marginBottom: "20px" }} />
            <div className="mt-2 flex flex-col space-y-4">
                <div className="flex items-center justify-center">
                    <ReactSelect
                        className="text-sm"
                        placeholder="From"
                        options={options}
                        value={options.find((option) => option.value === clarityRangeFrom) || null}
                        onChange={(selectedOption) => setClarityRangeFrom(selectedOption?.value || "")}
                        menuPortalTarget={isMobile ? null : document.body}
                        styles={{
                            control: (provided, state) => ({
                                ...provided,
                                fontSize: '0.75rem',
                            }),
                        }}
                    />
                    <span className="mx-1">-</span>
                    <ReactSelect
                        className="text-sm"
                        placeholder="To"
                        options={options}
                        value={options.find((option) => option.value === clarityRangeTo) || null}
                        onChange={(selectedOption) => setClarityRangeTo(selectedOption?.value || "")}
                        menuPortalTarget={isMobile ? null : document.body}
                        styles={{
                            control: (provided, state) => ({
                                ...provided,
                                fontSize: '0.75rem',
                                padding: 0,
                            }),
                        }}
                    />
                </div>
				<div className="flex items-center justify-center mt-4 space-x-2">
					<button
						className="text-xs py-1 px-2 bg-gray-400 text-black rounded hover:bg-gray-500 focus:outline-none focus:bg-gray-500 shadow-md"
						onClick={clearClarityFilter}
						style={{marginRight: '0.5rem'}}
					>
						Clear
					</button>
					<button
						className="text-xs py-1 px-2 bg-black text-white rounded hover:bg-opacity-80 focus:outline-none focus:bg-opacity-80 shadow-md"
						onClick={handleApplyRange}
						style={{marginRight: '0.5rem'}}
					>
						Apply
					</button>
				</div>

            </div>
        </div>
    );
};
