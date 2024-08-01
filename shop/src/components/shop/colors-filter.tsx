// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import ReactSelect from "react-select";

// const colorsFilterItems = [
//     { id: "1", name: "D", slug: "D" },
//     { id: "2", name: "E", slug: "E" },
//     { id: "3", name: "F", slug: "F" },
//     { id: "4", name: "G", slug: "G" },
//     { id: "5", name: "H", slug: "H" },
//     { id: "6", name: "I", slug: "I" },
//     { id: "7", name: "J", slug: "J" },
//     { id: "8", name: "K", slug: "K" },
//     { id: "9", name: "L", slug: "L" },
//     { id: "10", name: "M", slug: "M" },
//     { id: "11", name: "N", slug: "N" },
//     { id: "12", name: "O", slug: "O" },
//     { id: "13", name: "P", slug: "P" },
//     { id: "14", name: "Q", slug: "Q" },
//     { id: "15", name: "R", slug: "R" },
//     { id: "16", name: "S", slug: "S" },
//     { id: "17", name: "T", slug: "T" },
//     { id: "18", name: "U", slug: "U" },
//     { id: "19", name: "V", slug: "V" },
//     { id: "20", name: "W", slug: "W" },
//     { id: "21", name: "X", slug: "X" },
//     { id: "22", name: "Y", slug: "Y" },
//     { id: "23", name: "Z", slug: "Z" },
// ];

// export const ColorsFilter = () => {
//     const router = useRouter();
//     const { pathname, query } = router;
//     const [colorRangeFrom, setColorRangeFrom] = useState<string>("");
//     const [colorRangeTo, setColorRangeTo] = useState<string>("");
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
//         const selectedColors = query?.color ? (Array.isArray(query.color) ? query.color : [query.color]) : [];
//         setSelectedValues(selectedColors);
//     }, [query?.color]);

//     function handleApplyRange() {
//         if (!colorRangeFrom || !colorRangeTo) {
//             return;
//         }
    
//         // Get the index of the color values in the colorsFilterItems array
//         const startIndex = colorsFilterItems.findIndex(item => item.slug === colorRangeFrom);
//         const endIndex = colorsFilterItems.findIndex(item => item.slug === colorRangeTo);
    
//         // Extract the color values within the specified range
//         const range = colorsFilterItems.slice(startIndex, endIndex + 1).map(item => item.slug);
    
//         setSelectedValues(range);
    
//         const updatedQuery = { ...query, color: range };
    
//         router.push(
//             {
//                 pathname,
//                 query: updatedQuery,
//             },
//             undefined,
//             { scroll: false }
//         );
//     }
    

//     function clearColorFilter() {
//         setColorRangeFrom("");
//         setColorRangeTo("");
//         setSelectedValues([]); 
//         const { color, ...restQuery } = query;
//         const updatedQuery = { ...restQuery };
//         delete updatedQuery.color;
//         router.push({
//             pathname,
//             query: updatedQuery,
//         });
//     }

//     const options = colorsFilterItems.map((item) => ({
//         value: item.slug,
//         label: item.name,
//     }));

//     return (
//         <div className="block border-b border-gray-300 pb-7 mb-7 mx-auto my-4 bg-gray-300 rounded-lg" style={{ padding: "10px", maxWidth: "300px", margin: '1rem' }}>
			
// 			<h3 className="text-heading text-sm md:text-base font-semibold mb-7 w-44">
// 				{"Color"}
// 			</h3>
// 			<hr className="border-b border-gray-800 mt-0" style={{ marginTop: '-20px', marginBottom: '20px' }} />

//             <div className="flex items-center justify-center">
//                 <ReactSelect
//                     className="text-sm"
//                     placeholder="From"
//                     options={options}
//                     value={options.find((option) => option.value === colorRangeFrom) || null}
//                     onChange={(selectedOption) => setColorRangeFrom(selectedOption?.value || "")}
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
//                     value={options.find((option) => option.value === colorRangeTo) || null}
//                     onChange={(selectedOption) => setColorRangeTo(selectedOption?.value || "")}
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
// 					onClick={clearColorFilter}
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
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ReactSelect from "react-select";
import "keen-slider/keen-slider.min.css"
import { useKeenSlider } from "keen-slider/react";

const colorsFilterItems = [
    { id: "1", name: "D", slug: "D", checked: false },
    { id: "2", name: "E", slug: "E", checked: false },
    { id: "3", name: "F", slug: "F", checked: false },
    { id: "4", name: "G", slug: "G", checked: false },
    { id: "5", name: "H", slug: "H", checked: false },
    { id: "6", name: "I", slug: "I", checked: false },
    { id: "7", name: "J", slug: "J", checked: false },
    { id: "8", name: "K", slug: "K", checked: false },
    { id: "9", name: "L", slug: "L", checked: false },
    { id: "10", name: "M", slug: "M", checked: false },
    { id: "11", name: "N", slug: "N", checked: false },
    { id: "12", name: "O", slug: "O", checked: false },
    { id: "13", name: "P", slug: "P", checked: false },
    { id: "14", name: "Q", slug: "Q", checked: false },
    { id: "15", name: "R", slug: "R", checked: false },
    { id: "16", name: "S", slug: "S", checked: false },
    { id: "17", name: "T", slug: "T", checked: false },
    { id: "18", name: "U", slug: "U", checked: false },
    { id: "19", name: "V", slug: "V", checked: false },
    { id: "20", name: "W", slug: "W", checked: false },
    { id: "21", name: "X", slug: "X", checked: false },
    { id: "22", name: "Y", slug: "Y", checked: false },
    { id: "23", name: "Z", slug: "Z", checked: false },
];

function Arrow(props: {
	disabled: boolean
	left?: boolean
	onClick: (e: any) => void
  }) {
	const disabled = props.disabled ? " arrow--disabled" : ""
	return (
	  <svg
		onClick={props.onClick}
		className={`arrow ${
		  props.left ? "arrow--left" : "arrow--right"
		} ${disabled}`}
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
	  >
		{props.left && (
		  <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
		)}
		{!props.left && (
		  <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
		)}
	  </svg>
	)
  }

interface Props {
    changedFilter: string;
}
export const ColorsFilter = ({changedFilter}: Props) => {
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


    // Keen Slide JS
    const [currentSlide, setCurrentSlide] = React.useState(0)
	const [loaded, setLoaded] = useState(false);
    const [keenOptions, setkeenOptions] = useState({})
    const [ref, instanceRef] = useKeenSlider<HTMLDivElement>(keenOptions)
    useEffect(() => {
      setkeenOptions({
            breakpoints: {
            "(min-width: 1000px)": {
                slides: { perView: 12, spacing: 10 },
            },
            },
            slides: {perView: 5, spacing:5},
            initial: 0,
            slideChanged(slider: { track: { details: { rel: React.SetStateAction<number>; }; }; }) {
                setCurrentSlide(slider.track.details.rel)
            },
            created() {
                setLoaded(true)
            },
        })
    }, [])
    
    useEffect(() => {
        colorsFilterItems.forEach((items) => items.name.includes(changedFilter)?items.checked = false : items.checked = items.checked)
    }, [changedFilter])

    const checkChange = (index:number,e:any) => {
		colorsFilterItems[index].checked = e.target.checked;
		let selOpt = colorsFilterItems.filter((items) => items.checked === true)
		let currentChecked = selOpt.map((item) => {
				return item.slug
			}
		)
        setSelectedValues(currentChecked);
        const updatedQuery = { ...query, color: currentChecked };
	
		router.push(
			{
				pathname,
				query: updatedQuery,
			},
			undefined,
			{ scroll: false }
		);
	}

    return (
        <>
            <style>
                {`
                    .color-check+label {
                        background-color: #0000000D;
                    }
                    .color-check:checked+label {
                        background-color: #24182E;
                        color: #fff;
                    }
                `}
            </style>
            {/* <div className="block border-b border-gray-300 pb-7 mb-7 mx-auto my-4 bg-gray-300 rounded-lg" style={{ padding: "10px", maxWidth: "300px", margin: '1rem' }}>
                
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

            </div> */}
            <div className="text-center border border-gray-300 border-t-0 py-5 flex items-center justify-center">
                <p className="text-black text-base font-bold">Color</p>
            </div>
            <div className="text-center border border-gray-300 border-t-0 py-5 col-span-11">
                <div className="navigation-wrapper relative">
                    <div ref={ref} className="keen-slider w-[90%]">
                        {colorsFilterItems?.map((item,index) => 
                            <>
                                <input type="checkbox" className="hidden-check color-check" checked={item.checked} name="cb" onChange={(e) => checkChange(index,e)} id={`colorcb${index}`} />
                                <label className="keen-slider__slide border border-[#fff] rounded-lg  hover:border-[#24182E] p-2 number-slide1 flex flex-col items-center justify-center py-3 2xl:py-5" htmlFor={`colorcb${index}`}> <p className="font-semibold text-sm">{item.name}</p> </label>
                            </>
                        )}
                    </div>
                    <>
                        <Arrow left onClick={(e: any) => e.stopPropagation() || instanceRef.current?.prev() } disabled={currentSlide === 0} />
                        <Arrow onClick={(e: any) => e.stopPropagation() || instanceRef.current?.next() } disabled={ currentSlide+12 === colorsFilterItems.length } />
                    </>
                </div>
            </div>
        </>
    );
};
