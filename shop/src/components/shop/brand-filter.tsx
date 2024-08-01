// import { CheckBox } from "@components/ui/checkbox";
// import { useBrandsInfiniteQuery } from "@framework/brand/brands.query";
// import { useRouter } from "next/router";
// import React from "react";
// import { useTranslation } from "next-i18next";
// import { Type } from "@framework/types";
// import Button from "@components/ui/button";

// export const BrandFilter = () => {
//   const { t } = useTranslation("common");
//   const router = useRouter();
//   const { pathname, query } = router;

//   const {
//     data,
//     isLoading,
//     hasNextPage,
//     isFetchingNextPage: loadingMore,
//     fetchNextPage,
//   } = useBrandsInfiniteQuery({
//     limit: 999,
//   });

//   const selectedBrands = query?.brand ? [(query.brand as string).split(",")[(query.brand as string).split(",").length-1]] : [];
//   const [formState, setFormState] = React.useState<string[]>(selectedBrands);
//   React.useEffect(() => {
//     setFormState(selectedBrands);
//   }, [query?.brand]);

//   function handleItemClick(e: React.FormEvent<HTMLInputElement>): void {
//     const { value } = e.currentTarget;
//     if(value.includes("Select"))
//     {
//       return;
//     }
//     let currentFormState = formState.includes(value)
//       ? formState.filter((i) => i !== value)
//       : [...formState, value];
//     // setFormState(currentFormState);
//     const { brand, ...restQuery } = query;
//     router.push(
//       {
//         pathname,
//         query: {
//           ...restQuery,
//           ...(!!currentFormState.length
//             ? { brand: currentFormState[currentFormState.length-1] }
//             : {}),
//         },
//       },
//       undefined,
//       { scroll: false }
//     );
//   }

//   return (
//     <div className="block border-b border-gray-300 pb-7 mb-7 m-1 bg-gray-300" style={{ padding: '10px' }}>
//       <h3 className="text-heading text-sm md:text-base font-semibold mb-7 w-44">
//         {t("text-brands")}
//       </h3>
// 			<hr className="border-b border-gray-800 mt-0" style={{ marginTop: '-20px', marginBottom: '20px' }} />
//       <div className="mt-2 flex flex-col space-y-4">
//         {/* {!isLoading &&
//           data?.pages?.map((page) => {
//             return page?.data.map((brand: Type) => (
//               <CheckBox
//                 key={brand?.id}
//                 label={brand?.name}
//                 name={brand?.name.toLowerCase()}
//                 checked={formState?.includes(brand.slug)}
//                 value={brand?.slug}
//                 onChange={handleItemClick}
//               />
//             ));
//           })}

//         <div className="w-full">
//           {hasNextPage && (
//             <Button
//               variant="custom"
//               disabled={loadingMore}
//               onClick={() => fetchNextPage()}
//               className="text-sm text-heading ltr:pl-9 rtl:pr-9 pt-1"
//             >
//               {t("button-load-more")}
//             </Button>
//           )}
//         </div> */}
//         <select 
//                 onChange={handleItemClick}
// 				className="px-4 my-1 h-10 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent bg-white"
//         >
//           <option>Select...</option>
//         {!isLoading &&
//           data?.pages?.map((page) => {
//             return page?.data?.map((brand: Type) => (
//               <option value={brand?.slug} selected={formState.includes(brand?.slug)}>{brand?.name}</option>
//             ))
//           })
//         }     
//         </select>
//       </div>
//     </div>
//   );
// };
import { CheckBox } from "@components/ui/checkbox";
import { useBrandsInfiniteQuery } from "@framework/brand/brands.query";
import { useRouter } from "next/router";
import React from "react";
import { useTranslation } from "next-i18next";
import { Type } from "@framework/types";
import Button from "@components/ui/button";

export const BrandFilter = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { pathname, query } = router;

  const {
    data,
    isLoading,
    hasNextPage,
    isFetchingNextPage: loadingMore,
    fetchNextPage,
  } = useBrandsInfiniteQuery({
    limit: 999,
  });

  const selectedBrands = query?.brand ? [(query.brand as string).split(",")[(query.brand as string).split(",").length-1]] : [];
  const [formState, setFormState] = React.useState<string[]>(selectedBrands);
  React.useEffect(() => {
    setFormState(selectedBrands);
  }, [query?.brand]);

  function handleItemClick(e: React.FormEvent<HTMLInputElement>): void {
    const { value } = e.currentTarget;
    if(value.includes("Select"))
    {
      return;
    }
    let currentFormState = formState.includes(value)
      ? formState.filter((i) => i !== value)
      : [...formState, value];
    // setFormState(currentFormState);
    const { brand, ...restQuery } = query;
    router.push(
      {
        pathname,
        query: {
          ...restQuery,
          ...(!!currentFormState.length
            ? { brand: currentFormState[currentFormState.length-1] }
            : {}),
        },
      },
      undefined,
      { scroll: false }
    );
  }

  return (
    <div className="block border-b border-gray-300 pb-7 mb-7 m-1 bg-gray-300" style={{ padding: '10px' }}>
      <h3 className="text-heading text-sm md:text-base font-semibold mb-7 w-44">
        {t("text-brands")}
      </h3>
			<hr className="border-b border-gray-800 mt-0" style={{ marginTop: '-20px', marginBottom: '20px' }} />
      <div className="mt-2 flex flex-col space-y-4">
        {/* {!isLoading &&
          data?.pages?.map((page) => {
            return page?.data.map((brand: Type) => (
              <CheckBox
                key={brand?.id}
                label={brand?.name}
                name={brand?.name.toLowerCase()}
                checked={formState?.includes(brand.slug)}
                value={brand?.slug}
                onChange={handleItemClick}
              />
            ));
          })}

        <div className="w-full">
          {hasNextPage && (
            <Button
              variant="custom"
              disabled={loadingMore}
              onClick={() => fetchNextPage()}
              className="text-sm text-heading ltr:pl-9 rtl:pr-9 pt-1"
            >
              {t("button-load-more")}
            </Button>
          )}
        </div> */}
        <select 
                onChange={handleItemClick}
				className="px-4 my-1 h-10 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent bg-white"
        >
          <option>Select...</option>
        {!isLoading &&
          data?.pages?.map((page) => {
            return page?.data?.map((brand: Type) => (
              <option value={brand?.slug} selected={formState.includes(brand?.slug)}>{brand?.name}</option>
            ))
          })
        }     
        </select>
      </div>
    </div>
  );
};
