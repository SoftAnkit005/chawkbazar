import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { AnimatePresence } from "framer-motion";
import { ManagedUIContext } from "@contexts/ui.context";
import ManagedModal from "@components/common/modal/managed-modal";
import ManagedDrawer from "@components/common/drawer/managed-drawer";
import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Hydrate } from "react-query/hydration";
import { ToastContainer } from "react-toastify";
// import { ReactQueryDevtools } from "react-query/devtools";
import { appWithTranslation } from "next-i18next";
import DefaultSeo from "@components/common/default-seo";

// Load Open Sans and satisfy typeface font
import "@fontsource/open-sans";
import "@fontsource/open-sans/600.css";
import "@fontsource/open-sans/700.css";
import "@fontsource/satisfy";
// external
import "react-toastify/dist/ReactToastify.css";
// base css file
import "@styles/scrollbar.css";
import "@styles/swiper-carousel.css";
import "@styles/custom-plugins.css";
import "@styles/tailwind.css";
import { getDirection } from "@utils/get-direction";
import PageLoader from "@components/ui/page-loader/page-loader";
import ErrorMessage from "@components/ui/error-message";
import { SettingsProvider } from "@contexts/settings.context";
import { useSettingsQuery } from "@framework/settings/settings.query";
import type { NextPage } from "next";
import PrivateRoute from "@lib/private-route";
import SocialLoginProvider from "../providers/social-login-provider";
import axios from "axios";

function handleExitComplete() {
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0 });
  }
}

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
  authenticate?: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export const AppSettings: React.FC = (props) => {
  const { data, isLoading: loading, error } = useSettingsQuery();
  if (loading) return <PageLoader />;
  if (error) return <ErrorMessage message={error.message} />;
  return <SettingsProvider initialValue={data?.settings?.options} {...props} />;
};

const CustomApp: any = ({ Component, pageProps }: AppPropsWithLayout) => {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);
  const authProps = Component.authenticate;

  const [queryClient] = useState(() => new QueryClient());

  const router = useRouter();
  const dir = getDirection(router.locale);

  useEffect(() => {
    document.documentElement.dir = dir;
  }, [dir]);

  const [maintainanceData, setMaintainanceData] =  useState<any>([]);

  useEffect(() => {
    const fetchMaintenance = async() => {
       await axios.get(`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/shop-under-maintainance/1`).then((item) => {
        setMaintainanceData(item?.data)
        return item;
      });
    }
    fetchMaintenance();
  }, []);

  // Render the maintenance page if the flag is set to true
  if (maintainanceData?.value === 1) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <img
          src="\assets\images\gear-loader.gif"
          alt="Maintenance"
          className=" w-[300px] h-[300px]"
        />
        <h1 className="mb-4 text-4xl font-bold text-orange-700 text-[40px]">
          Website Under Maintenance
        </h1>
        <p className="text-lg text-black-500 text-[20px]">
          We apologize for the inconvenience. Our website is currently
          undergoing maintenance. Please check back later.
        </p>
      </div>
    );
  }


  return (
    <AnimatePresence exitBeforeEnter onExitComplete={handleExitComplete}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <AppSettings>
            <ManagedUIContext>
              <DefaultSeo />
              {Boolean(authProps) ? (
                <PrivateRoute>
                  {getLayout(<Component {...pageProps} />)}
                </PrivateRoute>
              ) : (
                getLayout(<Component {...pageProps} />)
              )}
              <ToastContainer autoClose={2000} />
              <SocialLoginProvider />
              <ManagedModal />
              <ManagedDrawer />
            </ManagedUIContext>
          </AppSettings>
        </Hydrate>
        {/* <ReactQueryDevtools /> */}
      </QueryClientProvider>
    </AnimatePresence>
  );
};

export default appWithTranslation(CustomApp);
