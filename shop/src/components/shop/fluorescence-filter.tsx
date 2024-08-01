import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ReactSelect from "react-select";

const fluorescenceFilterItems = [
    { id: "1", name: "NONE", slug: "NONE" },
    { id: "2", name: "VERY SLIGHT", slug: "VERY SLIGHT" },
    { id: "3", name: "FAINT/SLIGHT", slug: "FAINT/SLIGHT" },
    { id: "4", name: "FAINT", slug: "FAINT" },
    { id: "5", name: "SLIGHT", slug: "SLIGHT" },
    { id: "6", name: "MEDIUM", slug: "MEDIUM" },
    { id: "7", name: "STRONG", slug: "STRONG" },
    { id: "8", name: "VERY STRONG", slug: "VERY STRONG" },
];

export const FluorescenceFilter = () => {
    const router = useRouter();
    const { pathname, query } = router;
    const [fluorescenceRangeFrom, setFluorescenceRangeFrom] = useState<string>("");
    const [fluorescenceRangeTo, setFluorescenceRangeTo] = useState<string>("");
    const [selectedValues, setSelectedValues] = useState<string[]>([]);

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
        const selectedFluorescences = query?.fluorescence ? (Array.isArray(query.fluorescence) ? query.fluorescence : [query.fluorescence]) : [];
        setSelectedValues(selectedFluorescences);
    }, [query?.fluorescence]);

    function handleApplyRange() {
        if (!fluorescenceRangeFrom || !fluorescenceRangeTo) {
            return;
        }
    
        // Get the index of the fluorescence values in the fluorescenceFilterItems array
        const startIndex = fluorescenceFilterItems.findIndex(item => item.slug === fluorescenceRangeFrom);
        const endIndex = fluorescenceFilterItems.findIndex(item => item.slug === fluorescenceRangeTo);
    
        // Extract the fluorescence values within the specified range
        const range = fluorescenceFilterItems.slice(startIndex, endIndex + 1).map(item => item.slug);
    
        setSelectedValues(range);
    
        const updatedQuery = { ...query, fluorescence: range };
    
        router.push(
            {
                pathname,
                query: updatedQuery,
            },
            undefined,
            { scroll: false }
        );
    }
    

    function clearColorFilter() {
        setFluorescenceRangeFrom("");
        setFluorescenceRangeTo("");
        setSelectedValues([]); 
        const { fluorescence, ...restQuery } = query;
        const updatedQuery = { ...restQuery };
        delete updatedQuery.fluorescence;
        router.push({
            pathname,
            query: updatedQuery,
        });
    }

    const options = fluorescenceFilterItems.map((item) => ({
        value: item.slug,
        label: item.name,
    }));

    return (
        <div className="block border-b border-gray-300 pb-7 mb-7 mx-auto my-4 bg-gray-300 rounded-lg" style={{ padding: "10px", maxWidth: "300px", margin: '1rem' }}>
			
			<h3 className="text-heading text-sm md:text-base font-semibold mb-7 w-44">
				{"Fluorescence"}
			</h3>
			<hr className="border-b border-gray-800 mt-0" style={{ marginTop: '-20px', marginBottom: '20px' }} />

            <div className="flex items-center justify-center">
                <ReactSelect
                    className="text-sm"
                    placeholder="From"
                    options={options}
                    value={options.find((option) => option.value === fluorescenceRangeFrom) || null}
                    onChange={(selectedOption) => setFluorescenceRangeFrom(selectedOption?.value || "")}
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
                    placeholder="To&nbsp;&nbsp;&nbsp;"
                    options={options}
                    value={options.find((option) => option.value === fluorescenceRangeTo) || null}
                    onChange={(selectedOption) => setFluorescenceRangeTo(selectedOption?.value || "")}
                    menuPortalTarget={isMobile ? null : document.body}
                    styles={{
                        control: (provided, state) => ({
                            ...provided,
                            fontSize: '0.75rem',                           
                        }),
                    }}
                />
            </div>
			<div className="flex items-center justify-center mt-4">
				<button
					className="text-xs py-1 px-2 mr-2 bg-gray-400 text-black rounded hover:bg-gray-500 focus:outline-none focus:bg-gray-500 shadow-md"
					onClick={clearColorFilter}
				>
					Clear
				</button>
				<button
					className="text-xs py-1 px-2 bg-black text-white rounded hover:bg-opacity-80 focus:outline-none focus:bg-opacity-80 shadow-md"
					onClick={handleApplyRange}
				>
					Apply
				</button>
			</div>

        </div>
    );
};
