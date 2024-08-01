import Link from "@components/ui/link";
import { getIcon } from "@utils/get-icon";
import * as sidebarIcons from "@components/icons/sidebar";
import { useUI } from "@contexts/ui.context";
import { useMeQuery } from "@data/user/use-me.query";
import { useShopsQuery } from "@data/shop/use-shops.query";
import { useProductsQuery } from "@data/product/products.query";

const SidebarItem = ({ href, icon, label, meData }: any) => {
  const {
    data:shopData,
  } = useShopsQuery({
    limit: 999,
  });
  const {
    data:productData,
  } = useProductsQuery({
    limit: 999,
  });
  const { closeSidebar } = useUI();
  let isShowApprove = true;
  return (
    <Link
      href={href}
      className="flex w-full items-center text-base text-body-dark text-start focus:text-accent"
    >
      {getIcon({
        iconList: sidebarIcons,
        iconName: icon,
        className: "w-5 h-5 me-4",
      })}
      <span onClick={() => closeSidebar()}>{label}</span>
      {
        isShowApprove && label=="Shops" && (shopData?.shops?.data?.filter((x:any)=>!x.is_active)?.length || 0) > 0
        && meData?.email == "zweler.web@gmail.com"
        ? 
        <button style={{background:"red", marginLeft:"20px", padding:"0 10px", fontSize:"xx-small", color:"white", borderRadius:"50px"}}>approve</button>
        : 
        ""
      }
      {
        isShowApprove && label=="Products" && (productData?.products?.data?.filter((x:any)=>x.status == "draft")?.length || 0) > 0
        && meData?.email == "zweler.web@gmail.com"
        ? 
        <button style={{background:"red", marginLeft:"20px", padding:"0 10px", fontSize:"xx-small", color:"white", borderRadius:"50px"}}>approve</button>
        : 
        ""
      }
    </Link>
  );
};

export default SidebarItem;
