import { getLayout } from "@components/layout/layout";
import Container from "@components/ui/container";
import PageHeader from "@components/ui/page-header";
import { Link, Element } from "react-scroll";
import { useTranslation } from "next-i18next";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { QueryClient } from "react-query";
import { API_ENDPOINTS } from "@framework/utils/endpoints";
import { fetchSettings } from "@framework/settings/settings.query";

const benefitItems = [
  {
    title: "NO JOINING FEES",
    description:
      "The retailers can join the Zweler platform as buyers for free. There is absolutely no joining fees for joining the platform as a buyer, provided they have a valid GST.",
    icon: "fas fa-hand-holding-usd", // Dollar sign icon for "NO JOINING FEES"
  },
  {
    title: "SIMPLE JOINING PROCESS",
    description:
      "The retailers can register through the website or alternatively download the mobile applications available on both, Android and IOS and register through the app.",
    icon: "fas fa-mobile-alt", // Mobile phone icon for "SIMPLE JOINING PROCESS"
  },
  {
    title: "EXTENSIVE REACH TO ALL FINEST MANUFACTURERS",
    description:
      "Post registration, the retailers can access the designs of all the finest manufacturer onboard the Zweler platform and unlock the wholesale prices.",
    icon: "fas fa-globe", // Globe icon for "EXTENSIVE REACH TO ALL FINEST MANUFACTURERS"
  },
  {
    title: "NO MINIMUM ORDER QUANTITY",
    description:
      "We understand that every manufacturer has a minimum order quantity to process which makes it difficult for the retailers to work with multiple manufacturers. However, we at Zweler, try to provide the retailers an order placement process without any hassle of Minimum Order Quantity. The retailers, can now select the designs from multiple manufacturers from the platform and place the order of multiple products from multiple manufacturers from the same cart.",
    icon: "fas fa-shopping-cart", // Shopping cart icon for "NO MINIMUM ORDER QUANTITY"
  },
  {
    title: "CUSTOMISATION OPTIONS",
    description:
      "The retailers can not only see the products of multiple manufacturers, but can also customize the product on the dedicated page according to the taste and preferences of their clients. Also, while customizing they shall be able to check the changes in prices as the changes are being made.",
    icon: "fas fa-paint-brush", // Paintbrush icon for "CUSTOMISATION OPTIONS"
  },
  {
    title: "TRANSPARENT PRICING",
    description:
      "The retailers shall be able to check the different pricing being offered by different manufacturers. They will be able to check the purity, wastage as being offered by the manufactures, diamond prices being offered on various qualities, making charges and other details as required in different products. They will also be able to compare the prices of similar products being offered by different manufacturers.",
    icon: "fas fa-money-bill-wave", // Money bill icon for "TRANSPARENT PRICING"
  },
  {
    title: "DUAL LAYER PROTECTION",
    description:
      "The platform has dual layer protection that helps the retailers to keep the secret of their wholesale prices concealed from their end consumers.",
    icon: "fas fa-shield-alt", // Shield icon for "DUAL LAYER PROTECTION"
  },
  {
    title: "END TO END FULFILLMENT",
    description:
      "Once the retailers has placed the order, unlike old method, they don’t need to provide any raw material, like gold or diamond to the manufacturers. Once ordered, they will receive the finished products right at their doorstep with the required certifications.",
    icon: "fas fa-truck", // Truck icon for "END TO END FULFILLMENT"
  },
  {
    title: "INSURED LOGISTICS",
    description:
      "Zweler has partnership with the most reliable logistics partners in jewellery industry. Once the products are made, Zweler will insure the movement of products with insurance through these partners. The insurance cost of the logistics is completely borne by Zweler. Also, at Zweler, the logistics cost is much less than that charged by local logistics partners largely prevalent in the industry. It also helps the retailers to save a lot of money being spent in expensive Angadia services for the movement of the products.",
    icon: "fas fa-shipping-fast", // Fast shipping icon for "INSURED LOGISTICS"
  },
  {
    title: "CERTIFIED & HALLMARKED JEWELLERY",
    description:
      "All products being bought from the platform of Zweler are 100% Certified and Hallmarked from authorized agencies.",
    icon: "fas fa-gem", // Gem icon for "CERTIFIED & HALLMARKED JEWELLERY"
  },
  {
    title: "BUY BACK & REPLACEMENT WARRANTY",
    description:
      "All products purchased from the platform of Zweler come with Buy Back and Replacement warranty irrespective of the manufacturer from whom the product has been purchased.",
    icon: "fas fa-redo-alt", // Repeating arrow icon for "BUY BACK & REPLACEMENT WARRANTY"
  },
  {
    title: "ZWELER AS CATALOGUE",
    description:
      "The retailers can also use the entire Zweler catalogue as their own design catalogue and take orders from their clients from any corner of the globe. They can simply share the link of the website or the mobile app with their clients and can ask them to make the selection from the style code.",
    icon: "fas fa-book", // Book icon for "ZWELER AS CATALOGUE"
  },
];

export default function RetailerIntroPage() {
  const { t } = useTranslation("privacy");
  return (
    <>
    <PageHeader pageHeader="text-page-privacy-policyyyy" />

<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.0/css/all.min.css"
/>
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css?family=Lato&display=swap"
/>

<div className="containerStyle">
  <Element name="benefits"  className="benefitsStyle">
    {benefitItems.map((item, index) => (
      <div key={index} className="benefitCardStyle">
        <div>
          <i className={`fas ${item.icon} iconStyle`}></i>
          <h2 className="h2Style">{item.title}</h2>
          <p>{item.description}</p>
        </div>
      </div>
    ))}
  </Element>
</div>
<div className="contact-info-containerr">
<div className="contact-infor">
<p>For more details, feel free to connect with us:</p>
<p>Email: info@zweler.com</p>
<p>Ph: +91-9624177111</p>
</div>
</div>
<style>
{`
.containerStyle {
font-family: "Lato, sans-serif";
margin: 0;
padding: 0;
background-color: #f4f4f4;
}

.benefitsStyle {
background-color: #fff;
padding: 20px;
border-radius: 5px;
box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
display: grid;
grid-template-columns: repeat(auto-fill, minmax(calc(30% - 20px), 1fr));
gap: 20px;
}

/* Media query for mobile */
@media (max-width: 768px) {
.benefitsStyle {
  grid-template-columns: 1fr; /* Change to a single column layout */
}
}

.benefitCardStyle {
margin-bottom: 20px;
padding: 40px;
position: relative;
line-height: 1.6;
box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.2);
}

.iconStyle {
position: absolute;
left: 40px;
top: 10px;
font-size: 24px;
color: #007bff;
animation: spin 2s linear infinite;
}

.h2Style {
font-size: 18px;
margin: 10px 0;
font-weight: bold;
text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.contact-info-containerr {
text-align: center;
margin-top: 20px; /* Add spacing from the benefits section */
padding: 20px;
background-color: #f8f8f8; /* Add a light background color */
border-radius: 8px;
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.contact-infor p {
font-size: 16px;
font-weight:bold;
margin: 8px 0;
}
`}
</style>

    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(API_ENDPOINTS.SETTINGS, fetchSettings);

  return {
    props: {
      ...(await serverSideTranslations(locale!, [
        "common",
        "menu",
        "forms",
        "footer",
        "privacy",
      ])),
    },
  };
};

RetailerIntroPage.getLayout = getLayout;
