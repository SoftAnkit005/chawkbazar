import React, { useEffect } from "react"; 
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { QueryClient } from "react-query";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getLayout } from "@components/layout/layout";
import Container from "@components/ui/container";
import PageHeader from "@components/ui/page-header";
import { API_ENDPOINTS } from "@framework/utils/endpoints";
import { fetchSettings } from "@framework/settings/settings.query";

function makeTitleToDOMId(title: string) {
  return title.toLowerCase().split(" ").join("_");
}

export default function WhyzwelerPage() {
  const { t } = useTranslation("privacy");
  useEffect(() => {
    // Your JavaScript code here
    console.log('This is a script!');
    const card = document.querySelector('.card');
    const benefits = document.querySelector('.benefits');

    card?.addEventListener('click', () => {
        benefits?.classList.toggle('show-benefits');
    });

    function hideCard() {
      const cardContent = document.getElementById('reveal-card');
      cardContent?.classList.add('hidden');
  }
    
    
  }, []);

  return (
    <>
    <style>
    {`
    
    body {
      font-family: Arial, sans-serif;
      background-color: #f0f0f0;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
  }

  .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
  }

  .card {
      width: 50%;
      padding: 20px;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
      margin: 10px;
      transition: transform 0.3s ease;
  }
  @media (max-width: 768px) {
    /* Media query for screens with a maximum width of 768px (typical for mobile devices) */
    .card {
      width: 95%;
    }
  }

  .card:hover {
      transform: translateY(-5px);
  }

  .card-title {
      font-size: 24px;
      font-weight: bold;
  }
  .card-titlee {
    font-size: 14px;
    font-weight: normal;
    margin-bottom: 10px;
}

  .card-content {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    font-size: 18px;
    cursor: pointer;
    font-weight: bold;
}

.hidden {
    display: none;
}

  .benefits {
      display: none;
      max-width: 100%;
      text-align: left;
  }

  .show-benefits {
      display: block;
  }
  .benefits li {
    margin-bottom: 10px;
    position: relative;
    padding-left: 20px;
}

.benefits li::before {
    content: "\f058"; /* Font Awesome icon code for a checkmark */
    font-family: "Font Awesome 6 Free";
    position: absolute;
    left: 0;
    top: 0;
    font-size: 18px;
    color: #42e599; /* Color of the icon */
    animation: icon-bounce 1s ease infinite alternate; /* CSS animation */
}

@keyframes icon-bounce {
    0% {
        transform: translateY(0);
    }
    100% {
        transform: translateY(-3px);
    }
}

.gif-image {
  /* Adjust the width as needed */
  text-align: center;
  height: 100%; /* Maintain aspect ratio */
  margin-bottom: 10px; /* Space between image and heading on desktop */
}

.gif-imagee {
  /* Adjust the width as needed */
  text-align: center;
  height: 20px; /* Maintain aspect ratio */
  margin-left: 10px; /* Space between image and heading on desktop */
  margin-right: 10px;
}

.heading-container {
  font-family: 'Lato'; /* Replace 'Font Name' with the chosen font name */
  font-size: 1.5rem;
  text-align: center;
  margin-right: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height:200px;
}
     
        `}
    </style>
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.0/css/all.min.css"
      />
      <PageHeader pageHeader="text-page-privacy-policyyy" />

      
      <div className="container">
        <div className="card">
            <div className="card-title">ZWELER (INDIA’S FIRST INTEGRATED JEWELLERY PLATFORM)</div>
            <div className="card-titlee">- By Zweler Gems Pvt. Ltd.</div>
            
            <div className="card-content" id="reveal-card" onClick={hideCard}>
            <img src="../../assets/images/hil.gif" alt="Custom GIF" className="gif-imagee" />
            Know More - Why Us !!!
            <img src="../../assets/images/hil.gif" alt="Custom GIF" className="gif-imagee" />
            </div>
            <ul className="benefits">
        <li><i className="fas fa-users"></i> The largest platform connecting the manufacturers and retailers at one place.</li>
        <li><i className="fas fa-money-bill"></i> No Joining Fees for the Manufacturers or the Retailers.</li>
        <li><i className="fas fa-money-check"></i> Transparent Pricing as posted by the Manufacturers.</li>
        <li><i className="fas fa-chart-line"></i> Curtailed Pricing to help the retailers fetch more orders.</li>
        <li><i className="fas fa-cogs"></i> Multi-Level Customization Option</li>
        <li><i className="fas fa-truck"></i> End-to-End Fulfilment Solutions from Order to Finished Jewellery with required Certifications.</li>
        <li><i className="fas fa-gem"></i> Unlimited designs from the Finest Manufacturers across India.</li>
        <li><i className="fas fa-undo"></i> Buy Back & Replacement Warranty</li>
        <li><i className="fas fa-globe"></i> Global Reach</li>
        <li><i className="fas fa-shield-alt"></i> Insured Logistics across the globe.</li>
        <li><i className="fas fa-cubes"></i> Multiple Formats of Jewellery and Raw Material on one common platform.</li>
    </ul>
        </div>
    </div>
    <div className="heading-container">
      <img src="../../assets/images/ddd.gif" alt="Custom GIF" className="gif-image" />
      </div>

    </>
  );
}

function hideCard(event: React.MouseEvent<HTMLDivElement>) {
  const cardContent = document.getElementById('reveal-card');
  cardContent?.classList.add('hidden');
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

WhyzwelerPage.getLayout = getLayout;
