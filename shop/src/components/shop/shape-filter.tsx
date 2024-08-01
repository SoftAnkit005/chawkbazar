// import { useRouter } from "next/router";
// import React, { useState, useEffect } from 'react';
// import ReactSelect from "react-select";

// const shapeFilterItems = [
// 	{
// 		id: "1",
// 		name: "ROUND",
// 		slug: "ROUND",
// 	},
// 	{
// 		id: "2",
// 		name: "PEAR",
// 		slug: "PEAR",
// 	},
// 	{
// 		id: "3",
// 		name: "OVAL",
// 		slug: "OVAL",
// 	},
// 	{
// 		id: "4",
// 		name: "MARQUISE",
// 		slug: "MARQUISE",
// 	},
// 	{
// 		id: "5",
// 		name: "HEART",
// 		slug: "HEART",
// 	},
// 	{
// 		id: "6",
// 		name: "RADIANT",
// 		slug: "RADIANT",
// 	},
// 	{
// 		id: "7",
// 		name: "PRINCESS",
// 		slug: "PRINCESS",
// 	},
// 	{
// 		id: "8",
// 		name: "EMERALD",
// 		slug: "EMERALD",
// 	},
// 	{
// 		id: "9",
// 		name: "ASSCHER",
// 		slug: "ASSCHER",
// 	},
// 	{
// 		id: "10",
// 		name: "SQ.EMERALD",
// 		slug: "SQ.EMERALD",
// 	},
// 	{
// 		id: "12",
// 		name: "SQUARE RADIANT",
// 		slug: "SQUARE RADIANT",
// 	},
// 	{
// 		id: "13",
// 		name: "CUSHION",
// 		slug: "CUSHION",
// 	},
// 	{
// 		id: "14",
// 		name: "BAGUETTE",
// 		slug: "BAGUETTE",
// 	},
// 	{
// 		id: "15",
// 		name: "EUROPEAN CUT",
// 		slug: "EUROPEAN CUT",
// 	},
// ];


// export const ShapeFilter = () => {
//     const router = useRouter();
//     const { pathname, query } = router;    
// 	const selectedShapes = typeof query.shape === 'string' && query.shape?.length > 0 ? query.shape?.split(',') : Array.isArray(query.shape) ? query.shape : [];
//     const [selectedOptions, setSelectedOptions] = React.useState<any[]>(
//         shapeFilterItems
//             .filter(item => selectedShapes.includes(item.slug))
//             .map(item => ({ value: item.slug, label: item.name }))
//     );

// 	const [isMobile, setIsMobile] = useState(false);

// 	useEffect(() => {
// 	  const handleResize = () => {
// 		setIsMobile(window.innerWidth < 768); // Adjust the threshold as needed
// 	  };
  
// 	  // Initial check for mobile/desktop view
// 	  handleResize();
  
// 	  window.addEventListener('resize', handleResize);
// 	  return () => {
// 		window.removeEventListener('resize', handleResize);
// 	  };
// 	}, []);

//     // Function to apply filter
//     const applyFilter = (selectedShapes: string[]) => {
//         // Filter the shapeFilterItems based on selected shapes
//         const filteredItems = shapeFilterItems.filter(item => selectedShapes.includes(item.slug));
//         // Log the filtered items (you can replace this with your actual filtering logic)
//         console.log("Filtered items:", filteredItems);
//     };

// 	// Function to handle option selection
// 	const handleSelectChange = (selectedOptions: any[]) => {
// 		setSelectedOptions(selectedOptions);
// 		applyFilter(selectedOptions.map(option => option.value));

// 		// Update marginRight dynamically
// 		const newMarginRight = selectedOptions.length === 0 ? '85px' : '50px';
// 		setCustomStyles({
// 			...customStyles,
// 			selectText: {
// 				...customStyles.selectText,
// 				marginRight: newMarginRight
// 			}
// 		});
// 	};


// 	function handleItemClick(selectedOptions: any[]): void {
// 		const values = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
	
// 		// Create a copy of the current query object
// 		const newQuery = { ...query };
	
// 		// Remove the 'shape' parameter from the query object
// 		delete newQuery['shape'];
	
// 		// If there are selected options, add the updated 'shape' parameter
// 		if (values.length > 0) {
// 			newQuery['shape'] = values;
// 		}
	
// 		const queryString = Object.keys(newQuery)
// 			.map(key => {
// 				if (Array.isArray(newQuery[key])) {
// 					return newQuery[key].map(value => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
// 				} else {
// 					return `${encodeURIComponent(key)}=${encodeURIComponent(newQuery[key])}`;
// 				}
// 			})
// 			.join('&');
	
// 		router.push(
// 			{
// 				pathname,
// 				search: `?${queryString}`,
// 			},
// 			undefined,
// 			{ scroll: false }
// 		);
// 	}
	
// 	const Option = ({ children, ...props }: any) => (
// 		<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
// 			<label style={{ fontSize: '12px', marginRight: '5px', marginLeft: '10px'  }}>{children}</label>
// 			<input
// 				type="checkbox"
// 				{...props.innerProps}
// 				checked={props.isSelected}
// 				onChange={() => {
// 					const updatedOptions = props.isSelected
// 						? selectedOptions.filter(option => option.value !== props.value)
// 						: [...selectedOptions, { value: props.value, label: children }];
// 					handleSelectChange(updatedOptions);
// 				}}
// 				style={{ marginRight: '10px' }}
// 			/>
// 		</div>
// 	);

// 	const [customStyles, setCustomStyles] = React.useState({
// 		selectText: {
// 			color: 'grey',
// 			fontSize: '14px',
// 			marginRight: '85px',
// 			marginLeft: '10px'
// 		},
// 		customIndicatorSeparator: {
// 			display: 'flex',
// 			alignItems: 'center'
// 		}
// 	});


//     return (
//         <div className="block border-b border-gray-300 pb-7 mb-7 mx-auto my-4 bg-gray-300 rounded-lg" style={{ padding: "10px", maxWidth: "300px", margin: '1rem' }}>
//             <h3 className="text-heading text-sm md:text-base font-semibold mb-7 w-44">
//                 {"Shape"}
//             </h3>
//             <hr className="border-b border-gray-800 mt-0" style={{ marginTop: '-20px', marginBottom: '20px' }} />
//             <div className="mt-2 flex flex-col space-y-4">
// 				<ReactSelect
// 					className="h-12 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent"
// 					isMulti
// 					onChange={(selectedOptions) => handleItemClick(selectedOptions)}
// 					options={shapeFilterItems.map(item => ({ value: item.slug, label: item.name }))}
// 					components={{ Option, // Assuming you already have some components defined
// 					IndicatorSeparator: () => (
// 						<span style={customStyles.customIndicatorSeparator}>
// 							{/* Add the "Select" text here */}
// 							<span style={customStyles.selectText}>Select</span>
// 							{/* Add the original indicator separator */}
// 							{/* <span className="css-1okebmr-indicatorSeparator"></span> */}
// 						</span>
// 					)
// 				}}					
// 					// menuPortalTarget={document.body}
// 					menuPortalTarget={isMobile ? null : document.body}
// 					hideSelectedOptions={false}
// 					styles={{
// 						multiValue: (provided, state) => ({
// 							...provided,
// 							display: 'none'
// 						}),
// 						valueContainer: (provided, state) => ({
// 							...provided,
// 							// display: 'none',
// 							zIndex: '-9999',
// 							width: '0px',
// 							height: '0px',
// 						}),
// 					}}
// 				/>				
//             </div>
//         </div>
//     );
// };
import { useRouter } from "next/router";
import React, { useState, useEffect } from 'react';
import ReactSelect from "react-select";
import { useKeenSlider } from "keen-slider/react"
// import "keen-slider/keen-slider.min.css"
import "../../../../node_modules/keen-slider/keen-slider.min.css";
// Diamond shapes
import round_diamond from "../../../public/assets/images/filter-images/diamonds/Round.png"
import princess from "../../../public/assets/images/filter-images/diamonds/Princess.png"
import cushoin from "../../../public/assets/images/filter-images/diamonds/cushoin.png"
import heart from "../../../public/assets/images/filter-images/diamonds/heart.png"
import square from "../../../public/assets/images/filter-images/diamonds/square.png"
import trillions from "../../../public/assets/images/filter-images/diamonds/trillions.png"
import Image from "next/image";

const shapeFilterItems = [
	{
		id: 1,
		name: "ROUND",
		slug: "ROUND",
		checked: false,
		img:round_diamond,
	},
	{
		id: 2,
		name: "PEAR",
		slug: "PEAR",
		checked: false,
		img:cushoin
	},
	{
		id: 3,
		name: "OVAL",
		slug: "OVAL",
		checked: false,
		img:square
	},
	{
		id: 4,
		name: "MARQUISE",
		slug: "MARQUISE",
		checked: false,
		img:round_diamond
	},
	{
		id: 5,
		name: "HEART",
		slug: "HEART",
		checked: false,
		img:heart
	},
	{
		id: 6,
		name: "RADIANT",
		slug: "RADIANT",
		checked: false,
		img:trillions
	},
	{
		id: 7,
		name: "PRINCESS",
		slug: "PRINCESS",
		checked: false,
		img:princess
	},
	{
		id: 8,
		name: "EMERALD",
		slug: "EMERALD",
		checked: false,
		img:round_diamond
	},
	{
		id: 9,
		name: "ASSCHER",
		slug: "ASSCHER",
		checked: false,
		img:round_diamond
	},
	{
		id: 10,
		name: "SQ.EMERALD",
		slug: "SQ.EMERALD",
		checked: false,
		img:round_diamond
	},
	{
		id: 11,
		name: "EUROPEAN CUT",
		slug: "EUROPEAN CUT",
		checked: false,
		img:round_diamond
	},
	{
		id: 12,
		name: "SQUARE RADIANT",
		slug: "SQUARE RADIANT",
		checked: false,
		img:round_diamond
	},
	{
		id: 13,
		name: "CUSHION",
		slug: "CUSHION",
		checked: false,
		img:round_diamond
	},
	{
		id: 14,
		name: "BAGUETTE",
		slug: "BAGUETTE",
		checked: false,
		img:round_diamond
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
            "(min-width: 1000px)": {
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
					.keen-slider{
						width: 90% !important;
						margin:auto;
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
			<div className="text-center border border-gray-300 border-t-0 py-5 flex items-center justify-center">
				<p className="text-black text-base font-bold">Shape</p>
			</div>
			<div className="text-center border border-gray-300 border-t-0 py-5 col-span-11">
				<div className="navigation-wrapper relative">
					<div ref={ref} className="keen-slider w-[90%]">
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
					<>
						<Arrow left onClick={(e: any) => e.stopPropagation() || instanceRef.current?.prev() } disabled={currentSlide === 0} />
						<Arrow onClick={(e: any) => e.stopPropagation() || instanceRef.current?.next() } disabled={ currentSlide+8 === shapeFilterItems.length } />
					</>
				</div>
			</div>
		</>
    );
};
