import { MapPin } from "@components/icons/map-pin";
import { PhoneIcon } from "@components/icons/phone";
import { useOrdersQuery } from "@data/order/use-orders.query";
import { useUserQuery } from "@data/user/user.query";
import { useRouter } from "next/router";
import Layout from "@components/layouts/admin";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticPathsContext } from "next";
import RecentOrders from "@components/order/recent-orders";

export default function UserDetailPage() {
  const { t } = useTranslation();
  const { query } = useRouter();
  const {
    data
  } = useUserQuery(query?.userId as string);
  const {
    data: ordersData,
  } = useOrdersQuery({
    limit: 99,
    page: 1,
    customer_id:Number(query?.userId)
  });
  const business_profile = data?.business_profile[Object.keys(data?.business_profile)[0]];
    return (

<div style={{margin:"50px"}}>
<table cellPadding={20}>
  <tr>
    <td>
            <h1 style={{fontWeight:"bold"}}>{data?.name}</h1>
            {data?.email ?
            <div>
                      <br/>
                      <b>Email</b>            
            <div>
            <a href={`mailto:${data?.email}`} className="text-body text-sm">
              {data?.email}
            </a>  
              </div>
              </div>
            :<div></div>
}  
          {data?.mobile || data?.profile?.contact || business_profile?.mobile ?
          <div>
          <br/>
          <b>Contact</b>
          <div className="flex w-full justify-start mt-3">
            <span className="text-muted-light mt-0.5 me-2">
              <PhoneIcon width={16} />
            </span>
            <a href={`tel:${data?.mobile || data?.profile?.contact || business_profile?.mobile}`} className="text-body text-sm">
              {data?.mobile || data?.profile?.contact || business_profile?.mobile}
            </a>
          </div>
          </div>
          : <div></div>}
          </td>
          <td>
            {data?.address?.map((x)=>(
              <div>
                <br/>
              <b>{x.type?.toUpperCase()} ADDRESS</b>
              <div className="flex w-full justify-start mt-5">
              <span className="text-muted-light mt-0.5 me-2">
                <MapPin width={16} />
              </span>
              <address className="text-body text-sm not-italic">
                {x?.address?.street_address},
                <br/>
                {x?.address?.city}, {x?.address?.state}, {x?.address?.country} - {x?.address?.zip}
              </address>
            </div>
            </div>
            )
            )}
            </td>
            </tr>
</table>

            {
                  <div className="w-full flex flex-col">
                    <RecentOrders
            orders={ordersData?.orders?.data}
            title={t("table:recent-order-table-title")}
          />
                      {/* <table>
                        <thead className="text-sm lg:text-base">
                          <tr>
                            <th className="p-4 text-heading font-semibold ltr:text-left rtl:text-right ltr:first:rounded-tl-md rtl:first:rounded-tr-md w-24"
                            style={{background:"white", width:"100px"}}
                            >
                            Order
                            </th>
                            <th className="p-4 text-heading font-semibold ltr:text-left rtl:text-right lg:text-center w-40 xl:w-56"
                            style={{background:"white", width:"300px"}}
                            
                            >
                            Date
                            </th>
                            <th className="p-4 text-heading font-semibold ltr:text-left rtl:text-right lg:text-center w-36 xl:w-44"
                            style={{background:"white", width:"300px"}}
                            
                            >
                            Status
                            </th>
                            <th className="p-4 text-heading font-semibold ltr:text-left rtl:text-right lg:text-center"
                            style={{background:"white"}}
                            
                            >
                            Total
                            </th>
                            <th className="p-4 text-heading font-semibold ltr:text-left rtl:text-right ltr:lg:text-right rtl:lg:text-left ltr:last:rounded-tr-md rtl:last:rounded-tl-md w-24"
                            style={{background:"white"}}
                            
                            >
                            Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-sm lg:text-base">
                        {
                          ordersData?.orders?.data?.map((x:any)=>(
                            <tr className="text-left" style={{borderBottom:"1px solid grey", lineHeight:"80px"}}>
                              <td className="text-center">
                                <a href={x.tracking_number}
            className="underline hover:no-underline text-body"
                                >
                                #{x.id}
                                </a>
                              </td>
                              <td>
          {dayjs(x.created_at).format("MMMM D, YYYY")}
                              </td>
                              <td>
                                {x.status.name}
                              </td>
                              <td>
                              ₹{x.total.toFixed(0)} for {x.products.length} items
                              </td>
                              <td>
                                <a href={x.tracking_number}>
                              <Button
            className="text-sm leading-4 bg-heading text-white px-4 py-2.5 inline-block rounded-md hover:text-white hover:bg-gray-600"
          >
            View
            </Button>
            </a>
                              </td>
                            </tr>
                          )
                          )
                        }
                        </tbody>
                      </table> */}
                  </div>                  
            }
            <br/>
        </div>
    )
}

UserDetailPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["table", "form", "common"])),
  },
});

export async function getStaticPaths({ locales }: GetStaticPathsContext) {
return { paths:[],fallback: "blocking" };
};

