import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ReactSelect from "react-select";
import "keen-slider/keen-slider.min.css"
import { useKeenSlider } from "keen-slider/react";
import { useWindowSize } from "@utils/use-window-size";

const fluorescenceFilterItems = [
    { id: "1", name: "NONE", slug: "NONE", checked: false },
    { id: "2", name: "VERY SLIGHT", slug: "VERY SLIGHT", checked: false },
    { id: "3", name: "FAINT/SLIGHT", slug: "FAINT/SLIGHT", checked: false },
    { id: "4", name: "FAINT", slug: "FAINT", checked: false },
    { id: "5", name: "SLIGHT", slug: "SLIGHT", checked: false },
    { id: "6", name: "MEDIUM", slug: "MEDIUM", checked: false },
    { id: "7", name: "STRONG", slug: "STRONG", checked: false },
    { id: "8", name: "VERY STRONG", slug: "VERY STRONG", checked: false },
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
export const FluorescenceFilter = ({changedFilter}: Props) => {
    const router = useRouter();
    const { pathname, query } = router;
    const { width: deviceWidth } = useWindowSize();
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

    // Keen Slide JS
    const [currentSlide, setCurrentSlide] = React.useState(0)
	const [loaded, setLoaded] = useState(false);
    const [keenOptions, setkeenOptions] = useState({})
    const [ref, instanceRef] = useKeenSlider<HTMLDivElement>(keenOptions)
    useEffect(() => {
      setkeenOptions({
            breakpoints: {
                "(min-width: 600px)": {
                    slides: { perView: 5, spacing: 10 },
                },
                "(min-width: 1000px)": {
                    slides: { perView: 6, spacing: 10 },
                },
                "(min-width: 1500px)": {
                    slides: { perView: 9, spacing: 10 },
                },
            },
            slides: { perView: 2, spacing:5 },
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
        fluorescenceFilterItems.forEach((items) => items.name.includes(changedFilter)?items.checked = false : items.checked = items.checked)
    }, [changedFilter])

    const checkChange = (index:number,e:any) => {
		fluorescenceFilterItems[index].checked = e.target.checked;
		let selOpt = fluorescenceFilterItems.filter((items) => items.checked === true)
		let currentChecked = selOpt.map((item) => {
				return item.slug
			}
		)
        setSelectedValues(currentChecked);
        const updatedQuery = { ...query, fluorescence: currentChecked };
	
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
                    .fluorescence-check+label {
                        background-color: #0000000D;
                    }
                    .fluorescence-check:checked+label {
                        background-color: #24182E;
                        color: #fff;
                    }
                `}
            </style>
            {/* <div className="block border-b border-gray-300 pb-7 mb-7 mx-auto my-4 bg-gray-300 rounded-lg" style={{ padding: "10px", maxWidth: "300px", margin: '1rem' }}>
                
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

            </div> */}
            <div className="text-center border border-b-0 lg:border-b border-gray-300 border-t-0 pt-5 lg:pb-5 flex items-center justify-center col-span-2">
                <p className="text-black text-base font-bold">Fluorescence</p>
            </div>
            <div className="text-center border border-gray-300 border-t-0 py-5 col-span-10">
                <div className="navigation-wrapper relative">
                    <div className="w-[90%] m-auto">
                        <div ref={ref} className="keen-slider">
                            {fluorescenceFilterItems?.map((item,index) => 
                                <>
                                    <input type="checkbox" className="hidden-check fluorescence-check" checked={item.checked} name="cb" onChange={(e) => checkChange(index,e)} id={`fluorescencecb${index}`} />
                                    <label className="keen-slider__slide border border-[#fff] rounded-lg  hover:border-[#24182E] p-2 number-slide1 flex flex-col items-center justify-center" htmlFor={`fluorescencecb${index}`}> <p className="font-semibold text-sm">{item.name}</p> </label>
                                </>
                            )}
                        </div>
                    </div>
                    <>
                        <Arrow left onClick={(e: any) => e.stopPropagation() || instanceRef.current?.prev() } disabled={currentSlide === 0} />
                        <Arrow onClick={(e: any) => e.stopPropagation() || instanceRef.current?.next() } disabled={ currentSlide+8 === fluorescenceFilterItems.length } />
                    </>
                </div>
            </div>
        </>
    );
};