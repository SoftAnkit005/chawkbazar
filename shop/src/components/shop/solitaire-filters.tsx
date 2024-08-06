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
import { useRouter } from "next/router";
import isEmpty from "lodash/isEmpty";
import { useTranslation } from "next-i18next";
import { useAttributesQuery } from "@framework/attributes/attributes.query";
import { orderBy } from "lodash";
import useUser from "@framework/auth/use-user";
import { useWindowSize } from "@utils/use-window-size";
import header_pattern from "../../../public/assets/images/filter-images/header_pattern.png"
import Image from "next/image";
import React , { useState } from "react";
import SolitaireFilterCarousel from "./solitaire-filter-carousel";


export const SolitaireFilters: React.FC = () => {
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
		<>
			<div className={"pt-1 " + ((deviceWidth > 1024 && query?.category !== "solitaire") ? "flex" : "flex flex-col")}>
				<div className={"block pb-7 mb-7 m-10 order-2 " + (deviceWidth > 1024 ? "w-full" : "")} style={{ margin: '15px 0px' }}>
					<div className="flex items-center justify-between mb-2.5">
						<h2 className="font-semibold text-heading text-xl md:text-2xl">Solitaire {t("text-filters")} </h2>
						<button className="flex-shrink text-xs bg-[#24182E] p-2 text-white rounded mt-0.5 transition duration-150 ease-in focus:outline-none hover:text-heading hover:bg-[#24182c1c]" aria-label="Clear All" onClick={() => { router.push(pathname); }} style={{ marginRight: '20px' }} > {t("text-clear-all")} </button>
					</div>
					<div className="flex flex-wrap -m-1.5 pt-2">
						{!isEmpty(query) && Object.values(query) .join(",") .split(",") .map((v, idx) => (
							<FilteredItem itemKey={ Object.keys(query).find((k) => query[k]?.includes(v))! } itemValue={v} key={idx} filterType="solitaire" filterChanged={filterchange} />
						))}
					</div>
				</div>
				<SolitaireFilterCarousel/>
				<div className="w-full lg:w-10/12 my-5 m-auto order-1">
					{/* <h2 className="text-center text-black my-5 text-base">Quick Search Solitaire Diamonds</h2> */}
					<div className="text-center my-5">
						<Image src={header_pattern} />
					</div>
					<div className="rounded-3xl">
						<div className="bg-[#24182E] text-white p-4 rounded-t-3xl text-center">
							<h2>Your journey to the finest <span className="text-[#CA1F3F] fw-bold">Solitaires </span> from the leading manufacturers.</h2>
						</div>
						<div>
							<div className="lg:grid lg:grid-cols-12">
								<TypeFilter changedFilter={changedFilter}/>
								<ShapeFilter changedFilter={changedFilter}/>
								<SizeFilter />
								<ClarityFilter changedFilter={changedFilter}/>
								<ColorsFilter changedFilter={changedFilter}/>
								<FluorescenceFilter changedFilter={changedFilter}/>
								<LabFilter changedFilter={changedFilter}/>
								<CutFilter />
								<PolishFilter />
								<SymmetryFilter />
								<LocationFilter />
								<PriceFilter />
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
