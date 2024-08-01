// import { useRouter } from "next/router";
// import React, { useEffect, useState } from "react";
// import ReactSelect from "react-select";

// const polishFilterItems = [
//     { id: "1", name: "ANY", slug: "ANY" },
//     { id: "2", name: "IDEAL", slug: "IDEAL" },
//     { id: "3", name: "EXCELLENT", slug: "EXCELLENT" },
//     { id: "4", name: "VERY GOOD", slug: "VERY GOOD" },
//     { id: "5", name: "GOOD", slug: "GOOD" },
//     { id: "6", name: "FAIR", slug: "FAIR" },
//     { id: "7", name: "POOR", slug: "POOR" },
// ];

// export const PolishFilter = () => {
//     const router = useRouter();
//     const { pathname, query } = router;
//     const [polishRangeFrom, setPolishRangeFrom] = useState<string>("");
//     const [polishRangeTo, setPolishRangeTo] = useState<string>("");
//     const [selectedValues, setSelectedValues] = useState<string[]>([]);

//     const [isMobile, setIsMobile] = useState(false);

//     useEffect(() => {
//       const handleResize = () => {
//         setIsMobile(window.innerWidth < 768); // Adjust the threshold as needed
//       };
  
//       // Initial check for mobile/desktop view
//       handleResize();
  
//       window.addEventListener('resize', handleResize);
//       return () => {
//         window.removeEventListener('resize', handleResize);
//       };
//     }, []);

//     useEffect(() => {
//         const selectedPolishes = query?.polish ? (Array.isArray(query.polish) ? query.polish : [query.polish]) : [];
//         setSelectedValues(selectedPolishes);
//     }, [query?.polish]);

//     function handleApplyRange() {
//         if (!polishRangeFrom || !polishRangeTo) {
//             return;
//         }
    
//         // Get the index of the polish values in the polishFilterItems array
//         const startIndex = polishFilterItems.findIndex(item => item.slug === polishRangeFrom);
//         const endIndex = polishFilterItems.findIndex(item => item.slug === polishRangeTo);
    
//         // Extract the polish values within the specified range
//         const range = polishFilterItems.slice(startIndex, endIndex + 1).map(item => item.slug);
    
//         setSelectedValues(range);
    
//         const updatedQuery = { ...query, polish: range };
    
//         router.push(
//             {
//                 pathname,
//                 query: updatedQuery,
//             },
//             undefined,
//             { scroll: false }
//         );
//     }
    

//     function clearPolishFilter() {
//         setPolishRangeFrom("");
//         setPolishRangeTo("");
//         setSelectedValues([]); 
//         const { polish, ...restQuery } = query;
//         const updatedQuery = { ...restQuery };
//         delete updatedQuery.polish;
//         router.push({
//             pathname,
//             query: updatedQuery,
//         });
//     }

//     const options = polishFilterItems.map((item) => ({
//         value: item.slug,
//         label: item.name,
//     }));

//     return (
//         <div className="block border-b border-gray-300 pb-7 mb-7 mx-auto my-4 bg-gray-300 rounded-lg" style={{ padding: "10px", maxWidth: "300px", margin: '1rem' }}>

// 			<h3 className="text-heading text-sm md:text-base font-semibold mb-7 w-44">
// 				{"Polish"}
// 			</h3>
// 			<hr className="border-b border-gray-800 mt-0" style={{ marginTop: '-20px', marginBottom: '20px' }} />
			
//             <div className="flex items-center justify-center">
//                 <ReactSelect
//                     className="text-sm"
//                     placeholder="From"
//                     options={options}
//                     value={options.find((option) => option.value === polishRangeFrom) || null}
//                     onChange={(selectedOption) => setPolishRangeFrom(selectedOption?.value || "")}
//                     menuPortalTarget={isMobile ? null : document.body}
//                     styles={{
//                         control: (provided, state) => ({
//                             ...provided,
//                             fontSize: '0.75rem',
//                         }),
//                     }}
//                 />
//                 <span className="mx-1">-</span>
//                 <ReactSelect
//                     className="text-sm"
//                     placeholder="To"
//                     options={options}
//                     value={options.find((option) => option.value === polishRangeTo) || null}
//                     onChange={(selectedOption) => setPolishRangeTo(selectedOption?.value || "")}
//                     menuPortalTarget={isMobile ? null : document.body}
//                     styles={{
//                         control: (provided, state) => ({
//                             ...provided,
//                             fontSize: '0.75rem',
//                             padding: 0,
//                         }),
//                     }}
//                 />
//             </div>
// 			<div className="flex items-center justify-center mt-4">
// 				<button
// 					className="text-xs py-1 px-2 mr-2 bg-gray-400 text-black rounded hover:bg-gray-500 focus:outline-none focus:bg-gray-500 shadow-md"
// 					onClick={clearPolishFilter}
// 				>
// 					Clear
// 				</button>
// 				<button
// 					className="text-xs py-1 px-2 bg-black text-white rounded hover:bg-opacity-80 focus:outline-none focus:bg-opacity-80 shadow-md"
// 					onClick={handleApplyRange}
// 				>
// 					Apply
// 				</button>
// 			</div>

//         </div>
//     );
// };
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";

const polishFilterItems = [
    { id: "1", name: "ANY", slug: "ANY" },
    { id: "2", name: "IDEAL", slug: "IDEAL" },
    { id: "3", name: "EXCELLENT", slug: "EXCELLENT" },
    { id: "4", name: "VERY GOOD", slug: "VERY GOOD" },
    { id: "5", name: "GOOD", slug: "GOOD" },
    { id: "6", name: "FAIR", slug: "FAIR" },
    { id: "7", name: "POOR", slug: "POOR" },
];

export const PolishFilter = () => {
    const router = useRouter();
    const { pathname, query } = router;
    const [polishRangeFrom, setPolishRangeFrom] = useState<string>("");
    const [polishRangeTo, setPolishRangeTo] = useState<string>("");
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
        const selectedPolishes = query?.polish ? (Array.isArray(query.polish) ? query.polish : [query.polish]) : [];
        setSelectedValues(selectedPolishes);
    }, [query?.polish]);

    useEffect(() => {
        function handleApplyRange() {
            if (!polishRangeFrom || !polishRangeTo) {
                return;
            }
        
            // Get the index of the polish values in the polishFilterItems array
            const startIndex = polishFilterItems.findIndex(item => item.slug === polishRangeFrom);
            const endIndex = polishFilterItems.findIndex(item => item.slug === polishRangeTo);
        
            // Extract the polish values within the specified range
            const range = polishFilterItems.slice(startIndex, endIndex + 1).map(item => item.slug);
        
            setSelectedValues(range);
        
            const updatedQuery = { ...query, polish: range };
        
            router.push(
                {
                    pathname,
                    query: updatedQuery,
                },
                undefined,
                { scroll: false }
            );
        }
        handleApplyRange();
    }, [polishRangeFrom, polishRangeTo])
    
    

    function clearPolishFilter() {
        setPolishRangeFrom("");
        setPolishRangeTo("");
        setSelectedValues([]); 
        const { polish, ...restQuery } = query;
        const updatedQuery = { ...restQuery };
        delete updatedQuery.polish;
        router.push({
            pathname,
            query: updatedQuery,
        });
    }

    const options = polishFilterItems.map((item) => ({
        value: item.slug,
        label: item.name,
    }));

    return (
        <div className="text-center border border-gray-300 border-t-0 p-5 col-span-4">
            <div className="block mx-auto rounded-lg">
                <h3 className="text-black text-base font-bold text-center"> {"Polish"} </h3>
                <div className="mt-5 flex flex-col space-y-4">
                    <div className="flex items-center justify-center">
                        <p className="font-semibold text-sm my-0 mr-5">From</p>
                        <ReactSelect
                            className="text-sm rounded-lg w-full"
                            placeholder=""
                            options={options}
                            value={options.find((option) => option.value === polishRangeFrom) || null}
                            onChange={(selectedOption) => setPolishRangeFrom(selectedOption?.value || "")}
                            // menuPortalTarget={isMobile ? null : document.body}
                            styles={{
                                menuPortal: (provided, state) => ({
                                    ...provided,
                                    fontSize: '0.75rem',
                                }),
                            }}
                        />
                        <p className="font-semibold text-sm my-0 mx-5">To</p>
                        <ReactSelect
                            className="text-sm rounded-lg w-full"
                            placeholder=""
                            options={options}
                            value={options.find((option) => option.value === polishRangeTo) || null}
                            onChange={(selectedOption) => setPolishRangeTo(selectedOption?.value || "")}
                            // menuPortalTarget={isMobile ? null : document.body}
                            styles={{
                                menuPortal: (provided, state) => ({
                                    ...provided,
                                    fontSize: '0.75rem',
                                    padding: 0,
                                }),
                            }}
                        />
                        <button className="text-xs py-1 px-2 ml-2 focus:outline-none shadow-md" onClick={clearPolishFilter} >
                            <svg width="20px" height="20px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#000000" d="M13.9907,1.31133017e-07 C14.8816,1.31133017e-07 15.3277,1.07714 14.6978,1.70711 L13.8556,2.54922 C14.421,3.15654 14.8904,3.85028 15.2448,4.60695 C15.8028,5.79836 16.0583,7.109 15.9888,8.42277 C15.9193,9.73654 15.5268,11.0129 14.8462,12.1388 C14.1656,13.2646 13.2178,14.2053 12.0868,14.8773 C10.9558,15.5494 9.67655,15.9322 8.3623,15.9918 C7.04804,16.0514 5.73937,15.7859 4.55221,15.2189 C3.36505,14.652 2.33604,13.8009 1.55634,12.7413 C0.776635,11.6816 0.270299,10.446 0.0821822,9.14392 C0.00321229,8.59731 0.382309,8.09018 0.928918,8.01121 C1.47553,7.93224 1.98266,8.31133 2.06163,8.85794 C2.20272,9.83451 2.58247,10.7612 3.16725,11.556 C3.75203,12.3507 4.52378,12.989 5.41415,13.4142 C6.30452,13.8394 7.28602,14.0385 8.27172,13.9939 C9.25741,13.9492 10.2169,13.6621 11.0651,13.158 C11.9133,12.6539 12.6242,11.9485 13.1346,11.1041 C13.6451,10.2597 13.9395,9.30241 13.9916,8.31708 C14.0437,7.33175 13.8521,6.34877 13.4336,5.45521 C13.178,4.90949 12.8426,4.40741 12.4402,3.96464 L11.7071,4.69779 C11.0771,5.32776 9.99996,4.88159 9.99996,3.99069 L9.99996,1.31133017e-07 L13.9907,1.31133017e-07 Z M1.499979,4 C2.05226,4 2.499979,4.44772 2.499979,5 C2.499979,5.55229 2.05226,6 1.499979,6 C0.947694,6 0.499979,5.55228 0.499979,5 C0.499979,4.44772 0.947694,4 1.499979,4 Z M3.74998,1.25 C4.30226,1.25 4.74998,1.69772 4.74998,2.25 C4.74998,2.80229 4.30226,3.25 3.74998,3.25 C3.19769,3.25 2.74998,2.80228 2.74998,2.25 C2.74998,1.69772 3.19769,1.25 3.74998,1.25 Z M6.99998,0 C7.55226,0 7.99998,0.447716 7.99998,1 C7.99998,1.55229 7.55226,2 6.99998,2 C6.44769,2 5.99998,1.55229 5.99998,1 C5.99998,0.447716 6.44769,0 6.99998,0 Z"></path> </g></svg>
                        </button>
                    </div>
                </div>
                {/* <div className="flex items-center justify-center mt-4">
                    <button
                        className="text-xs py-1 px-2 mr-2 bg-gray-400 text-black rounded hover:bg-gray-500 focus:outline-none focus:bg-gray-500 shadow-md"
                        onClick={clearPolishFilter}
                    >
                        Clear
                    </button>
                    <button
                        className="text-xs py-1 px-2 bg-black text-white rounded hover:bg-opacity-80 focus:outline-none focus:bg-opacity-80 shadow-md"
                        onClick={handleApplyRange}
                    >
                        Apply
                    </button>
                </div> */}

            </div>
        </div>
    );
};
