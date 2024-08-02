import { useRouter } from "next/router";
import React, { useState, useEffect } from 'react';
import ReactSelect from "react-select";
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
// Diamond shapes
import asscher_diamond from "../../../public/assets/images/filter-images/diamonds/asscher_shape.png"
import baguette_diamond from "../../../public/assets/images/filter-images/diamonds/baguette_shape.png"
import cushion_diamond from "../../../public/assets/images/filter-images/diamonds/cushion_shape.png"
import emerald_diamond from "../../../public/assets/images/filter-images/diamonds/emerald_shape.png"
import european_cut_diamond from "../../../public/assets/images/filter-images/diamonds/european_cut_shape.png"
import heart_diamond from "../../../public/assets/images/filter-images/diamonds/heart_shape.png"
import princess_diamond from "../../../public/assets/images/filter-images/diamonds/princess_shape.png"
import round_diamond_diamond from "../../../public/assets/images/filter-images/diamonds/round_shape.png"
import square_emrald_diamond from "../../../public/assets/images/filter-images/diamonds/sq_emerald_shape.png"
import oval_diamond from "../../../public/assets/images/filter-images/diamonds/oval_shape.png"
import pear_diamond from "../../../public/assets/images/filter-images/diamonds/pear_shape.png"
import marquise_diamond from "../../../public/assets/images/filter-images/diamonds/marquise_shape.png"
import radiant_diamond from "../../../public/assets/images/filter-images/diamonds/radiant_shape.png"
import square_radiant_diamond from "../../../public/assets/images/filter-images/diamonds/square_radiant_shape.png"


import Image from "next/image";

const shapeFilterItems = [
	{
		id: 1,
		name: "ROUND",
		slug: "ROUND",
		checked: false,
		img:round_diamond_diamond,
	},
	{
		id: 2,
		name: "PEAR",
		slug: "PEAR",
		checked: false,
		img:pear_diamond
	},
	{
		id: 3,
		name: "OVAL",
		slug: "OVAL",
		checked: false,
		img:oval_diamond
	},
	{
		id: 4,
		name: "MARQUISE",
		slug: "MARQUISE",
		checked: false,
		img:marquise_diamond
	},
	{
		id: 5,
		name: "HEART",
		slug: "HEART",
		checked: false,
		img:heart_diamond
	},
	{
		id: 6,
		name: "RADIANT",
		slug: "RADIANT",
		checked: false,
		img:radiant_diamond
	},
	{
		id: 7,
		name: "PRINCESS",
		slug: "PRINCESS",
		checked: false,
		img:princess_diamond
	},
	{
		id: 8,
		name: "EMERALD",
		slug: "EMERALD",
		checked: false,
		img:emerald_diamond
	},
	{
		id: 9,
		name: "ASSCHER",
		slug: "ASSCHER",
		checked: false,
		img:asscher_diamond
	},
	{
		id: 10,
		name: "SQ.EMERALD",
		slug: "SQ.EMERALD",
		checked: false,
		img:square_emrald_diamond
	},
	{
		id: 11,
		name: "EUROPEAN CUT",
		slug: "EUROPEAN CUT",
		checked: false,
		img:european_cut_diamond
	},
	{
		id: 12,
		name: "SQUARE RADIANT",
		slug: "SQUARE RADIANT",
		checked: false,
		img:square_radiant_diamond
	},
	{
		id: 13,
		name: "CUSHION",
		slug: "CUSHION",
		checked: false,
		img:cushion_diamond
	},
	{
		id: 14,
		name: "BAGUETTE",
		slug: "BAGUETTE",
		checked: false,
		img:baguette_diamond
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
export const ShapeFilter = ({changedFilter}: Props) => {
    const router = useRouter();
    const { pathname, query } = router;    
	const selectedShapes = typeof query.shape === 'string' && query.shape?.length > 0 ? query.shape?.split(',') : Array.isArray(query.shape) ? query.shape : [];
    const [selectedOptions, setSelectedOptions] = React.useState<any[]>(
        shapeFilterItems
            .filter(item => selectedShapes.includes(item.slug))
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

    // Function to apply filter
    const applyFilter = (selectedShapes: string[]) => {
        // Filter the shapeFilterItems based on selected shapes
        const filteredItems = shapeFilterItems.filter(item => selectedShapes.includes(item.slug));
        // Log the filtered items (you can replace this with your actual filtering logic)
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


	function handleItemClick(selectedOptions: ReadonlyArray<{ value: string; label: string }>): void {
		const values = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
		// console.log('values: ',values);
	
		// Create a copy of the current query object
		const newQuery = { ...query };
	
		// Remove the 'shape' parameter from the query object
		delete newQuery['shape'];
	
		// If there are selected options, add the updated 'shape' parameter
		if (values.length > 0) {
			newQuery['shape'] = values;
		}
	
		const queryString = Object.keys(newQuery).map(key => {
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
			<label style={{ fontSize: '12px', marginRight: '5px', marginLeft: '10px'  }}>{children}</label>
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
                slides: { perView: 8, spacing: 10 },
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
        shapeFilterItems.forEach((items) => items.name.includes(changedFilter)?items.checked = false : items.checked = items.checked)
    }, [changedFilter])

	const checkChange = (index:number,e:any) => {
		shapeFilterItems[index].checked = e.target.checked;
		
		let selOpt = shapeFilterItems.filter((items) => items.checked === true)
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
					.arrow {
						width: 15px;
						height: 15px;
						position: absolute;
						top: 50%;
						transform: translateY(-50%);
						-webkit-transform: translateY(-50%);
						fill: #000;
						cursor: pointer;
					}

					.arrow--left {
						left: 5px;
					}

					.arrow--right {
						left: auto;
						right: 5px;
					}

					.arrow--disabled {
						fill:#00000029;
					}
	
					.hidden-check {
						display:none;
					}

					.shape-check:checked+label {
						background-color: #24182E;
						color: #fff;
					}
				`}
			</style>
			<div className="text-center border border-b-0 lg:border-b border-gray-300 border-t-0 pt-5 lg:pb-5 flex items-center justify-center">
				<p className="text-black text-base font-bold">Shape</p>
			</div>
			<div className="text-center border border-gray-300 border-t-0 py-5 col-span-11">
				<div className="navigation-wrapper relative">
					<div className="w-[90%] m-auto">
						<div ref={ref} className="keen-slider w-[90%] h-[110px]">
							{shapeFilterItems?.map((item,index) => 
								<>
									<input type="checkbox" className="hidden-check shape-check" name="cb" checked={item.checked} onChange={(e) => checkChange(index,e)} id={`diamondcb${index}`} />
									<label className="keen-slider__slide border border-[#fff] rounded-xl  hover:border-[#24182E] p-2 number-slide1 flex flex-col items-center justify-center" htmlFor={`diamondcb${index}`}>
										<Image src={item.img} />
										<p className="font-semibold text-sm">{item.name}</p>
									</label>
								</>
							)}
						</div>			
					</div>
					<>
						<Arrow left onClick={(e: any) => e.stopPropagation() || instanceRef.current?.prev() } disabled={currentSlide === 0} />
						<Arrow onClick={(e: any) => e.stopPropagation() || instanceRef.current?.next() } disabled={ currentSlide+8 === shapeFilterItems.length } />
					</>
				</div>
			</div>
		</>
    );
};