import ProductsBlock from "@containers/products-block";
import { useProductsQuery } from "@framework/products/products.query";
import { useTranslation } from "next-i18next";
import isEmpty from "lodash/isEmpty";
import NotFoundItem from "@components/404/not-found-item";
import { useNonSolitaireProductsQuery } from "@framework/products/nonsolitaire-products.query";

export default function NewArrivalsProductFeed() {
  const { t } = useTranslation();
  const { data: products, isLoading: loading, error }: any = useNonSolitaireProductsQuery({
    limit: 10,
    status:"publish",
    orderBy: "created_at",
    sortedBy: "DESC",
  })

  if (!loading && isEmpty(products?.data)) {
    return (
      <NotFoundItem text={t("text-no-products-found")} />
    )
  }

	return (
    <ProductsBlock
      sectionHeading="text-new-arrivals"
      products={products?.data}
      loading={loading}
      error={error?.message}
      uniqueKey="new-arrivals"
    />
	);
}