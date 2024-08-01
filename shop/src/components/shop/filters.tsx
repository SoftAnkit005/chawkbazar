// import { CategoryFilter } from "./category-filter";
// import { BrandFilter } from "./brand-filter";
// import { FilteredItem } from "./filtered-item";
// import { PriceFilter } from "./price-filter";
// import { ShapeFilter } from "./shape-filter";
// import { TypeFilter } from "./type-filter";
// import { SizeFilter } from "./size-filter";
// import { ColorsFilter } from "./colors-filter";
// import { ClarityFilter } from "./clarity-filter";
// import { CutFilter } from "./cut-filter";
// import { PolishFilter } from "./polish-filter";
// import { SymmetryFilter } from "./symmetry-filter";
// import { FluorescenceFilter } from "./fluorescence-filter";
// import { LabFilter } from "./lab-filter";
// import { LocationFilter } from "./location-filter";
// import { DiscountFilter } from "./discount-filter";
// import { useRouter } from "next/router";
// import isEmpty from "lodash/isEmpty";
// import { useTranslation } from "next-i18next";
// import { useAttributesQuery } from "@framework/attributes/attributes.query";
// import { AttributesFilter } from "@components/shop/attributes-filter";
// import { orderBy } from "lodash";
// import useUser from "@framework/auth/use-user";
// import { useWindowSize } from "@utils/use-window-size";
// import { PriceFilterNonSol } from "./price-filter-nonsol";
// import { Button } from "react-scroll";

// export const ShopFilters: React.FC = () => {
// 	const router = useRouter();
// 	const { me } = useUser();
// 	const { pathname, query } = router;
// 	const { t } = useTranslation("common");
// 	let { data } = useAttributesQuery();
// 	if (data && data?.attributes && data?.attributes.length) {
// 		data.attributes = data?.attributes?.map((x: any) => {
// 			x.values = x.values.filter((y: any) => y.vendor_type == (me?.business_profile[Object.keys(me?.business_profile)[0]]?.customer_type || orderBy(me?.shops, ["customer_type"], ["desc"])?.[0]?.customer_type || 1));
// 			return x;
// 		})
// 	}
// 	const { width: deviceWidth } = useWindowSize();
// 	return (
// 		<div className={"pt-1 " + (deviceWidth > 1024 ? "flex" : "")} style={{ margin: "-30px" }}>

// 			<style>
// 				{
// 					`
// 			.css-1s2u09g-control{
// 				width:100%;
// 			}

// 			.css-1pahdxg-control{
// 				width:100%;
// 			}

// 			.css-26l3qy-menu{
// 				font-size:10px;
// 			}
// 			`
// 				}
// 			</style>
// 			<div className={"block border-b border-gray-300 pb-7 mb-7 m-10 " + (deviceWidth > 1024 ? "w-48" : "")} style={{ margin: '15px 0px' }}>
// 				<div className="flex items-center justify-between mb-2.5">
// 					<h2 className="font-semibold text-heading text-xl md:text-2xl" style={{ margin: '0px 20px' }}>
// 						{t("text-filters")}
// 					</h2>
// 					<button
// 						className="flex-shrink text-xs mt-0.5 transition duration-150 ease-in focus:outline-none hover:text-heading"
// 						aria-label="Clear All"
// 						onClick={() => {
// 							router.push(pathname);
// 						}}
// 						style={{ marginRight: '20px' }}
// 					>
// 						{t("text-clear-all")}
// 					</button>
// 				</div>
// 				<div className="flex flex-wrap -m-1.5 pt-2">
// 					{!isEmpty(query) &&
// 						Object.values(query)
// 							.join(",")
// 							.split(",")
// 							.map((v, idx) => (
// 								<FilteredItem
// 									itemKey={
// 										Object.keys(query).find((k) => query[k]?.includes(v))!
// 									}
// 									itemValue={v}
// 									key={idx}
// 								/>
// 							))}
// 				</div>
// 			</div>

// 			{
// 				query?.category === "solitaire" ?
				
// 				<div>
					
// 					<div className={"pt-1 " + (deviceWidth > 1024 ? "flex" : "")}>
// 						<TypeFilter />
// 						<ShapeFilter />
// 						<SizeFilter />
// 						<ClarityFilter />
// 						<ColorsFilter />
// 						<CutFilter />
// 						<PolishFilter />
// 					</div>
// 					<div className={"pt-1 " + (deviceWidth > 1024 ? "flex" : "")}>
// 						<SymmetryFilter />
// 						<FluorescenceFilter />
// 						<LabFilter />
// 						<LocationFilter />						
// 						<PriceFilter />
// 					</div>
// 				</div>
// 				:
// 				query?.category === "silver" ?				
// 				<div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
// 					<div className={"pt-1 " + (deviceWidth > 1024 ? "flex" : "")} style={{ display: "flex", flexWrap: "wrap" }}>
// 						<CategoryFilter />
// 						<BrandFilter />
// 						<PriceFilterNonSol />
// 						{data && <AttributesFilter attributes={data.attributes} from={0} to={6} />}
// 						{data && <AttributesFilter attributes={data.attributes} from={7} to={10} />}
// 					</div>
// 				</div>				
// 				:
// 				query?.category === "gold" ?				
// 				<div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
// 					<div className={"pt-1 " + (deviceWidth > 1024 ? "flex" : "")} style={{ display: "flex", flexWrap: "wrap" }}>
// 						<CategoryFilter />
// 						<BrandFilter />
// 						<PriceFilterNonSol />\
// 						{data && <AttributesFilter attributes={data.attributes} from={0} to={6} />}
// 						{data && <AttributesFilter attributes={data.attributes} from={7} to={10} />}
// 					</div>
// 				</div>				
// 				:
// 				query?.category === "diamond" ?				
// 				<div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
// 					<div className={"pt-1 " + (deviceWidth > 1024 ? "flex" : "")} style={{ display: "flex", flexWrap: "wrap" }}>
// 						<CategoryFilter />
// 						<BrandFilter />
// 						<PriceFilterNonSol />
// 						{data && <AttributesFilter attributes={data.attributes} from={0} to={6} />}
// 						{data && <AttributesFilter attributes={data.attributes} from={7} to={10} />}
// 					</div>
// 				</div>				
// 				:
// 				<div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
// 					<div className={"pt-1 " + (deviceWidth > 1024 ? "flex" : "")} style={{ display: "flex", flexWrap: "wrap" }}>
// 						<CategoryFilter />
// 						<BrandFilter />
// 						<PriceFilterNonSol />
// 						{data && <AttributesFilter attributes={data.attributes} from={0} to={6} />}
// 						{data && <AttributesFilter attributes={data.attributes} from={7} to={10} />}
// 					</div>
// 				</div>
// 			}

// 		</div>

// 	);
// };
import { CategoryFilter } from "./category-filter";
import { BrandFilter } from "./brand-filter";
import { FilteredItem } from "./filtered-item";
import { PriceFilter } from "./price-filter";
import { ShapeFilter } from "./shape-filter";
import { TypeFilter } from "./type-filter";
import { SizeFilter } from "./size-filter";
import { ColorsFilter } from "./colors-filter";
import { ClarityFilter } from "./clarity-filter";
import { CutFilter } from "./cut-filter";
import { PolishFilter } from "./polish-filter";
import { SymmetryFilter } from "./symmetry-filter";
import { FluorescenceFilter } from "./fluorescence-filter";
import { LabFilter } from "./lab-filter";
import { LocationFilter } from "./location-filter";
import { DiscountFilter } from "./discount-filter";
import { useRouter } from "next/router";
import isEmpty from "lodash/isEmpty";
import { useTranslation } from "next-i18next";
import { useAttributesQuery } from "@framework/attributes/attributes.query";
import { AttributesFilter } from "@components/shop/attributes-filter";
import { orderBy } from "lodash";
import useUser from "@framework/auth/use-user";
import { useWindowSize } from "@utils/use-window-size";
import { PriceFilterNonSol } from "./price-filter-nonsol";
import { Button } from "react-scroll";
import { useState } from "react";

export const ShopFilters: React.FC = () => {
	const router = useRouter();
	const { me } = useUser();
	const { pathname, query } = router;
	const { t } = useTranslation("common");
	let { data } = useAttributesQuery();
	if (data && data?.attributes && data?.attributes.length) {
		data.attributes = data?.attributes?.map((x: any) => {
			x.values = x.values.filter((y: any) => y.vendor_type == (me?.business_profile[Object.keys(me?.business_profile)[0]]?.customer_type || orderBy(me?.shops, ["customer_type"], ["desc"])?.[0]?.customer_type || 1));
			return x;
		})
	}
	const { width: deviceWidth } = useWindowSize();

	const [changedFilter, setchangedFilter] = useState("")
	const filterchange = (val:string) => {
		setchangedFilter(val);
	}
	return (
		<div className={"pt-1 " + (deviceWidth > 1024 ? "flex" : "")}>

			<style>
				{
					`
			.css-1s2u09g-control{
				width:100%;
			}

			.css-1pahdxg-control{
				width:100%;
			}

			.css-26l3qy-menu{
				font-size:10px;
			}
			`
				}
			</style>
			{query?.category === "solitaire" ?
				<div className={"block border-b border-gray-300 pb-7 mb-7 m-10 " + (deviceWidth > 1024 ? "w-48" : "")} style={{ margin: '15px 0px' }}>
					<div className="flex items-center justify-between mb-2.5">
						<h2 className="font-semibold text-heading text-xl md:text-2xl">Solitaire {t("text-filters")} </h2>
						<button className="flex-shrink text-xs bg-[#24182E] p-2 text-white rounded mt-0.5 transition duration-150 ease-in focus:outline-none hover:text-heading hover:bg-[#24182c1c]" aria-label="Clear All" onClick={() => { router.push(pathname); }} > {t("text-clear-all")} </button>
					</div>
					<div className="flex flex-wrap -m-1.5 pt-2">
						{!isEmpty(query) && Object.values(query) .join(",") .split(",") .map((v, idx) => (
							<FilteredItem itemKey={ Object.keys(query).find((k) => query[k]?.includes(v))! } itemValue={v} key={idx} filterType="solitaire" filterChanged={filterchange} />
						))}
					</div>
				</div>
			:
				<div className={"block border-b border-gray-300 pb-7 mb-7 m-10 " + (deviceWidth > 1024 ? "w-48" : "")} style={{ margin: '15px 0px' }}>
					<div className="flex items-center justify-between mb-2.5">
						<h2 className="font-semibold text-heading text-xl md:text-2xl" style={{ margin: '0px 20px' }}> {t("text-filters")} </h2>
						<button className="flex-shrink text-xs mt-0.5 transition duration-150 ease-in focus:outline-none hover:text-heading" aria-label="Clear All" onClick={() => { router.push(pathname); }} style={{ marginRight: '20px' }} > {t("text-clear-all")} </button>
					</div>
					<div className="flex flex-wrap -m-1.5 pt-2">
						{!isEmpty(query) && Object.values(query) .join(",") .split(",") .map((v, idx) => (
							<FilteredItem itemKey={ Object.keys(query).find((k) => query[k]?.includes(v))! } itemValue={v} filterType="" key={idx} filterChanged={undefined} />
						))}
					</div>
				</div>
			}

			{
				query?.category === "solitaire" ?
				
				<div>
					
					<div className={"pt-1 " + (deviceWidth > 1024 ? "flex" : "")}>
						<TypeFilter changedFilter={changedFilter}/>
						<ShapeFilter changedFilter={changedFilter}/>
						<SizeFilter />
						<ClarityFilter changedFilter={changedFilter}/>
						<ColorsFilter changedFilter={changedFilter}/>
						<CutFilter />
						<PolishFilter />
					</div>
					<div className={"pt-1 " + (deviceWidth > 1024 ? "flex" : "")}>
						<SymmetryFilter />
						<FluorescenceFilter changedFilter={changedFilter}/>
						<LabFilter changedFilter={changedFilter}/>
						<LocationFilter />						
						<PriceFilter />
					</div>
				</div>
				:
				query?.category === "silver" ?				
				<div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
					<div className={"pt-1 " + (deviceWidth > 1024 ? "flex" : "")} style={{ display: "flex", flexWrap: "wrap" }}>
						<CategoryFilter />
						<BrandFilter />
						<PriceFilterNonSol />
						{data && <AttributesFilter attributes={data.attributes} from={0} to={6} />}
						{data && <AttributesFilter attributes={data.attributes} from={7} to={10} />}
					</div>
				</div>				
				:
				query?.category === "gold" ?				
				<div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
					<div className={"pt-1 " + (deviceWidth > 1024 ? "flex" : "")} style={{ display: "flex", flexWrap: "wrap" }}>
						<CategoryFilter />
						<BrandFilter />
						<PriceFilterNonSol />\
						{data && <AttributesFilter attributes={data.attributes} from={0} to={6} />}
						{data && <AttributesFilter attributes={data.attributes} from={7} to={10} />}
					</div>
				</div>				
				:
				query?.category === "diamond" ?				
				<div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
					<div className={"pt-1 " + (deviceWidth > 1024 ? "flex" : "")} style={{ display: "flex", flexWrap: "wrap" }}>
						<CategoryFilter />
						<BrandFilter />
						<PriceFilterNonSol />
						{data && <AttributesFilter attributes={data.attributes} from={0} to={6} />}
						{data && <AttributesFilter attributes={data.attributes} from={7} to={10} />}
					</div>
				</div>				
				:
				<div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
					<div className={"pt-1 " + (deviceWidth > 1024 ? "flex" : "")} style={{ display: "flex", flexWrap: "wrap" }}>
						<CategoryFilter />
						<BrandFilter />
						<PriceFilterNonSol />
						{data && <AttributesFilter attributes={data.attributes} from={0} to={6} />}
						{data && <AttributesFilter attributes={data.attributes} from={7} to={10} />}
					</div>
				</div>
			}

		</div>

	);
};
