import { useRouter } from "next/router";
import React, { useState, useEffect } from 'react';
import ReactSelect from "react-select";

const labFilterItems = [
    {
        id: "1",
        name: "GIA",
        slug: "GIA",
    },
    {
        id: "2",
        name: "AGS",
        slug: "AGS",
    },
    {
        id: "3",
        name: "DBIOD",
        slug: "DBIOD",
    },
    {
        id: "4",
        name: "DHI",
        slug: "DHI",
    },
    {
        id: "5",
        name: "HRD",
        slug: "HRD",
    },
    {
        id: "6",
        name: "NGTC",
        slug: "NGTC",
    },
    {
        id: "7",
        name: "GIA DOR",
        slug: "GIA DOR",
    },
    {
        id: "8",
        name: "CGL",
        slug: "CGL",
    },
    {
        id: "9",
        name: "GCAL",
        slug: "GCAL",
    },
    {
        id: "10",
        name: "GSI",
        slug: "GSI",
    },
    {
        id: "11",
        name: "IGI",
        slug: "IGI",
    },
];

export const LabFilter = () => {
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

    return (
        <div className="block border-b border-gray-300 pb-7 mb-7 mx-auto my-4 bg-gray-300 rounded-lg" style={{ padding: "10px", maxWidth: "300px", margin: '1rem' }}>
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
        </div>
    );
};
