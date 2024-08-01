import { useRouter } from "next/router";
import React, { useState, useEffect } from 'react';
import ReactSelect from "react-select";

const shapeFilterItems = [
	{
		id: "1",
		name: "ROUND",
		slug: "ROUND",
	},
	{
		id: "2",
		name: "PEAR",
		slug: "PEAR",
	},
	{
		id: "3",
		name: "OVAL",
		slug: "OVAL",
	},
	{
		id: "4",
		name: "MARQUISE",
		slug: "MARQUISE",
	},
	{
		id: "5",
		name: "HEART",
		slug: "HEART",
	},
	{
		id: "6",
		name: "RADIANT",
		slug: "RADIANT",
	},
	{
		id: "7",
		name: "PRINCESS",
		slug: "PRINCESS",
	},
	{
		id: "8",
		name: "EMERALD",
		slug: "EMERALD",
	},
	{
		id: "9",
		name: "ASSCHER",
		slug: "ASSCHER",
	},
	{
		id: "10",
		name: "SQ.EMERALD",
		slug: "SQ.EMERALD",
	},
	{
		id: "12",
		name: "SQUARE RADIANT",
		slug: "SQUARE RADIANT",
	},
	{
		id: "13",
		name: "CUSHION",
		slug: "CUSHION",
	},
	{
		id: "14",
		name: "BAGUETTE",
		slug: "BAGUETTE",
	},
	{
		id: "15",
		name: "EUROPEAN CUT",
		slug: "EUROPEAN CUT",
	},
];


export const ShapeFilter = () => {
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


	function handleItemClick(selectedOptions: any[]): void {
		const values = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
	
		// Create a copy of the current query object
		const newQuery = { ...query };
	
		// Remove the 'shape' parameter from the query object
		delete newQuery['shape'];
	
		// If there are selected options, add the updated 'shape' parameter
		if (values.length > 0) {
			newQuery['shape'] = values;
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


    return (
        <div className="block border-b border-gray-300 pb-7 mb-7 mx-auto my-4 bg-gray-300 rounded-lg" style={{ padding: "10px", maxWidth: "300px", margin: '1rem' }}>
            <h3 className="text-heading text-sm md:text-base font-semibold mb-7 w-44">
                {"Shape"}
            </h3>
            <hr className="border-b border-gray-800 mt-0" style={{ marginTop: '-20px', marginBottom: '20px' }} />
            <div className="mt-2 flex flex-col space-y-4">
				<ReactSelect
					className="h-12 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent"
					isMulti
					onChange={(selectedOptions) => handleItemClick(selectedOptions)}
					options={shapeFilterItems.map(item => ({ value: item.slug, label: item.name }))}
					components={{ Option, // Assuming you already have some components defined
					IndicatorSeparator: () => (
						<span style={customStyles.customIndicatorSeparator}>
							{/* Add the "Select" text here */}
							<span style={customStyles.selectText}>Select</span>
							{/* Add the original indicator separator */}
							{/* <span className="css-1okebmr-indicatorSeparator"></span> */}
						</span>
					)
				}}					
					// menuPortalTarget={document.body}
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
        </div>
    );
};
