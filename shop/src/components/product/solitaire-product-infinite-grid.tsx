import Button from "@components/ui/button";
import type { FC } from "react";
import { useState } from "react";
import { useTranslation } from "next-i18next";
import { Product } from "@framework/types";
import isEmpty from "lodash/isEmpty";
import NotFound from "@components/404/not-found";
import { Table } from "@components/ui/table";
import { useIsRTL } from "@lib/locals";
import usePrice from "@lib/use-price";
import cn from "classnames";
import { siteSettings } from "@settings/site.settings";
import { generateCartItem } from "@utils/generate-cart-item";
import { toast } from "react-toastify";
import { useCart } from "@store/quick-cart/cart.context";
import { useWindowSize } from "@utils/use-window-size";
import Link from "@components/ui/link";
import { ROUTES } from "@lib/routes";
import useUser from "@framework/auth/use-user";
import { cloneDeep, flatten, merge, orderBy } from "lodash";

interface SolitaireProductGridProps {
  className?: string;
  loading: boolean;
  data: any;
  hasNextPage: boolean | undefined;
  loadingMore: any;
  fetchNextPage: () => void;
}

export const SolitaireProductInfiniteGrid: FC<SolitaireProductGridProps> = ({
  loading,
  data,
  hasNextPage,
  loadingMore,
  fetchNextPage,
}) => {
  
  let productlist = flatten(data?.pages?.map((x:any)=>{
    return x?.data;
  }));
  
  productlist = flatten(productlist.map((item:any)=>{    
    item.admin_commission_rate_solitaire_customer = item.shop.balance.admin_commission_rate_solitaire_customer;
    return item;
  }));
  // console.log('data',productlist)
  const { me } = useUser();
  let stone_extra = 2;
 
  let customer_type = orderBy(me?.shops,['customer_type'],['asc'])[0]?.customer_type || null;
  //let admin_commission_rate = orderBy(me?.shops,['customer_type'],['asc'])[0]?.balance?.admin_commission_rate_solitaire || 0;
  const { t } = useTranslation();
const { alignLeft, alignRight } = useIsRTL();
const [quantity, setQuantity] = useState(1);
const [addToCartLoader, setAddToCartLoader] = useState<boolean>(false);
const { addItemToCart } = useCart();
let selectedVariation: any;
const { width } = useWindowSize();

function addToCart(product:any) {
    let productObj = cloneDeep(productlist?.find((x:any)=>x.id == Number(product.target.id.replace("product-",""))));

    if(productObj)
    {
      productObj['price'] = (!customer_type || customer_type == 1 ? stone_extra : 1)*Number(productObj['price']); 
    setAddToCartLoader(true);
    setTimeout(() => {
      setAddToCartLoader(false);
    }, 600);
    addItemToCart({
      id:productObj.id,
      name:productObj.name,
      slug:productObj.slug,
      unit:productObj.unit,
      image: productObj.image?.thumbnail,
      stock: quantity,
      price: productObj?.price,
    }, quantity);
    toast(t("add-to-cart"), {
      type: "dark",
      progressClassName: "fancy-progress-bar",
      position: width > 768 ? "bottom-right" : "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }
  }

  // If no product found
  if (!loading && isEmpty(productlist)) {
    return <NotFound text={t("text-no-products-found")} />;
  }

  function getShortForm(value:string)
  {
    
    if(value == "IDEAL")
    {
      return "ID"
    }
    else if(value == "EXCELLENT")
    {
      return "EX"
    }
    else if(value == "VERY GOOD")
    {
      return "VG"
    }
    else if(value == "GOOD")
    {
      return "G"
    }
    else if(value == "FAIR")
    {
      return "F"
    }
    else if(value == "VERY SLIGHT")
    {
      return "VS"
    }
    else if(value == "FAINT/SLIGHT")
    {
      return "FS"
    }
    else if(value == "FAINT")
    {
      return "F"
    }
    else if(value == "SLIGHT")
    {
      return "S"
    }
    else if(value == "MEDIUM")
    {
      return "M"
    }
    else if(value == "STRONG")
    {
      return "ST"
    }
    else if(value == "VERY STRONG")
    {
      return "VST"
    }
    return value;
  }

  const columns = [
    {
			title:"Style Code",
			className: "cursor-pointer",
			dataIndex: "stylecode",
			key: "stylecode",
			align: alignLeft,
			width: 90,
			ellipsis: true,
//			onHeaderCell: () => onHeaderClick("stylecode"),
		},
    {
			title:"Sheet Type",
			className: "cursor-pointer",
			dataIndex: "type_name",
			key: "type_name",
			align: alignLeft,
			width: 90,
			ellipsis: true,
//			onHeaderCell: () => onHeaderClick("stylecode"),
		},
		{
			title:"Shape",
    	className: "cursor-pointer",
			dataIndex: "shape",
			key: "shape",
			align: alignLeft,
			width: 90,
			ellipsis: true,
//			onHeaderCell: () => onHeaderClick("shape"),
		},
		{
			title: 
						"Wt"
,
			className: "cursor-pointer",
			dataIndex: "size",
			key: "size",
			align: alignLeft,
			width: 90,
			ellipsis: true,
//			onHeaderCell: () => onHeaderClick("size"),
render: (size:number) => (
  <span className="whitespace-nowrap truncate">{size.toFixed(2)}</span>
),
		},
		{
			title: 
						"Color"
					,
			className: "cursor-pointer",
			dataIndex: "color",
			key: "color",
			align: alignLeft,
			width: 90,
			ellipsis: true,
		//	onHeaderCell: () => onHeaderClick("color"),
		},
		{
			title: 
						"Clarity"
				,
			className: "cursor-pointer",
			dataIndex: "clarity",
			key: "clarity",
			align: alignLeft,
			width: 90,
			ellipsis: true,
		//	onHeaderCell: () => onHeaderClick("clarity"),
		},
		{
			title: "Cut"
					,
			className: "cursor-pointer",
			dataIndex: "cut",
			key: "cut",
			align: alignLeft,
			width: 90,
			ellipsis: true,
			//onHeaderCell: () => onHeaderClick("cut"),
      render: (cut:string) => (
        <span className="whitespace-nowrap truncate">{getShortForm(cut)}</span>
      ),
    },
		{
			title:	"Polish"
					,
			className: "cursor-pointer",
			dataIndex: "polish",
			key: "polish",
			align: alignLeft,
			width: 90,
			ellipsis: true,
			//onHeaderCell: () => onHeaderClick("polish"),
      render: (polish:string) => (
        <span className="whitespace-nowrap truncate">{getShortForm(polish)}</span>
      ),
		},
		{
			title: "Symmetry"
					,
			className: "cursor-pointer",
			dataIndex: "symmetry",
			key: "symmetry",
			align: alignLeft,
			width: 90,
			ellipsis: true,
		//	onHeaderCell: () => onHeaderClick("symmetry"),
    render: (symmetry:string) => (
      <span className="whitespace-nowrap truncate">{getShortForm(symmetry)}</span>
    ),	
  },
		{
			title: "Fluorescence"
					,
			className: "cursor-pointer",
			dataIndex: "fluorescence",
			key: "fluorescence",
			align: alignLeft,
			width: 90,
			ellipsis: true,
		//	onHeaderCell: () => onHeaderClick("fluorescence"),
    render: (fluorescence:string) => (
      <span className="whitespace-nowrap truncate">{getShortForm(fluorescence)}</span>
    ),		
  },
		{
			title: "Lab"
					,
			className: "cursor-pointer",
			dataIndex: "grading",
			key: "grading",
			align: alignLeft,
			width: 90,
			ellipsis: true,
	//		onHeaderCell: () => onHeaderClick("grading"),
		},
		{
			title: "Location",
			className: "cursor-pointer",
			dataIndex: "location",
			key: "location",
			align: alignLeft,
			width: 90,
			ellipsis: true,
			//onHeaderCell: () => onHeaderClick("location"),
		},
    {
      title: "Rap Rate",
      className: "cursor-pointer",
      dataIndex: "rap_rate",
      key: "rap_rate",
      align: "right",
      width: 90,
      ellipsis: true,
      
    },
		{
      title: "Discount %",
      className: "cursor-pointer",
      dataIndex: "discount",
      key: "discount",
      align: "right",
      width: 90,
      ellipsis: true,
      render: (discount: number, record: any) => {
        // Assuming customer_type is accessible from the record
        // const customer_type = record.customer_type;
    
        // Conditionally render discount or customer_discount based on customer_type
        // const displayDiscount = customer_type === 1;
    
        return (
          <span className="whitespace-nowrap truncate">-
            {customer_type ? 
              (discount == null ? "0 %" : Math.abs(discount).toFixed(2) + " %")
              : (record.customer_discount == null ? "0 %" : Math.abs(record.customer_discount).toFixed(2) + " %")}
          </span>
        );
      },
    },
		{
			title: "Rate Per Ct",
			className: "cursor-pointer",
			dataIndex: "rate_per_unit",
			key: "rate_per_unit",
			align: alignRight,
			width: 90,
			ellipsis: true,
			render: (rate_per_unit:number,record: any) => (
        
				<span className="whitespace-nowrap truncate">{"$"+(rate_per_unit == null ? "" : Number(((!customer_type || customer_type == 1) ? record.rate_per_unit_customer : rate_per_unit)).toFixed(0))}</span>
			),
			
		},
		{
			title: "Amount",
			className: "cursor-pointer",
			dataIndex: "price",
			key: "price",
			align: alignRight,
			width: 90,
//			onHeaderCell: () => onHeaderClick("price"),
			render: (value: number, record: any) => {
        console.log('val',record)
        value = (!customer_type || customer_type == 1 ? record.rate_per_unit_customer * record.size : record.rate_per_unit * record.size);
					return (
						<span className="whitespace-nowrap" title={value.toFixed(0)}>
							{"$"+value.toFixed(0)}
						</span>
					);
				}
			},
  ];

  return (
    <>
      <div className="rounded overflow-hidden shadow mb-6" style={{width:"103%",margin:"-20px",padding:"0px"}}>
				<style>
          {
            `
            th, td{
              font-size:12px !important;
            }
            `
          }
        </style>
        <Table
					//@ts-ignore
					columns={columns}
					emptyText={t("table:empty-table-data")}
					data={productlist}
					rowKey="id"
					scroll={{ x: 0 }}
					expandable={{
						expandedRowRender: (data:any) =>
            <div style={{width:"100%"}} className="col-span-full lg:col-span-5 xl:col-span-5 row-span-full lg:row-auto grid grid-cols-4 gap-2 md:gap-3.5 lg:gap-5 xl:gap-7">
              <div className="my-auto mx-auto col-span-1">
              <img src={data?.image_link || siteSettings?.product?.placeholderImage()}
              width={300}
              height={300}
              alt={data?.name}
          className={cn("bg-gray-300 object-cover ltr:rounded-l-md rtl:rounded-r-md ltr:rounded-l-md rtl:rounded-r-md transition duration-200 ease-linear transform group-hover:scale-105")}

></img>
              </div>
              <div className="my-auto mx-auto col-span-1">
              {
                data?.video_link?.toLowerCase().startsWith('https://www.youtube.com/embed/') ?
                <iframe width="420" height="345" src={data.video_link}>
                </iframe> :
                (
                  data?.video_link?.endsWith(".mp4") 
                  ?
              <video
              width={600}
              height={600}
          className={cn("bg-gray-300 object-cover ltr:rounded-l-md rtl:rounded-r-md ltr:rounded-l-md rtl:rounded-r-md transition duration-200 ease-linear transform group-hover:scale-105")}
          controls
              >
                <source src={data?.video_link} type="video/mp4"></source>
              </video>
              :
              (
                data?.video_link
                ?
                <a target="_blank" href={data?.video_link}>
                <button className="btn btn-primary">Click here to see video</button>
                </a>
                :
              <img src={siteSettings?.product?.placeholderImage()}
              width={300}
              height={300}
              alt={data?.name}
          className={cn("bg-gray-300 object-cover ltr:rounded-l-md rtl:rounded-r-md ltr:rounded-l-md rtl:rounded-r-md transition duration-200 ease-linear transform group-hover:scale-105")}

></img>))
          }
              </div>
			  <div className="my-auto mx-auto col-span-1">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'left', flexDirection: 'column' }}>
	  <Link
	href={data?.certificate_link}
	className="inline-block ltr:pr-1.5 rtl:pl-1.5 transition hover:underline hover:text-heading ltr:last:pr-0 rtl:last:pl-0"
  >
		{
			data?.grading == "IGI" ?
        <img
          src="../../assets/images/igi.jpg"
          alt="Certification Icon 2"
          style={{ maxWidth: '300px', margin: '10px' }}
        />
		: <span></span>
		}
		{
			data?.grading?.includes("GIA") ?
        <img
          src="../../assets/images/gia.jpg"
          alt="Certification Icon 3"
          style={{ maxWidth: '300px', margin: '10px' }}
        />
		: <span></span>
					}
        		{
			data?.grading == "HRD" ?
        <img
          src="../../assets/images/hrd.jpg"
          alt="Certification Icon 5"
          style={{ maxWidth: '300px', margin: '10px' , marginRight: '20px'}}
        />
		: <span></span>
}
{
	(data?.grading != "HRD" && !data?.grading?.includes("GIA") && data?.grading != "IGI")
	? 
	<h1>
	{data?.grading}
	</h1>
		: <span></span>
}
</Link>
<center><b>{data?.cert_no || ""}</b></center>
      </div>
	  
              </div>
			  <div className="mx-auto col-span-1">
			  <div className="py-6">
          <ul className="text-sm space-y-5 pb-1">
              { data?.sku && (
              <li>
                <span className="font-semibold text-heading inline-block ltr:pr-2 rtl:pl-2">
                  SKU:
                </span>
                {data?.sku}
              </li>
              )}
              <li>
                <span className="font-semibold text-heading inline-block ltr:pr-2 rtl:pl-2">
                  Style Code:
                </span>
                {data?.stylecode}
              </li>

            {data?.categories &&
              Array.isArray(data.categories) &&
              data.categories.length > 0 && (
                <li>
                  <span className="font-semibold text-heading inline-block ltr:pr-2 rtl:pl-2">
                    Category:
                  </span>
                  {data.categories.map((category: any, index: number) => (
                    <Link
                      key={index}
                      href={`${ROUTES.CATEGORY}/${category?.slug}`}
                      className="transition hover:underline hover:text-heading"
                    >
                      {data?.categories?.length === index + 1
                        ? category.name
                        : `${category.name}, `}
                    </Link>
                  ))}
                </li>
              )}

            {data?.tags &&
              Array.isArray(data.tags) &&
              data.tags.length > 0 && (
                <li className="productTags">
                  <span className="font-semibold text-heading inline-block ltr:pr-2 rtl:pl-2">
                    Tags:
                  </span>
                  {data.tags.map((tag: any) => (
                    <Link
                      key={tag.id}
                      href={`${ROUTES.COLLECTIONS}/${tag?.slug}`}
                      className="inline-block ltr:pr-1.5 rtl:pl-1.5 transition hover:underline hover:text-heading ltr:last:pr-0 rtl:last:pl-0"
                    >
                      {tag.name}
                      <span className="text-heading">,</span>
                    </Link>
                  ))}
                </li>
              )}

            <li>
              <span className="font-semibold text-heading inline-block ltr:pr-2 rtl:pl-2">
                {t("text-brand-colon")}
              </span>
              <Link
                href={`${ROUTES.BRAND}=${data?.type?.slug}`}
                className="inline-block ltr:pr-1.5 rtl:pl-1.5 transition hover:underline hover:text-heading ltr:last:pr-0 rtl:last:pl-0"
              >
                {data?.type?.name}
              </Link>
            </li>

            <li>
              <span className="font-semibold text-heading inline-block ltr:pr-2 rtl:pl-2">
                {t("text-shop-colon")}
              </span>
              <Link
                href={`${ROUTES.SHOPS}/${data?.shop?.slug || "zgpl"}`}
                className="inline-block ltr:pr-1.5 rtl:pl-1.5 transition hover:underline hover:text-heading ltr:last:pr-0 rtl:last:pl-0"
              >
                {data?.shop?.vendor_code || "ZGPL"}
              </Link>
            </li>
          </ul> 
        </div>
        <hr style={{border:"0.1px solid #2f3737" }}/><br />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: '12px' }}>
          <div style={{ marginRight: '10px' }}>
            {/* Icon 1 */}
            <img
              src="../../assets/images/lifetime.jpg"  // Replace with your actual icon image URL
              alt="Icon 1"
              style={{ width: '24px', height: '24px' }}
            />
          </div>
          Lifetime Exchange & Buy-Back
          <span style={{ margin: '0 10px' }}>|</span>
          <div style={{ marginRight: '10px' }}>
            {/* Icon 2 */}
            <img
              src="../../assets/images/certified.jpg"  // Replace with your actual icon image URL
              alt="Icon 2"
              style={{ width: '24px', height: '24px' }}
            />
          </div>
          Certified Jewellery
        </div><br />
			  {data?.buy_back_policy && data?.buy_back_policy?.buy_back_description && data?.buy_back_policy?.buy_back_value !== 0 && (
  <div className="" style={{ width: "100%", padding: "20px", borderRadius: "10px", boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)", display: "flex", alignItems: "center", flexDirection: "column" }}>
    {/* Container for Big Text and Circled Value */}
    <div style={{ display: "flex", alignItems: "center" }}>
      {/* Big Text */}
      <p style={{ fontSize: "16px", fontWeight: "bold", margin: "0 10px 0 0", textDecoration: "underline" }}>Buy Back Available</p>
      {/* Circled value */}
      <div style={{ backgroundColor: "#7b68ee", color: "white", width: "60px", height: "60px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "10px" }}>
        {data?.buy_back_policy?.buy_back_value}
      </div>
    </div>
    {/* Card description below */}
    <div className="flex">
      <div style={{ marginLeft: "10px", fontSize: "12px",  fontWeight: "normal" }}>
        <p className="">{data?.buy_back_policy?.buy_back_description}</p>
      </div>
    </div>
  </div>
)}
<br /><br />
			  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                  {/* Contact information */}
                  <div style={{ color: '#333', fontSize: '14px', marginBottom: '10px' }}>
                    Any Questions? Please feel free to reach us at: <span style={{ fontWeight: 'bold' }}>+91 9624077111</span>
                  </div>
                </div>
			  <Button
            id={`product-${data?.id}`}
            onClick={addToCart}
            variant="slim"
            className={`w-full md:w-6/12 xl:w-full `
          }
            loading={addToCartLoader}
            style={{ background: '#5d6b6b' }}
          >
            <span className="py-2 3xl:px-8">
              {data?.quantity ||
              (!isEmpty(selectedVariation) && selectedVariation?.quantity)
                ? t("text-add-to-cart")
                : 
                t("text-add-to-cart")
                }
            </span>
          </Button>
</div>
	        </div>,
						rowExpandable: (record: any) => record,
					}}
				/>
			</div>
      <div className="text-center pt-8 xl:pt-14">
        {hasNextPage && (
          <Button
            loading={loadingMore}
            disabled={loadingMore}
            onClick={() => fetchNextPage()}
            variant="slim"
          >
            {t("button-load-more")}
          </Button>
        )}
      </div>
    </>
  );
};

export default SolitaireProductInfiniteGrid;
