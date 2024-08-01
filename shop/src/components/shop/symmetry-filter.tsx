import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ReactSelect from "react-select";

const symmetryFilterItems = [
    { id: "1", name: "ANY", slug: "ANY" },
    { id: "2", name: "IDEAL", slug: "IDEAL" },
    { id: "3", name: "EXCELLENT", slug: "EXCELLENT" },
    { id: "4", name: "VERY GOOD", slug: "VERY GOOD" },
    { id: "5", name: "GOOD", slug: "GOOD" },
    { id: "6", name: "FAIR", slug: "FAIR" },
    { id: "7", name: "POOR", slug: "POOR" },
];

export const SymmetryFilter = () => {
    const router = useRouter();
    const { pathname, query } = router;
    const [selectedValues, setSelectedValues] = useState<string[]>([]);
    const [selectedFrom, setSelectedFrom] = useState<string>("");
    const [selectedTo, setSelectedTo] = useState<string>("");

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
        const selectedSymmetrys = query?.symmetry ? (Array.isArray(query.symmetry) ? query.symmetry : [query.symmetry]) : [];
        setSelectedValues(selectedSymmetrys);
        if (selectedSymmetrys.length === 2) {
            setSelectedFrom(selectedSymmetrys[0]);
            setSelectedTo(selectedSymmetrys[1]);
        }
    }, [query?.symmetry]);

    function handleApplyRange() {
        if (!selectedFrom || !selectedTo) {
            return;
        }

        const updatedQuery = { ...query, symmetry: [selectedFrom, selectedTo] };

        router.push(
            {
                pathname,
                query: updatedQuery,
            },
            undefined,
            { scroll: false }
        );
    }

    function clearSymmetryFilter() {
        setSelectedFrom("");
        setSelectedTo("");
        setSelectedValues([]);
        const { symmetry, ...restQuery } = query;
        const updatedQuery = { ...restQuery };
        delete updatedQuery.symmetry;
        router.push({
            pathname,
            query: updatedQuery,
        });
    }

    const options = symmetryFilterItems.map((item) => ({
        value: item.slug,
        label: item.name,
    }));

    return (
        <div className="block border-b border-gray-300 pb-7 mb-7 mx-auto my-4 bg-gray-300 rounded-lg" style={{ padding: "10px", maxWidth: "300px", margin: '1rem' }}>
            <h3 className="text-heading text-sm md:text-base font-semibold mb-7 w-44">
                {"Symmetry"}
            </h3>
            <hr className="border-b border-gray-800 mt-0" style={{ marginTop: '-20px', marginBottom: '20px' }} />

            <div className="flex items-center justify-center">
                <ReactSelect
                    className="text-sm"
                    placeholder="From"
                    options={options}
                    value={options.find((option) => option.value === selectedFrom) || null}
                    onChange={(selectedOption) => setSelectedFrom(selectedOption?.value || "")}
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
                    value={options.find((option) => option.value === selectedTo) || null}
                    onChange={(selectedOption) => setSelectedTo(selectedOption?.value || "")}
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
					onClick={clearSymmetryFilter}
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

export default SymmetryFilter;
