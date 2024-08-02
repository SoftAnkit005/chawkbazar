import { CategoryFilter } from "./category-filter";
import { BrandFilter } from "./brand-filter";
import { FilteredItem } from "./filtered-item";
import { useRouter } from "next/router";
import isEmpty from "lodash/isEmpty";
import { useTranslation } from "next-i18next";
import { useAttributesQuery } from "@framework/attributes/attributes.query";
import { AttributesFilter } from "@components/shop/attributes-filter";
import { orderBy } from "lodash";
import useUser from "@framework/auth/use-user";
import { useWindowSize } from "@utils/use-window-size";
import { PriceFilterNonSol } from "./price-filter-nonsol";
import "keen-slider/keen-slider.min.css"

export const NewShopFilters: React.FC = () => {
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
	return (
		<>
			<style>
				{`
					.css-1s2u09g-control{
						width:100%;
					}

					.css-1pahdxg-control{
						width:100%;
					}

					.css-26l3qy-menu{
						font-size:10px;
					}
					
					.react-tabs__tab--selected{
						background-color: #24182E !important;
						color: #fff !important;
						border-radius: 10px !important;
					}
					
					.react-tab{
						background-color: #0000000D;
						color: #000;
						border-radius: 10px !important;
					}
				`}
			</style>
			<div className={"pt-1 " + ((deviceWidth > 1024 && query?.category !== "solitaire") ? "flex" : "flex flex-col")}>
				{query?.category === "solitaire" ?
					<></>
				:
					<div className={"block pb-7 mb-7 m-10 " + (deviceWidth > 1024 ? "w-48" : "")} style={{ margin: '15px 0px' }}>
						<div className="flex items-center justify-between mb-2.5">
							<h2 className="font-semibold text-heading text-xl md:text-2xl" style={{ margin: '0px 20px' }}> {t("text-filters")} </h2>
							<button className="flex-shrink text-xs mt-0.5 transition duration-150 ease-in focus:outline-none hover:text-heading" aria-label="Clear All" onClick={() => { router.push(pathname); }} style={{ marginRight: '20px' }} > {t("text-clear-all")} </button>
						</div>
						<div className="flex flex-wrap -m-1.5 pt-2">
							{!isEmpty(query) && Object.values(query) .join(",") .split(",") .map((v, idx) => (
								<FilteredItem itemKey={ Object.keys(query).find((k) => query[k]?.includes(v))! } itemValue={v} key={idx} filterType="" filterChanged={undefined}/>
							))}
						</div>
					</div>
				}

				{query?.category === "solitaire" ?
					<></>
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
		</>
	);
};
