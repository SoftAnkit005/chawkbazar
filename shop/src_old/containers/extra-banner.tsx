import BannerCard from "@components/common/banner-card";
import { ROUTES } from "@lib/routes";
import React from "react";
import { StaticBanner } from "@framework/types";
import { useWindowSize } from "react-use";

interface Props {
  data: StaticBanner[];
  className?: string;
}

const ExtraBanner: React.FC<Props> = ({
  className = "mb-12 md:mb-14 xl:mb-16",
  data,
}) => {
  const { width } = useWindowSize();
  return width > 1280 ?
  (
    <div
      className={`ml-14 mr-14 mt-0 grid grid-cols-1 lg:grid-cols-4 lg:gap-y-14 xl:gap-7 2xl:grid-cols-4 gap-5 ${className}`}
    >
      <div className="col-span-full lg:col-span-5 xl:col-span-5 row-span-full lg:row-auto grid grid-cols-4 gap-2 md:gap-3.5 lg:gap-5 xl:gap-7">
        {data?.sort((a, b) => a?.sequence - b?.sequence)
          ?.filter((item: any) => item?.bannerType === "vintageDemoGridBanner")
          ?.slice(3, data.length)
          ?.map((banner: any) => (
            <BannerCard
              key={`banner--key${banner?.id}`}
              data={banner}
              // href={`${ROUTES.COLLECTIONS}/${banner?.slug}`}
              href={`/${banner.slug}`}
              className="col-span-1"
            />
          ))}
      </div>
    </div>
  )
  :
  (
      <div className="col-span-full lg:col-span-5 xl:col-span-5 lg:row-span-full xl:row-auto grid grid-cols-4 gap-2 md:gap-3.5 lg:gap-5 xl:gap-7">
        {data?.sort((a, b) => a?.sequence - b?.sequence)
          ?.filter((item: any) => item?.bannerType === "vintageDemoGridBanner")
          ?.slice(3, data.length )
          ?.map((banner: any) => (
            <BannerCard
              key={`banner--key${banner?.id}`}
              data={banner}
//              href={`${ROUTES.COLLECTIONS}/${banner?.slug}`}
              href={`/${banner.slug}`}
              className="col-span-2"
            />
          ))}
      </div>
  )
  ;
};


export default ExtraBanner;
