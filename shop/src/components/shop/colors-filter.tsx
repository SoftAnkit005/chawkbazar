import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ReactSelect from "react-select";

const colorsFilterItems = [
    { id: "1", name: "D", slug: "D" },
    { id: "2", name: "E", slug: "E" },
    { id: "3", name: "F", slug: "F" },
    { id: "4", name: "G", slug: "G" },
    { id: "5", name: "H", slug: "H" },
    { id: "6", name: "I", slug: "I" },
    { id: "7", name: "J", slug: "J" },
    { id: "8", name: "K", slug: "K" },
    { id: "9", name: "L", slug: "L" },
    { id: "10", name: "M", slug: "M" },
    { id: "11", name: "N", slug: "N" },
    { id: "12", name: "O", slug: "O" },
    { id: "13", name: "P", slug: "P" },
    { id: "14", name: "Q", slug: "Q" },
    { id: "15", name: "R", slug: "R" },
    { id: "16", name: "S", slug: "S" },
    { id: "17", name: "T", slug: "T" },
    { id: "18", name: "U", slug: "U" },
    { id: "19", name: "V", slug: "V" },
    { id: "20", name: "W", slug: "W" },
    { id: "21", name: "X", slug: "X" },
    { id: "22", name: "Y", slug: "Y" },
    { id: "23", name: "Z", slug: "Z" },
];

export const ColorsFilter = () => {
    const router = useRouter();
    const { pathname, query } = router;
    const [colorRangeFrom, setColorRangeFrom] = useState<string>("");
    const [colorRangeTo, setColorRangeTo] = useState<string>("");
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
        const selectedColors = query?.color ? (Array.isArray(query.color) ? query.color : [query.color]) : [];
        setSelectedValues(selectedColors);
    }, [query?.color]);

    function handleApplyRange() {
        if (!colorRangeFrom || !colorRangeTo) {
            return;
        }
    
        // Get the index of the color values in the colorsFilterItems array
        const startIndex = colorsFilterItems.findIndex(item => item.slug === colorRangeFrom);
        const endIndex = colorsFilterItems.findIndex(item => item.slug === colorRangeTo);
    
        // Extract the color values within the specified range
        const range = colorsFilterItems.slice(startIndex, endIndex + 1).map(item => item.slug);
    
        setSelectedValues(range);
    
        const updatedQuery = { ...query, color: range };
    
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
        setColorRangeFrom("");
        setColorRangeTo("");
        setSelectedValues([]); 
        const { color, ...restQuery } = query;
        const updatedQuery = { ...restQuery };
        delete updatedQuery.color;
        router.push({
            pathname,
            query: updatedQuery,
        });
    }

    const options = colorsFilterItems.map((item) => ({
        value: item.slug,
        label: item.name,
    }));

    return (
        <div className="block border-b border-gray-300 pb-7 mb-7 mx-auto my-4 bg-gray-300 rounded-lg" style={{ padding: "10px", maxWidth: "300px", margin: '1rem' }}>
			
			<h3 className="text-heading text-sm md:text-base font-semibold mb-7 w-44">
				{"Color"}
			</h3>
			<hr className="border-b border-gray-800 mt-0" style={{ marginTop: '-20px', marginBottom: '20px' }} />

            <div className="flex items-center justify-center">
                <ReactSelect
                    className="text-sm"
                    placeholder="From"
                    options={options}
                    value={options.find((option) => option.value === colorRangeFrom) || null}
                    onChange={(selectedOption) => setColorRangeFrom(selectedOption?.value || "")}
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
                    value={options.find((option) => option.value === colorRangeTo) || null}
                    onChange={(selectedOption) => setColorRangeTo(selectedOption?.value || "")}
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
