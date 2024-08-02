import Container from "@components/ui/container";
import { getLayout } from "@components/layout/layout";
import Subscription from "@components/common/subscription";
// import { ShopFilters } from "@components/shop/filters";
import StickyBox from "react-sticky-box";
import ActiveLink from "@components/ui/active-link";
import { BreadcrumbItems } from "@components/common/breadcrumb";
import { ROUTES } from "@lib/routes";
import { useTranslation } from "next-i18next";
import Divider from "@components/ui/divider";
import ProductSearchBlock from "@components/product/product-search-block";
import { NewShopFilters } from "@components/shop/new-filters";
import { useRouter } from "next/router";
import { SolitaireFilters } from "@components/shop/solitaire-filters";

export { getStaticProps } from "@framework/ssr/products-filter";

export default function Shop() {
  const router = useRouter();
  const { pathname, query } = router;
  const { t } = useTranslation("common");

  console.log('query: ', query);

  return (
    <>
      <Divider className="mb-2" />
      <Container>
        <div className={`pt-8 pb-16 lg:pb-20`}>
          <div className="flex-shrink-0 hidden lg:block w-full">
            <StickyBox offsetTop={50} offsetBottom={20}>
              <div className="pb-7">
                <BreadcrumbItems separator="/">
                  <ActiveLink
                    href={"/"}
                    activeClassName="font-semibold text-heading"
                  >
                    <a>{t("breadcrumb-home")}</a>
                  </ActiveLink>
                  <ActiveLink
                    href={ROUTES.SEARCH}
                    activeClassName="font-semibold text-heading"
                  >
                    <a className="capitalize">{t("breadcrumb-search")}</a>
                  </ActiveLink>
                </BreadcrumbItems>
              </div>
              <NewShopFilters/>
              {/* <ShopFilters /> */}
            </StickyBox>
          </div>

          <div className="w-full mt-5">
            {query?.category === "solitaire" ? <SolitaireFilters/> : <></> }
            <ProductSearchBlock />
          </div>
        </div>
        <Subscription />
      </Container>
    </>
  );
}

Shop.getLayout = getLayout;