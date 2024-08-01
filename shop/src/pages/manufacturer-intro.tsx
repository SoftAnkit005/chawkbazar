import { getLayout } from "@components/layout/layout";
import PageHeader from "@components/ui/page-header";
import { useTranslation } from "next-i18next";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {QueryClient} from "react-query";
import {API_ENDPOINTS} from "@framework/utils/endpoints";
import {fetchSettings} from "@framework/settings/settings.query";

const benefits = [
  {
    title: 'HUGE SAVINGS ON MARKETING COST',
    description:
      'We at Zweler understand the huge cost of traveling with the sample line and finished products to the retailers for orders, which is not only risky but also adds to the cost of the products. We at Zweler would help the manufacturers to completely eliminate the risk and expense of traveling and reach out to millions of retailers across India and beyond borders.',
    icon: 'fas fa-plane', // Replace with a relevant icon
  },
  {
    title: 'NO JOINING FEES',
    description:
      'The manufacturers can join the Zweler platform as vendors for free. There are absolutely no joining fees for joining the platform as a registered vendor, provided you should be a manufacturer with a valid GST.',
    icon: 'fas fa-handshake', // Replace with a relevant icon
  },
  {
    title: 'SIMPLE JOINING PROCESS',
    description:
      'The vendors can register through the website or alternatively download the mobile applications available on both Android and IOS and register through the app. They can create their shop and post unlimited designs along with their prices.',
    icon: 'fas fa-mobile-alt', // Replace with a relevant icon
  },
  {
    title: 'UNLIMITED CLOUD SPACE',
    description:
      'Zweler provides unlimited space to all its vendors, the vendors are therefore, free to post any number of products online.',
    icon: 'fas fa-cloud', // Replace with a relevant icon
  },
  {
    title: 'MULTIPLE JEWELLERY FORMATS',
    description:
      'The vendors can create multiple shops or post multiple variety of products from a single. They can post all formats of jewellery, whether Gold Jewellery, Diamond Jewellery, Silver Jewellery, Gemstones, Solitaires, Loose Diamonds, or anything that could be a part of jewellery family.',
    icon: 'fas fa-gem', // Replace with a relevant icon
  },
  {
    title: 'NO SELLING CHARGES',
    description:
      'Zweler does not charge any commission from the vendors for posting their products online and selling through the platform.',
    icon: 'fas fa-money-check-alt', // Replace with a relevant icon
  },
  {
    title: 'TRANSPARENT BILLING PROCESS',
    description:
      'The vendors can also see the final prices at which their products are visible to the retailers for buying. Zweler charges a small fee ranging from 0.50% from the retailers and the same shall be visible to all the vendors and the retailers.',
    icon: 'fas fa-file-invoice-dollar', // Replace with a relevant icon
  },
  {
    title: 'FEATURED PRODUCTS SECTION',
    description:
      'Creative manufacturers now get a special section dedicated to Featured Section where if they have something unique in the jewellery segment or anything which is very different from the market offering can be posted. The Featured Product Section is always a highlight area where the buyers are looking for some different products and promote in a more passionate way to their customers.',
    icon: 'fas fa-star', // Replace with a relevant icon
  },
  {
    title: 'FLASH SALE ZONE',
    description:
      'For the first time ever, Zweler is introducing the Flash Sale Zone, where if the vendor has any dead or unmoving stock, he can simply put the products at a discounted prices and the retailers might be interested in buying the whole lot at the discounted price. This will save the manufacturers/vendors from the loss of melting the products and simultaneously, help the retailer get some products at a discounted prices.',
    icon: 'fas fa-bolt', // Replace with a relevant icon
  },
  {
    title: 'COMPETITIVE ANALYSIS',
    description:
      'The vendors can always see the final price at which their products are visible to the retailers across the globe. Simultaneously, they will also be able to check the competitive pricing posted by other vendors of similar products and may form the strategy accordingly.',
    icon: 'fas fa-chart-line', // Replace with a relevant icon
  },
  {
    title: 'ASSURED PAYMENTS',
    description:
      'Selling might be easy, but the problem of delayed payment is rampant across every industry, especially the jewellery industry where the amount moves pretty faster with every dispatch. Zweler provides every manufacturer 100% assured payments and that too before dispatch of the products. The manufacturers can now simply focus on producing good quality products with competitive prices.',
    icon: 'fas fa-money-check', // Replace with a relevant icon
  },
  {
    title: 'FREE LOGISTICS & INSURED DELIVERIES',
    description:
      'Once the products are ready for dispatch with the manufacturer, he can simply contact the dispatch team and Zweler shall take care of the logistics with insurance. All logistics and insurance charges are borne by Zweler.',
    icon: 'fas fa-truck', // Replace with a relevant icon
  },
  {
    title: 'DEDICATED RM FACILITIES',
    description:
      'Zweler provides every manufacturer with a dedicated Relationship Manager, who shall be available at all times to help the manufacturers/vendors with complete hand-holding and with support at all levels.',
    icon: 'fas fa-user-tie', // Replace with a relevant icon
  },
  {
    title: 'PROMOTIONAL CAMPAIGNS AS PER DESIRED MARKET',
    description:
      'We at Zweler understand that jewellery is more of a passion in India than a fashion statement. Every region in India is a different form a market and the manufacturers have specialization in catering to different market segments and regions. We discuss the most desired market areas with every manufacturers and promote their products more vividly in the required regions. This eventually helps the manufacturers to capture a wider market in specified category.',
    icon: 'fas fa-bullhorn', // Replace with a relevant icon
  },
];


export default function ManuFacturerIntroPage() {
  const { t } = useTranslation("privacy");
  return (
    <>
      <PageHeader pageHeader="text-page-privacy-policyy" />
      
      
       <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.0/css/all.min.css"
      />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato&display=swap" />

     <div className="zweler-benefits-page">
    
     <div className="heading-container">
  <img src="../../assets/images/manu.gif" alt="Custom GIF" className="gif-image" />
  <h1 className="heading">Benefits to the MANUFACTURERS</h1>
</div>



      <div className="benefits-list">
        {benefits.map((benefit, index) => (
          <div className="benefit-card" key={index}>
            <i className={`animated-icon ${benefit.icon}`}></i>
            <h2>{benefit.title}</h2>
            <p>{benefit.description}</p>
          </div>
        ))}
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

          .heading-container {
            font-family: 'Lato'; /* Replace 'Font Name' with the chosen font name */
            font-size: 1.5rem;
            text-align: center;
            margin-bottom: 30px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .gif-image {
            /* Adjust the width as needed */
            height: 100%; /* Maintain aspect ratio */
            margin-bottom: 10px; /* Space between image and heading on desktop */
          }

          .heading {
            font-size: 1.5rem; /* Adjust font size as needed */
            color: black; /* Heading color */
          }

          .to-manufacturers {
            color: white; /* Color for "to the Manufacturers" */
          }

          /* Media query for mobile view */
          @media (max-width: 768px) {
            .gif-image {
              margin-bottom: 0; /* Remove space between image and heading on mobile */
            }
          }




            @media (max-width: 768px) {
              /* Media query for screens with a maximum width of 768px (typical for mobile devices) */
              .benefits-heading {
                font-size: 24px; /* Mobile font size */
                margin-bottom: 20px;
              }
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
          .zweler-benefits-page {
            font-family: Arial, sans-serif;
            text-align: justify;
            padding: 20px;
          }

          h1 {
            font-size: 24px;
            margin-bottom: 20px;
          }
          
          .benefits-list {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between; 
          }
          
          .benefit-card {
            flex-grow: 1; 
            width: calc(33.33% - 20px); 
            margin-bottom: 20px;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            background-color: #fff;
            text-align: left;
            transition: transform 0.2s ease-in-out; 
          }

          .benefit-card:hover {
            transform: scale(1.05);
          }
          
          .animated-icon {
            font-size: 40px;
            margin-right: 10px;
            vertical-align: middle;
          }
          
          h2 {
            font-size: 20px;
            margin-top: 10px;
          }
          
          p {
            font-size: 16px;
          }
          
          .contact-info {
            margin-top: 40px;
          }

          /* Colored and animated icons */
          .animated-icon.fas.fa-plane {
            color: #007BFF; /* Blue color */
            animation: planeAnimation 1s linear infinite; /* Replace with your desired animation */
          }
          
          .animated-icon.fas.fa-handshake {
            color: #28A745; /* Green color */
            animation: handshakeAnimation 1s linear infinite; /* Replace with your desired animation */
          }

          .animated-icon.fas.fa-mobile-alt {
            color: red; /* Green color */
            animation: handshakeAnimation 1s linear infinite; /* Replace with your desired animation */
          }
          
          .animated-icon.fas.fa-cloud {
            color: #3498db; /* Blue color */
            animation: cloudAnimation 1s linear infinite; /* Replace with your desired animation */
          }
          
          .animated-icon.fas.fa-gem {
            color: #e74c3c; /* Red color */
            animation: gemAnimation 1s linear infinite; /* Replace with your desired animation */
          }
          
          .animated-icon.fas.fa-money-check-alt {
            color: #f1c40f; /* Yellow color */
            animation: moneyAnimation 1s linear infinite; /* Replace with your desired animation */
          }
          
          .animated-icon.fas.fa-star {
            color: #f39c12; /* Orange color */
            animation: starAnimation 1s linear infinite; /* Replace with your desired animation */
          }
          
          .animated-icon.fas.fa-bolt {
            color: #d35400; /* Dark Orange color */
            animation: boltAnimation 1s linear infinite; /* Replace with your desired animation */
          }
          
          .animated-icon.fas.fa-chart-line {
            color: #9b59b6; /* Purple color */
            animation: chartAnimation 1s linear infinite; /* Replace with your desired animation */
          }
          
          .animated-icon.fas.fa-money-check {
            color: #2c3e50; /* Dark Blue color */
            animation: checkAnimation 1s linear infinite; /* Replace with your desired animation */
          }
          
          .animated-icon.fas.fa-truck {
            color: #27ae60; /* Green color */
            animation: truckAnimation 1s linear infinite; /* Replace with your desired animation */
          }
          
          .animated-icon.fas.fa-user-tie {
            color: #8e44ad; /* Violet color */
            animation: userAnimation 1s linear infinite; /* Replace with your desired animation */
          }
          
          .animated-icon.fas.fa-bullhorn {
            color: #e67e22; /* Pumpkin color */
            animation: bullhornAnimation 1s linear infinite; /* Replace with your desired animation */
          }

          .animated-icon.fas.fa-mobile {
            color: #28A745; /* Green color */
            animation: handshakeAnimation 1s linear infinite; /* Replace with your desired animation */
          }

          /* Add more icon styles and animations as needed */

          @keyframes planeAnimation {
            0% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
            100% { transform: translateY(0); }
          }

          @keyframes handshakeAnimation {
            0% { transform: scaleX(1); }
            50% { transform: scaleX(1.1); }
            100% { transform: scaleX(1); }
          }

          /* Add these keyframes for the remaining 12 icons with alternating transforms */

/* Cloud Animation */
@keyframes cloudAnimation {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
  100% {
    transform: translateY(0);
  }
}

/* Gem Animation */
@keyframes gemAnimation {
  0% {
    transform: scaleX(1);
  }
  50% {
    transform: scaleX(1.1);
  }
  100% {
    transform: scaleX(1);
  }
}

/* Money Animation */
@keyframes moneyAnimation {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
  100% {
    transform: translateY(0);
  }
}

/* Star Animation */
@keyframes starAnimation {
  0% {
    transform: scaleX(1);
  }
  50% {
    transform: scaleX(1.1);
  }
  100% {
    transform: scaleX(1);
  }
}

/* Bolt Animation */
@keyframes boltAnimation {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
  100% {
    transform: translateY(0);
  }
}

/* Chart Animation */
@keyframes chartAnimation {
  0% {
    transform: scaleX(1);
  }
  50% {
    transform: scaleX(1.1);
  }
  100% {
    transform: scaleX(1);
  }
}

/* Check Animation */
@keyframes checkAnimation {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
  100% {
    transform: translateY(0);
  }
}

/* Truck Animation */
@keyframes truckAnimation {
  0% {
    transform: scaleX(1);
  }
  50% {
    transform: scaleX(1.1);
  }
  100% {
    transform: scaleX(1);
  }
}

/* User Animation */
@keyframes userAnimation {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
  100% {
    transform: translateY(0);
  }
}

/* Bullhorn Animation */
@keyframes bullhornAnimation {
  0% {
    transform: scaleX(1);
  }
  50% {
    transform: scaleX(1.1);
  }
  100% {
    transform: scaleX(1);
  }
}


          /* Media query for mobile view */
          @media (max-width: 768px) {
            .benefits-list {
              flex-direction: column;
              align-items: center;
            }

            .benefit-card {
              width: 100%; /* Full width for mobile */
            }
          }
        `}
      </style>
    </div>

      
    </>
  );
}

ManuFacturerIntroPage.getLayout = getLayout;

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

