import { useRouter } from "next/router";
import React, { useState, useEffect } from 'react';
import ReactSelect from "react-select";
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"

const typeFilterItems = [
	{
		id: "1",
		name: "NATURAL",
		slug: "NATURAL",
		display_name:'Natural Diamond',
		checked: false,
	},
	{
		id: "2",
		name: "LABGROWN",
		slug: "LABGROWN",
		display_name:'Labgrown Diamond',
		checked: false,
	},
];

interface Props {
    changedFilter: string;
}

export const TypeFilter = ({changedFilter}: Props) => {
    const router = useRouter();
    const { pathname, query } = router;    
	const selectedTypes = typeof query.type_name === 'string' && query.type_name?.length > 0 ? query.type_name?.split(',') : Array.isArray(query.type_name) ? query.type_name : [];
    const [selectedOptions, setSelectedOptions] = React.useState<any[]>(
        typeFilterItems
            .filter(item => selectedTypes.includes(item.slug))
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
    const applyFilter = (selectedTypes: string[]) => {
        // Filter the typeFilterItems based on selected type_name
        const filteredItems = typeFilterItems.filter(item => selectedTypes.includes(item.slug));
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


	function handleItemClick(selectedOptions: any[]): void {
		const values = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
	
		// Create a copy of the current query object
		const newQuery = { ...query };
	
		// Remove the 'type_name' parameter from the query object
		delete newQuery['type_name'];
	
		// If there are selected options, add the updated 'type_name' parameter
		if (values.length > 0) {
			newQuery['type_name'] = values;
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
	
	// const Option = ({ children, ...props }: any) => (
	// 	<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
	// 		<label style={{ fontSize: '12px', marginRight: '5px', marginLeft: '10px'  }}>{children}</label>
	// 		<input
	// 			type="checkbox"
	// 			{...props.innerProps}
	// 			checked={props.isSelected}
	// 			onChange={() => {
	// 				const updatedOptions = props.isSelected
	// 					? selectedOptions.filter(option => option.value !== props.value)
	// 					: [...selectedOptions, { value: props.value, label: children }];
	// 				handleSelectChange(updatedOptions);
	// 			}}
	// 			style={{ marginRight: '10px' }}
	// 		/>
	// 	</div>
	// );

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
			"(min-width: 1000px)": {
				slides: { perView: 4, spacing: 10 },
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
        typeFilterItems.forEach((items) => items.name.includes(changedFilter)?items.checked = false : items.checked = items.checked)
    }, [changedFilter])
	
    const checkChange = (index:number,e:any) => {
		console.log('vlaue: ',e.target.checked);
		typeFilterItems.forEach((item) => {item.checked = false});
		typeFilterItems[index].checked = e.target.checked;
		
		let selOpt = typeFilterItems.filter((items) => items.checked === true)
		let currentChecked = selOpt.map((item) => {
				return {value: item.slug, label:item.name }
			}
		)

		console.log(currentChecked);
		setSelectedOptions(currentChecked);
		handleSelectChange(currentChecked);
		handleItemClick(currentChecked)
	}


    return (
		<>
			<style>
                {`
                    .type-check+label {
                        background-color: #0000000D;
                    }
                    .type-check:checked+label {
                        background-color: #24182E;
                        color: #fff;
                    }
                `}
            </style>
			<div className="text-center border border-b-0 lg:border-b border-gray-300 border-t-0 pt-5 lg:pb-5 flex items-center justify-center col-span-2">
				<p className="text-black text-base font-bold">Type</p>
			</div>
			<div className="text-center border border-gray-300 border-t-0 py-5 col-span-10">
				<div className="navigation-wrapper relative">
					<div className="w-[90%] m-auto">
						<div ref={ref} className="keen-slider">
							{typeFilterItems?.map((item,index) => 
								<div key={index}>
									<input type="radio" className="hidden-check type-check" name="diamondtype" checked={item.checked} onChange={(e) => checkChange(index,e)} id={`typecb${index}`} />
									<label className="keen-slider__slide flex justify-center react-tab align-center p-3 md:max-w-auto rounded-md" htmlFor={`typecb${index}`}> <p className="font-semibold text-sm">{item.display_name}</p> </label>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
    );
};
