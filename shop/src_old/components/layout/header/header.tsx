import SearchIcon from "@components/icons/search-icon";
import HeaderMenu from "@components/layout/header/header-menu";
import Logo from "@components/ui/logo";
import { useUI } from "@contexts/ui.context";
import { menu } from "@data/static/menus";
import useUser from "@framework/auth/use-user";
import { useMenuBuildersQuery } from "@framework/menu-builder/menu-builder.query";
import { ROUTES } from "@lib/routes";
import { authorizationAtom } from "@store/authorization-atom";
import { addActiveScroll } from "@utils/add-active-scroll";
import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useWindowSize } from "react-use";

declare global {
  interface Window {
    localStorage: Storage;
  }
}

const AuthMenu = dynamic(() => import("./auth-menu"), { ssr: false });
const CartButton = dynamic(() => import("@components/cart/cart-button"), {
  ssr: false,
});

interface Props {
  variant?: "default" | "modern";
}

type DivElementRef = React.MutableRefObject<HTMLDivElement>;
const Header: React.FC<Props> = ({
  variant = "default"
}) => {
  const { width:deviceWidth } = useWindowSize();
  const [scrollY, setScrollY] = useState(0);
  const { me } = useUser();
  const { data: menuBuilders }: any = useMenuBuildersQuery();
  let dynamicMenuItems = menuBuilders?.filter((x:any)=>x.parent == 0);
  dynamicMenuItems = dynamicMenuItems?.map((x:any)=>{
    x.columns = [
        {
          columnItems: menuBuilders?.filter((y:any)=>y.parent == x.id) || []
        }
      ];
    return x;
  });
  
  let setMenu = dynamicMenuItems ? [...dynamicMenuItems,...menu] : menu;
  const {
    openSearch,
    openModal,
    setModalView,
  } = useUI();
  const [ isAuthorize ] = useAtom(authorizationAtom);
  const { t } = useTranslation("common");
  const siteHeaderRef = useRef() as DivElementRef;
  addActiveScroll(siteHeaderRef);

  function handleLogin() {
    setModalView("LOGIN_VIEW");
    return openModal();
  }
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      id="siteHeader"
      ref={siteHeaderRef}
      className="w-full h-16 sm:h-20 lg:h-24 relative z-20"
    >
      <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.0/css/all.min.css"
        />

      <Helmet>
        {/* Google Analytics tracking script */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-ED4F77M074"></script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ED4F77M074');
          `}
          
        </script>
        <script>
        {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '795562842429861');
            fbq('track', 'PageView');
            `}
            </script>

        <noscript>
          {`
          <img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=795562842429861&ev=PageView&noscript=1" />
          `}
        </noscript>

        <script>
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-MLNZR5J8');
         `}
        </script>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-7JCVBXM4WE"></script> 
          <script> 
            {`
          window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} 
          gtag('js', new Date()); 
          gtag('config', 'G-7JCVBXM4WE'); 
          `}
          </script>   
        </Helmet>

      <div className="innerSticky text-gray-700 body-font bg-white w-full h-16 sm:h-20 lg:h-24 z-20 ltr:pl-4 ltr:lg:pl-6 ltr:pr-4 ltr:lg:pr-6 rtl:pr-4 rtl:lg:pr-6 rtl:pl-4 rtl:lg:pl-6 transition duration-200 ease-in-out"
      >
        <div className="flex">
        <div className="md:flex justify-center items-center flex-shrink-0" style={{ marginLeft: "auto", marginRight: "auto", marginTop: "10px", textAlign: "center" }}>
          <div>
            <Logo style={{ width: "100%", height: "auto", maxWidth: "100%" }} />
          </div>
        </div>

      <div className="hidden md:flex justify-start items-center space-x-6 lg:space-x-5 xl:space-x-8 2xl:space-x-10 rtl:space-x-reverse ltr:ml-auto rtl:mr-auto flex-shrink-0"
      style={{marginRight:"10%", marginTop:"10px"}}
      >
        <div className="-mt-0.5 flex-shrink-0">
           <AuthMenu
              isAuthorized={isAuthorize}
              href={ROUTES.ACCOUNT}
              className="text-sm xl:text-base text-heading font-semibold"
              btnProps={{
                className:
                  "text-sm xl:text-base text-heading font-semibold focus:outline-none",
                children: t("text-sign-in"),
                onClick: handleLogin,
              }}
            >
              {me && me?.name ? (
                <div className="text-center">
                  <div className="mb-1">
                    Hi, {me.name}
                    <img
                      src="/assets/images/profile.png"
                      alt="Profile"
                      className="inline-block w-8 h-8 rounded-full ml-2"
                      style={{ verticalAlign: 'middle' }}
                    />
                  </div>
                </div>
              
              ) : (
                t("text-page-my-account")
              )}
            </AuthMenu>
            {me && me?.name ? (
            <a href={"/logout"}>
            <div className="text-sm text-red-500 text-right text-sm xl:text-base text-heading font-semibold">Sign Out</div>
            </a>
            ) : <span></span>
          }
            </div>
            {!me ? 
        <div className="-mt-0.5 flex-shrink-0" style={{borderLeft : "1px solid grey", paddingLeft: "25px"}}>
        <div className="text-center font-bold">
          <span className="text-xs">
          Manufacturer Login
          </span>
          <hr style={{borderBottom:"1px solid grey", margin:"5px"}} />
          <a href={"/admin/register"}>
          <span className="cursor-pointer text-red-500 text-sm">
            SELL WITH US
          </span>
          </a>
        </div>
          </div>:
        <span></span>
        }
            <CartButton />

            <button
              className="flex items-center justify-center flex-shrink-0 h-auto relative focus:outline-none transform"
              onClick={openSearch}
              aria-label="search-button"
            >
              <SearchIcon />
            </button>
          </div>
          </div>
          </div>
          {deviceWidth > 1024 ? (
            <div className="hidden md:flex innerSticky text-gray-700 body-font fixed bg-white w-full h-16 sm:h-20 lg:h-24 z-20 ltr:pl-4 ltr:lg:pl-6 ltr:pr-4 ltr:lg:pr-6 rtl:pr-4 rtl:lg:pr-6 rtl:pl-4 rtl:lg:pl-6 transition duration-200 ease-in-out" style={{ top: scrollY < 75 ? `${75 - scrollY}px` : "0", background: "#5D6B6B", height: "50px" }}>
              <div style={{marginLeft:"10%"}} className="flex items-center justify-center mx-auto max-w-[1920px] h-full w-full">
                {
                  scrollY > 75 ?
                  <div style={{marginTop:"10px"}}>
                  <a href="/">
                  <Image
                      src="/assets/images/zmenu.png"
                  width={100}
                  height={60}
                  />
                  </a>
                  </div>
                  :<span style={{width:"100px"}}></span>
                }
                <div className="flex items-center">
                  <a href="/">
                  <div className="bg-navy-blue text-white rounded-full p-2 flex items-center cursor-pointer">
                    <i className="fas fa-home mr-1"></i>
                    <span>Home</span>
                  </div>
                  </a>
                </div>
                {variant !== "modern" ? (
                  <HeaderMenu
                    data={setMenu}
                    className="hidden lg:flex ltr:md:ml-6 ltr:xl:ml-10 rtl:md:mr-6 rtl:xl:mr-10"
                  />
                ) : (
                  ""
                )}
              </div>
            </div>
      ) : null}
    </header>
  );
};

export default Header;
