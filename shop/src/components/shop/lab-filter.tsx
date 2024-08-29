import { useRouter } from "next/router";
import React, { useState, useEffect } from 'react';
import ReactSelect from "react-select";
import "keen-slider/keen-slider.min.css"
import { useKeenSlider } from "keen-slider/react";

const labFilterItems = [
    {
        id: "1",
        name: "GIA",
        slug: "GIA",
        checked: false
    },
    {
        id: "11",
        name: "IGI",
        slug: "IGI",
        checked: false
    },
    {
        id: "5",
        name: "HRD",
        slug: "HRD",
        checked: false
    },
    {
        id: "8",
        name: "CGL",
        slug: "CGL",
        checked: false
    },
    {
        id: "12",
        name: "IDT",
        slug: "IDT",
        checked: false
    },
    {
        id: "2",
        name: "AGS",
        slug: "AGS",
        checked: false
    },
    {
        id: "3",
        name: "DBIOD",
        slug: "DBIOD",
        checked: false
    },
    {
        id: "4",
        name: "DHI",
        slug: "DHI",
        checked: false
    },
    {
        id: "6",
        name: "NGTC",
        slug: "NGTC",
        checked: false
    },
    {
        id: "7",
        name: "GIA DOR",
        slug: "GIA DOR",
        checked: false
    },
    {
        id: "9",
        name: "GCAL",
        slug: "GCAL",
        checked: false
    },
    {
        id: "10",
        name: "GSI",
        slug: "GSI",
        checked: false
    },
    
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
export const LabFilter = ({changedFilter}: Props) => {
    const router = useRouter();
    const { pathname, query } = router;
    const selectedLabs = typeof query.lab === 'string' && query.lab?.length > 0 ? query.lab?.split(',') : Array.isArray(query.lab) ? query.lab : [];
    const [selectedOptions, setSelectedOptions] = useState<any[]>(
        labFilterItems
            .filter(item => selectedLabs.includes(item.slug))
            .map(item => ({ value: item.slug, label: item.name }))
    );

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

    const applyFilter = (selectedLabs: string[]) => {
        const filteredItems = labFilterItems.filter(item => selectedLabs.includes(item.slug));
        console.log("Filtered items:", filteredItems);
    };

    // Function to handle option selection
	const handleSelectChange = (selectedOptions: any[]) => {
		setSelectedOptions(selectedOptions);
		applyFilter(selectedOptions.map(option => option.value));

		// Update marginRight dynamically
		const newMarginRight = selectedOptions.length === 0 ? '85px' : '50px';
		setCustomStyles({
			...customStyles,
			selectText: {
				...customStyles.selectText,
				marginRight: newMarginRight
			}
		});
	};


    function handleItemClick(selectedOptions: any[]): void {
        const values = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];

        const newQuery = { ...query };

        delete newQuery['lab'];

        if (values.length > 0) {
            newQuery['lab'] = values;
        }

        const queryString = Object.keys(newQuery)
            .map(key => {
                if (Array.isArray(newQuery[key])) {
                    return newQuery[key].map(value => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
                } else {
                    return `${encodeURIComponent(key)}=${encodeURIComponent(newQuery[key])}`;
                }
            })
            .join('&');

        router.push(
            {
                pathname,
                search: `?${queryString}`,
            },
            undefined,
            { scroll: false }
        );
    }

    const Option = ({ children, ...props }: any) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '12px', marginRight: '5px', marginLeft: '10px' }}>{children}</label>
            <input
                type="checkbox"
                {...props.innerProps}
                checked={props.isSelected}
                onChange={() => {
                    const updatedOptions = props.isSelected
                        ? selectedOptions.filter(option => option.value !== props.value)
                        : [...selectedOptions, { value: props.value, label: children }];
                    handleSelectChange(updatedOptions);
                }}
                style={{ marginRight: '10px' }}
            />
        </div>
    );

	const [customStyles, setCustomStyles] = React.useState({
		selectText: {
			color: 'grey',
			fontSize: '14px',
			marginRight: '85px',
			marginLeft: '10px'
		},
		customIndicatorSeparator: {
			display: 'flex',
			alignItems: 'center'
		}
	});

    // Keen Slide JS
    const [currentSlide, setCurrentSlide] = React.useState(0)
	const [loaded, setLoaded] = useState(false)
    const [options, setoptions] = useState({})
    const [ref, instanceRef] = useKeenSlider<HTMLDivElement>(options)
    useEffect(() => {
        setoptions({
            breakpoints: {
            "(min-width: 600px)": {
                slides: { perView: 6, spacing: 10 },
            },
            "(min-width: 1000px)": {
                slides: { perView: 9, spacing: 10 },
            },
            "(min-width: 1500px)": {
                slides: { perView: 10, spacing: 10 },
            },
            },
            slides: { perView: 3, spacing:5 },
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
        labFilterItems.forEach((items) => items.name.includes(changedFilter)?items.checked = false : items.checked = items.checked)
    }, [changedFilter])
    
    const checkChange = (index:number,e:any) => {
		labFilterItems[index].checked = e.target.checked;
		let selOpt = labFilterItems.filter((items) => items.checked === true)
		let currentChecked = selOpt.map((item) => {
				return {value: item.slug, label:item.name }
			}
		)
        setSelectedOptions(currentChecked);
		handleSelectChange(currentChecked);
		handleItemClick(currentChecked)
	}

    return (
        <>
            <style>
                {`
                    .lab-check+label {
                        background-color: #0000000D;
                    }
                    .lab-check:checked+label {
                        background-color: #24182E;
                        color: #fff;
                    }
                `}
            </style>
            {/* <div className="block border-b border-gray-300 pb-7 mb-7 mx-auto my-4 bg-gray-300 rounded-lg" style={{ padding: "10px", maxWidth: "300px", margin: '1rem' }}>
                <h3 className="text-heading text-sm md:text-base font-semibold mb-7 w-44">
                    {"Lab"}
                </h3>
                <hr className="border-b border-gray-800 mt-0" style={{ marginTop: '-20px', marginBottom: '20px' }} />
                <div className="mt-2 flex flex-col space-y-4">
                    <ReactSelect
                        className="h-12 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent"
                        isMulti
                        onChange={(selectedOptions) => handleItemClick(selectedOptions)}
                        options={labFilterItems.map(item => ({ value: item.slug, label: item.name }))}
                        components={{
                            Option,
                            IndicatorSeparator: () => (
                                <span style={customStyles.customIndicatorSeparator}>
                                    <span style={customStyles.selectText}>Select</span>
                                </span>
                            )
                        }}
                        menuPortalTarget={isMobile ? null : document.body}
                        hideSelectedOptions={false}
                        styles={{
                            multiValue: (provided, state) => ({
                                ...provided,
                                display: 'none'
                            }),
                            valueContainer: (provided, state) => ({
                                ...provided,
                                // display: 'none',
                                zIndex: '-9999',
                                width: '0px',
                                height: '0px',
                            }),
                        }}
                    />
                </div>
            </div> */}
            <div className="text-center border border-b-0 lg:border-b border-gray-300 border-t-0 pt-5 lg:pb-5 flex items-center justify-center col-span-2">
                <p className="text-black text-base font-bold">Lab</p>
            </div>
            <div className="text-center border border-gray-300 border-t-0 py-5 col-span-10">
                <div className="navigation-wrapper relative">
                    <div className="w-[90%] m-auto">
                        <div ref={ref} className="keen-slider">
                            {labFilterItems?.map((item,index) => 
                                <div>
                                    <input type="checkbox" className="hidden-check lab-check" checked={item.checked} name="cb" onChange={(e) => checkChange(index,e)} id={`labcb${index}`} />
                                    <label className="keen-slider__slide border border-[#fff] rounded-lg  hover:border-[#24182E] p-2 number-slide1 flex flex-col items-center justify-center py-3" htmlFor={`labcb${index}`}> <p className="font-semibold text-sm">{item.name}</p> </label>
                                </div>
                            )}
                        </div>
                    </div>
                    <>
                        <Arrow left onClick={(e: any) => e.stopPropagation() || instanceRef.current?.prev() } disabled={currentSlide === 0} />
                        <Arrow onClick={(e: any) => e.stopPropagation() || instanceRef.current?.next() } disabled={ currentSlide+10 === labFilterItems.length } />
                    </>
                </div>
            </div>
        </>
    );
};
