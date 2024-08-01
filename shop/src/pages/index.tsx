import BannerCard from "@components/common/banner-card";
import Instagram from "@components/common/instagram";
import Subscription from "@components/common/subscription";
import Support from "@components/common/support";
import { getLayout } from "@components/layout/layout";
import NewArrivalsProductFeed from "@components/product/feeds/new-arrivals-product-feed";
import Container from "@components/ui/container";
import Divider from "@components/ui/divider";
import BannerSliderBlock from "@containers/banner-slider-block";
import BannerWithProducts from "@containers/banner-with-products";
import BrandBlock from "@containers/brand-block";
import CategoryBlock from "@containers/category-block";
import CategoryGridBlock from "@containers/category-grid-block";
import ExclusiveBlock from "@containers/exclusive-block";
import HeroWithCategoryFlash from "@containers/hero-with-category-flash";
import ProductsFlashSaleBlock from "@containers/product-flash-sale-block";
import ProductsFeatured from "@containers/products-featured";
import { useUI } from "@contexts/ui.context";
import { useShopBannersQuery } from "@framework/shop-banners/shop-banners.query";
import { ROUTES } from "@lib/routes";

export { getStaticProps } from "@framework/ssr/homepage/vintage";

export default function Home() {

  const {
    openModal,
    setModalView,
  } = useUI();
  
  let isModalShown = false;

  function openLuckyForm() {
    if (!isModalShown) {
      isModalShown = true;
      setModalView("LUCKY_FORM_VIEW");
      openModal();
    }
  }
  
  if (typeof window !== 'undefined') {
    window.onload = () => {
      console.log("Page has loaded.");
      openLuckyForm();
    };
  }


  const { data: shopBanners }: any = useShopBannersQuery();

  const vintageDemoGridBannerArray = shopBanners?.map((item: any) => ({
    id: item?.id || 0,
    title: item?.title || "",
    slug: item?.slug || "",
    image: {
      mobile: {
        url: item?.imageMobileUrl || "",
        width: item?.imageMobileWidth || 0,
        height: item?.imageMobileHeight || 0,
      },
      desktop: {
        url: item?.imageDesktopUrl || "",
        width: item?.imageDesktopWidth || 0,
        height: item?.imageDesktopHeight || 0,
      },
    },
    type: item?.type || "",
    bannerType: item?.bannerType || "",
    sequence: item?.sequence || 0,
  }));
  // console.log("vintageDemoGridBannerArray",vintageDemoGridBannerArray.sort((a: any, b : any) => a.sequence - b.sequence)?.filter((item: any) => item.bannerType === "vintageDemoGridBanner"))

  const bannerAPI = shopBanners
    ?.filter((item: any) => item?.bannerType === "vintageDemoBanner")
    ?.map((item: any) => ({
      id: item?.id || 0,
      title: item?.title || "",
      slug: item?.slug || "",
      image: {
        mobile: {
          url: item?.imageMobileUrl || "",
          width: item?.imageMobileWidth || 0,
          height: item?.imageMobileHeight || 0,
        },
        desktop: {
          url: item?.imageDesktopUrl || "",
          width: item?.imageDesktopWidth || 0,
          height: item?.imageDesktopHeight || 0,
        },
      },
      type: item?.type || "",
      bannerType: item?.bannerType || "",
    sequence: item?.sequence || 0,
    }));

    const miscBannerAPI = shopBanners
    ?.filter((item: any) => item?.bannerType === "miscBanner")
    ?.map((item: any) => ({
      id: item?.id || 0,
      title: item?.title || "",
      slug: item?.slug || "",
      image: {
        mobile: {
          url: item?.imageMobileUrl || "",
          width: item?.imageMobileWidth || 0,
          height: item?.imageMobileHeight || 0,
        },
        desktop: {
          url: item?.imageDesktopUrl || "",
          width: item?.imageDesktopWidth || 0,
          height: item?.imageDesktopHeight || 0,
        },
      },
      type: item?.type || "",
      bannerType: item?.bannerType || "",
    sequence: item?.sequence || 0,
    }))?.sort((a:any, b:any) => a.sequence > b.sequence ? 1 : -1);


  return (
    <>
    <div style={{marginTop:"50px"}}>
      <Container>
        <HeroWithCategoryFlash data={vintageDemoGridBannerArray} />
      </Container>
      <BannerSliderBlock data={vintageDemoGridBannerArray} />
      <Container>
        <CategoryBlock sectionHeading="text-shop-by-category" />
        <BannerWithProducts
          sectionHeading="text-on-selling-products"
          categorySlug="/search"
          variant="reverse"
          data={miscBannerAPI}
        />
        {bannerAPI?.length > 0 && (
          <BannerCard
            data={bannerAPI[0]}
            href={` ${ROUTES.COLLECTIONS}/${bannerAPI[0].slug}`}
            className="mb-11 md:mb-12 lg:mb-14 2xl:mb-16"
          />
        )}
        <ProductsFeatured
          sectionHeading="text-featured-products"
          variant="center"
        />
        {bannerAPI?.length > 0 && (
          <BannerCard
            data={bannerAPI[1]}
            href={`${ROUTES.COLLECTIONS}/${bannerAPI[1].slug}`}
            className="mb-11 md:mb-12 lg:mb-14 2xl:mb-16"
          />
        )}
        <ProductsFlashSaleBlock date={"2023-03-01T01:02:03"} />
        <BrandBlock sectionHeading="text-top-brands" />
        <ExclusiveBlock data={miscBannerAPI} />
        <NewArrivalsProductFeed />
        {bannerAPI?.length > 0 && (
          <BannerCard
            data={bannerAPI?.length > 0 ? bannerAPI[2] : null}
            href={
              bannerAPI?.length > 0
                ? `${ROUTES.COLLECTIONS}/${bannerAPI[2]?.slug}`
                : ""
            }
            className="mb-12 lg:mb-14 xl:mb-16 pb-0.5 lg:pb-1 xl:pb-0"
          />
        )}
        <CategoryGridBlock sectionHeading="text-featured-categories" />
        <Support />
        <Instagram />
        <Subscription className="bg-opacity-0 px-5 sm:px-16 xl:px-0 py-12 md:py-14 xl:py-16" />
      </Container>
      <Divider className="mb-0" />
      </div>
    </>
  );
}

Home.getLayout = getLayout;
