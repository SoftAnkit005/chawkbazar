// import { useRouter } from "next/router";
// import React, { useState, useEffect } from 'react';
// import ReactSelect from "react-select";

// const locationFilterItems = [
//     {
//         id: "1",
//         name: "INDIA",
//         slug: "INDIA",
//     },
//     {
//         id: "2",
//         name: "USA",
//         slug: "USA",
//     },
//     {
//         id: "3",
//         name: "NEW YORK",
//         slug: "NEW YORK",
//     },
//     {
//         id: "4",
//         name: "LOS ANGELES",
//         slug: "LOS ANGELES",
//     },
//     {
//         id: "5",
//         name: "HONG KONG",
//         slug: "HONG KONG",
//     },
//     {
//         id: "6",
//         name: "BELGIUM",
//         slug: "BELGIUM",
//     },
//     {
//         id: "7",
//         name: "ISRAEL",
//         slug: "ISRAEL",
//     },
//     {
//         id: "8",
//         name: "CHINA",
//         slug: "CHINA",
//     },
//     {
//         id: "9",
//         name: "EUROPE",
//         slug: "EUROPE",
//     },
//     {
//         id: "10",
//         name: "JAPAN",
//         slug: "JAPAN",
//     },
//     {
//         id: "11",
//         name: "UNITED KINGDOM",
//         slug: "UNITED KINGDOM",
//     },
//     {
//         id: "12",
//         name: "AUSTRALIA",
//         slug: "AUSTRALIA",
//     },
// ];

// export const LocationFilter = () => {
//     const router = useRouter();
//     const { pathname, query } = router;
//     const selectedLocations = query?.location ? [(query.location as string)] : [];
//     const [selectedOptions, setSelectedOptions] = useState<any[]>(
//         locationFilterItems
//             .filter(item => selectedLocations.includes(item.slug))
//             .map(item => ({ value: item.slug, label: item.name }))
//     );

//     const [isMobile, setIsMobile] = useState(false);

//     useEffect(() => {
//         const handleResize = () => {
//             setIsMobile(window.innerWidth < 768); // Adjust the threshold as needed
//         };

//         // Initial check for mobile/desktop view
//         handleResize();

//         window.addEventListener('resize', handleResize);
//         return () => {
//             window.removeEventListener('resize', handleResize);
//         };
//     }, []);

//     const applyFilter = (selectedLocations: string[]) => {
//         const filteredItems = locationFilterItems.filter(item => selectedLocations.includes(item.slug));
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


//     function handleItemClick(selectedOptions: any[]): void {
//         const values = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];

//         const newQuery = { ...query };

//         delete newQuery['location'];

//         if (values.length > 0) {
//             newQuery['location'] = values;
//         }

//         const queryString = Object.keys(newQuery)
//             .map(key => {
//                 if (Array.isArray(newQuery[key])) {
//                     return newQuery[key].map(value => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
//                 } else {
//                     return `${encodeURIComponent(key)}=${encodeURIComponent(newQuery[key])}`;
//                 }
//             })
//             .join('&');

//         router.push(
//             {
//                 pathname,
//                 search: `?${queryString}`,
//             },
//             undefined,
//             { scroll: false }
//         );
//     }

//     const Option = ({ children, ...props }: any) => (
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <label style={{ fontSize: '12px', marginRight: '5px', marginLeft: '10px' }}>{children}</label>
//             <input
//                 type="checkbox"
//                 {...props.innerProps}
//                 checked={props.isSelected}
//                 onChange={() => {
//                     const updatedOptions = props.isSelected
//                         ? selectedOptions.filter(option => option.value !== props.value)
//                         : [...selectedOptions, { value: props.value, label: children }];
//                     handleSelectChange(updatedOptions);
//                 }}
//                 style={{ marginRight: '10px' }}
//             />
//         </div>
//     );

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
//                 {"Location"}
//             </h3>
//             <hr className="border-b border-gray-800 mt-0" style={{ marginTop: '-20px', marginBottom: '20px' }} />
//             <div className="mt-2 flex flex-col space-y-4">
//                 <ReactSelect
//                     className="h-12 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent"
//                     isMulti
//                     onChange={(selectedOptions) => handleItemClick(selectedOptions)}
//                     options={locationFilterItems.map(item => ({ value: item.slug, label: item.name }))}
//                     components={{
//                         Option,
//                         IndicatorSeparator: () => (
//                             <span style={customStyles.customIndicatorSeparator}>
//                                 <span style={customStyles.selectText}>Select</span>
//                             </span>
//                         )
//                     }}
//                     menuPortalTarget={isMobile ? null : document.body}
//                     hideSelectedOptions={false}
//                     styles={{
//                         multiValue: (provided, state) => ({
//                             ...provided,
//                             display: 'none'
//                         }),
//                         valueContainer: (provided, state) => ({
// 							...provided,
// 							// display: 'none',
// 							zIndex: '-9999',
// 							width: '0px',
// 							height: '0px',
// 						}),
//                     }}
//                 />
//             </div>
//         </div>
//     );
// };
import { useRouter } from "next/router";
import React, { useState, useEffect } from 'react';
import ReactSelect, { MultiValue } from "react-select";

const locationFilterItems = [
    {
        id: "1",
        name: "INDIA",
        slug: "INDIA",
    },
    {
        id: "2",
        name: "USA",
        slug: "USA",
    },
    {
        id: "3",
        name: "NEW YORK",
        slug: "NEW YORK",
    },
    {
        id: "4",
        name: "LOS ANGELES",
        slug: "LOS ANGELES",
    },
    {
        id: "5",
        name: "HONG KONG",
        slug: "HONG KONG",
    },
    {
        id: "6",
        name: "BELGIUM",
        slug: "BELGIUM",
    },
    {
        id: "7",
        name: "ISRAEL",
        slug: "ISRAEL",
    },
    {
        id: "8",
        name: "CHINA",
        slug: "CHINA",
    },
    {
        id: "9",
        name: "EUROPE",
        slug: "EUROPE",
    },
    {
        id: "10",
        name: "JAPAN",
        slug: "JAPAN",
    },
    {
        id: "11",
        name: "UNITED KINGDOM",
        slug: "UNITED KINGDOM",
    },
    {
        id: "12",
        name: "AUSTRALIA",
        slug: "AUSTRALIA",
    },
];

export const LocationFilter = () => {
    const router = useRouter();
    const { pathname, query } = router;
    const selectedLocations = query?.location ? [(query.location as string)] : [];
    const [selectedOptions, setSelectedOptions] = useState<any[]>(
        locationFilterItems
            .filter(item => selectedLocations.includes(item.slug))
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

    const applyFilter = (selectedLocations: string[]) => {
        const filteredItems = locationFilterItems.filter(item => selectedLocations.includes(item.slug));
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

    function handleItemClick(selectedOptions: MultiValue<{ value: string; label: string }>): void {
        const values = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];

        const newQuery = { ...query };

        delete newQuery['location'];

        if (values.length > 0) {
            newQuery['location'] = values;
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

    return (
        <>
            <style>
                {`
                    .css-13cymwt-control, .css-t3ipsp-control{
                        background-color: rgb(241 241 241) !important;
                        color: #000 !important;
                        border:none !important;
                    }
                    .css-1hb7zxy-IndicatorsContainer span{
                        display: none !important;
                    }
                   
                `}
            </style>
            <div className="text-center border border-gray-300 border-t-0 p-5 col-span-6 lg:rounded-bl-3xl">
                <div className="block mx-auto rounded-lg">
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center w-full lg:w-1/2 m-auto">
                            <h3 className="text-black text-base font-bold mr-3"> {"Location"} </h3>
                            <ReactSelect
                                className="text-sm rounded-lg w-full"
                                isMulti
                                placeholder=""
                                onChange={(selectedOptions) => handleItemClick(selectedOptions)}
                                options={locationFilterItems.map(item => ({ value: item.slug, label: item.name }))}
                                components={{
                                    Option,
                                    IndicatorSeparator: () => (
                                        <span style={customStyles.customIndicatorSeparator}>
                                            <span style={customStyles.selectText}>Select</span>
                                        </span>
                                    )
                                }}
                                // menuPortalTarget={isMobile ? null : document.body}
                                hideSelectedOptions={false}
                                styles={{
                                    multiValue: (provided, state) => ({
                                        ...provided,
                                        // display: 'none'
                                    }),
                                    valueContainer: (provided, state) => ({
                                        ...provided,
                                        // display: 'none',
                                        zIndex: '0',
                                        width: '100%',
                                        height: '100%',
                                    }),
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
