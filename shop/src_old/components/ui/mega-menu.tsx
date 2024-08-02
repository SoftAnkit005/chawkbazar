import React, { useState } from "react";
import Link from "@components/ui/link";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { Attachment } from "@framework/types";
import { orderBy } from "lodash";


interface MenuItem {
	id: number | string;
	path: string;
	label: string;
	type:string;
	icon?:Attachment;
	columnItemItems?: MenuItem[];
}
type MegaMenuProps = {
	columns: {
		id: number | string;
		columnItems: MenuItem[];
		pricePath:string;
		banners:any;
		bannerSlug1:any;
		bannerSlug2:any;
		priceFilterItems:[];
	}[];
};

const priceFilterItems = [
	{
		id: "1",
		name: "Under 5000",
		slug: "0-5000",
	},
	{
		id: "2",
		name: "5000 to 10000",
		slug: "5000-10000",
	},
	{
		id: "3",
		name: "10000 to 50000",
		slug: "10000-50000",
	},
	{
		id: "4",
		name: "50000 to 50000",
		slug: "50000-50000",
	},
	{
		id: "5",
		name: "100000 to 500000",
		slug: "100000-500000",
	},
	{
		id: "6",
		name: "Over 500000",
		slug: "500000+",
	},
];

const MegaMenu: React.FC<MegaMenuProps> = ({ columns }) => {
	const [isHidden, setIsHidden] = useState(false);
	function hideThisMenu(){
		setIsHidden(true);
		setTimeout(()=>{
			setIsHidden(false);
		},1);
	}
	const { t } = useTranslation("menu");
	columns = columns.map((y:any)=>{
		y.priceFilterItems = priceFilterItems;
		return y;
	})
	return (
		<div style={{display: isHidden ? "none" : "block"}} className="row megaMenu shadow-header bg-gray-200 absolute ltr:-left-20 rtl:-right-20 ltr:xl:left-0 rtl:xl:right-0 opacity-0 group-hover:opacity-100 group-hover:visible"
		>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
						
						<div                       className="sm:col-span-2"
						style={{margin:"20px"}}
>
	{/* <label
	style={{color:"navy"}}
										className="block text-center text-sm py-1.5 text-heading font-semibold px-5 xl:px-8 2xl:px-10 hover:text-heading hover:font-bold"
	>Popular Items</label>
	<hr style={{border:"1px dashed grey", margin:"10px"}}/> */}
				{columns?.map((column) => (
					<ul
						key={column.id}
						style={{columnCount:2}}
					>
						{orderBy(column?.columnItems,['sequence'],['asc'])?.map((columnItem) => (
							// (columnItem?.type == 'cat')
							// ?
							<React.Fragment key={columnItem?.id}>
								<li className="mb-1.5"
										style={{width:"250px"}}
										onClick={hideThisMenu}
								>
									<Link
										href={columnItem?.path || '/'}
										className="block text-center text-xs py-1.5 text-heading font-semibold px-5 xl:px-8 2xl:px-10 hover:text-heading hover:font-bold"
									>
										<span style={{display:"flex"}}>
										<img src={columnItem?.icon?.thumbnail} style={{width:"30px", height:"30px", borderRadius:"50%"}} />
										<span style={{marginLeft:"20px",padding:"5px"}}>
										{t(columnItem?.label || "")}
										</span>
										</span>
									</Link>
								</li>
								{columnItem?.columnItemItems?.map((item: any) => (
									<li
									onClick={hideThisMenu}
										key={item.id}
										className={
											columnItem?.columnItemItems?.length === item.id
												? "border-b border-gray-300 pb-3.5 mb-3"
												: ""
										}
									>
										<Link
											href={item.path}
											className="text-body text-sm block py-1.5 px-5 xl:px-8 2xl:px-10 hover:text-heading hover:font-bold"
										>
											{t(item.label)}
										</Link>
									</li>
								))}
							</React.Fragment>
							// :<span></span>
						))}
					</ul>
				))}
				</div>
						<div                       className="sm:col-span-1"
						style={{margin:"20px"}}
>
						<ul
						style={{width:"200px"}}
						>
						<React.Fragment>
							<li className="mb-1.5"
							 onClick={hideThisMenu}
							>
								
	<label
	style={{color:"navy"}}
										className="block text-center text-sm py-1.5 text-heading font-semibold px-5 xl:px-8 2xl:px-10 hover:text-heading hover:font-bold"
	>By Price Range</label>
	<hr style={{border:"1px dashed grey", margin:"10px"}}/>
	{columns?.[0]?.priceFilterItems?.map((item: any) => (
					<Link
					href={"/search?price="+item.slug+"&"+columns?.[0]?.pricePath}
					className="block text-center text-xs py-2 text-heading font-semibold px-5 xl:px-8 2xl:px-10 hover:text-heading hover:font-bold my-0"
>
						{item.name}
					</Link>
				))}
							</li>
							</React.Fragment>
						</ul>
		</div>
		{/* <div                       className="sm:col-span-1"
						style={{margin:"20px"}}
>								
	{/* <label
	style={{color:"navy"}}
										className="block text-center text-sm py-1.5 text-heading font-semibold px-5 xl:px-8 2xl:px-10 hover:text-heading hover:font-bold"
	>Popular Collections</label>
	<hr style={{border:"1px dashed grey", margin:"10px"}}/> */}
	{/* {columns?.map((column) => (
					<ul
						key={column.id}
					>
						{column?.columnItems?.map((columnItem) => (
							(columnItem?.type == 'col')
							?
							<React.Fragment key={columnItem?.id}>
								<li className="mb-1.5">
									<Link
										href={columnItem?.path || '/'}
										className="block text-center text-xs py-1.5 text-heading font-semibold px-5 xl:px-8 2xl:px-10 hover:text-heading hover:font-bold"
									>
										<span style={{display:"flex"}}>
										<img src={columnItem?.icon?.thumbnail} style={{width:"30px", height:"30px", borderRadius:"50%"}} />
										<span style={{margin:"10px", marginLeft:"40px"}}>
										{t(columnItem?.label || "")}
										</span>
										</span>
									</Link>
								</li>
								{columnItem?.columnItemItems?.map((item: any) => (
									<li
										key={item.id}
										className={
											columnItem?.columnItemItems?.length === item.id
												? "border-b border-gray-300 pb-3.5 mb-3"
												: ""
										}
									>
										<Link
											href={item.path}
											className="text-body text-sm block py-1.5 px-5 xl:px-8 2xl:px-10 hover:text-heading hover:font-bold"
										>
											{t(item.label)}
										</Link>
									</li>
								))}
							</React.Fragment>
							:<span></span>
						))}
					</ul>
				))}
</div> */}
<div                       className="sm:col-span-1"
						style={{margin:"20px"}}
>
						<ul>
						<React.Fragment>
							<li className="mb-1.5"  onClick={hideThisMenu}>
								
	{/* <label
	style={{color:"navy"}}
										className="block text-center text-sm py-1.5 text-heading font-semibold px-5 xl:px-8 2xl:px-10 hover:text-heading hover:font-bold"
	>By Collection</label>
	<hr style={{border:"1px dashed grey", margin:"10px"}}/> */}
	{
		columns?.[0]?.banners?.[0]?.thumbnail ?
		<Link
		href={columns?.[0]?.bannerSlug1 || "/"}>
		<Image 
		src={columns?.[0]?.banners?.[0]?.thumbnail} 
		width={"300"} 
		height={"250"} 
		quality={100}
		/> 
		</Link>
		: <span></span>
	}
	{
		columns?.[0]?.banners?.[1]?.thumbnail ?
		<Link
		href={columns?.[0]?.bannerSlug2 || "/"}>
		<Image 
		src={columns?.[0]?.banners?.[1]?.thumbnail} 
		width={"300"} 
		height={"250"}
		quality={100}
		/> 
		</Link>
		: <span></span>
	}
</li>
</React.Fragment>
</ul>
</div>
</div>
		</div>
	);
};

export default MegaMenu;
