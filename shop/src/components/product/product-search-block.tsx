import type { FC } from "react";
import { useProductsInfiniteQuery } from "@framework/products/products.query";
import { useRouter } from "next/router";
import { formatPriceRange } from "@lib/format-price-range";
import SearchTopBar from "@components/shop/top-bar";
import ProductInfiniteGrid from "@components/product/product-infinite-grid";
import SolitaireProductInfiniteGrid from "@components/product/solitaire-product-infinite-grid";

interface ProductGridProps {
  className?: string;
}

export const ProductSearchBlock: FC<ProductGridProps> = ({
  className = "",
}) => {
  const { query } = useRouter();
  const priceRange = query.price && formatPriceRange(query.price as string);
  const sizeRange = query.size && formatPriceRange(query.size as string);
  const discountRange = query.discount && formatPriceRange(query.discount as string);

  if(query.category?.includes("solitaire"))
  {
    query.category = "solitaire";
  }

  const {
    isLoading,
    isFetchingNextPage: loadingMore,
    fetchNextPage,
    hasNextPage,
    data,
    error,
  } = useProductsInfiniteQuery({
    status:'publish',
    text: query.q && (query.q as string),
    category: query.category && (query.category as string),
    type: query.brand && (query.brand as string),
    orderBy: query.orderBy && (query.orderBy as string),
    sortedBy: query.sortedBy && (query.sortedBy as string),
    variations: query.variations && (query.variations as string),
    tags: query.tags && (query.tags as string),
    type_name: query.type_name && (query.type_name as string),
    shape: query.shape && (query.shape as string),
    color: query.color && (query.color as string),
    cut: query.cut && (query.cut as string),
    polish: query.polish && (query.polish as string),
    symmetry: query.symmetry && (query.symmetry as string),
    fluorescence: query.fluorescence && (query.fluorescence as string),
    grading: query.lab && (query.lab as string),
    clarity: query.clarity && (query.clarity as string),
    location: query.location && (query.location as string),
    ...(priceRange &&
      priceRange.length === 2 && { min_price: priceRange.join(",") }),
    ...(priceRange && priceRange.length === 1 && { max_price: priceRange[0] }),
    ...(discountRange &&
      discountRange.length === 2 && { discount: discountRange.join(",") }),
    ...(sizeRange &&
      sizeRange.length === 2 && { size: sizeRange.join(",") }),
  });

  if (error) return <p>{error.message}</p>;

  return (
    <>
      <SearchTopBar
        searchResultCount={data?.pages?.[0]?.paginatorInfo?.total}
      />
      {
      !query?.category?.includes("solitaire") && !query?.brand?.includes("ceseare") ?
      <ProductInfiniteGrid
        className={className}
        loading={isLoading}
        data={data}
        hasNextPage={hasNextPage}
        loadingMore={loadingMore}
        fetchNextPage={fetchNextPage}
      />
      :
      <SolitaireProductInfiniteGrid
        className={className}
        loading={isLoading}
        data={data}
        hasNextPage={hasNextPage}
        loadingMore={loadingMore}
        fetchNextPage={fetchNextPage}
      />
}
    </>
  );
};

export default ProductSearchBlock;
