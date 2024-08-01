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
import { aboutus } from "@settings/aboutus-settings";
import React, { useState } from 'react';

function makeTitleToDOMId(title: string) {
  return title.toLowerCase().split(" ").join("_");
}

export default function AboutusPage() {
  const { t } = useTranslation("aboutus");



  return (
    <>
      <PageHeader pageHeader="text-page-about-us" />
      <div className="mt-12 lg:mt-14 xl:mt-16 lg:py-1 xl:py-0 border-b border-gray-300 px-4 md:px-10 lg:px-7 xl:px-16 2xl:px-24 3xl:px-32 pb-9 md:pb-14 lg:pb-16 2xl:pb-20 3xl:pb-24">
        
       

        <Container>

        <div className="ripple-container">

          <div className="flex flex-col md:flex-row">  
             
            <nav className="md:w-72 xl:w-3/12 mb-8 md:mb-0">
            <img src="./assets/images/abtimg.jpg" alt="About Us" className="w-full h-auto" />
              <ol className="sticky md:top-16 lg:top-28 z-10">
                {/* Navigation links */}
              </ol>
            </nav>
            <div className="md:w-9/12 ltr:md:pl-8 rtl:md:pr-8 pt-0 lg:pt-2">
              {/* Updated About Us content */}
              <Element id="about_us" className="mb-10">
                <h2 className="text-lg md:text-xl lg:text-2xl text-heading font-bold mb-4">
                  About Zweler Gems Pvt Ltd
                </h2>
                <div className="text-heading text-sm leading-7 lg:text-base lg:leading-loose">
                  <p>
                    With a legacy of over 80 years, Zweler is now a GOI certified
                    Start Up branded as the 'World's First Platform connecting
                    the Manufacturers & Retailers with 100% Customised solutions.'
                    The platform is perhaps a revolution by itself and shall define
                    the future of Diamond Jewellery industry across the globe.
                    Showcasing the finest designs from the best manufacturers,
                    Zweler promises to bring forth a scintillating collection with
                    an unparalleled jewellery buying experience at your fingertips!
                  </p>
                  <p>
                    Zweler, today, is one of the best sourcing partner for all the
                    retailers providing an exquisite collection with convenience.
                    Our success stories can be pronounced best with none other
                    than the numerous retailers who have benefitted from our platform.
                    Soon a majority of the retailers across India shall be a part
                    of the Zweler family.
                  </p>
                  <p>
                    The phenomenal penetration of internet has covered almost all
                    profiles of products and services being sold online except
                    Jewellery which still is largely disorganized and fragmented.
                    Zweler is the most promising platform to bridge the gap and
                    shall bring a whole new experience to all who love the brilliance
                    of diamonds. With thousands of designs from the latest and
                    the finest in the industry, Zweler provides the consumers
                    with the best and transparent pricing ever in the Diamond industry.
                  </p>
                  <p>
                    With consumer-friendly policies like Easy Returns, Buy Back Policy
                    & Life Time Exchange, Zweler promises to deliver 100% Certified
                    and BIS Hallmarked jewellery.
                  </p>
                  <p>
                    Since we are always on innovation and fashionizing, we would love
                    to hear more from you. To share your thoughts and queries,
                    please feel to get in touch with us on Find us on Facebook,
                    Instagram and Twitter. We would love to connect with you. To
                    share your thoughts or get your queries answered, please feel
                    free to reach us on our toll-free number 9624077111 or send us
                    an email at info@zweler.com.
                  </p>
                </div>
              </Element>
              {/* ... (continue with other sections) */}
            </div>
            {/* End of content */}
          </div>

          </div>
        </Container>
      </div>
    </>
  );
}

AboutusPage.getLayout = getLayout;

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
        "aboutus",
      ])),
    },
  };
};
