import Link from "@components/ui/link";
import { StaticBanner } from "@framework/types";
import { useTranslation } from "next-i18next";
import Image from "next/image";

interface Props {
  className?: string;
  data:StaticBanner[];
}

const ExclusiveBlock: React.FC<Props> = ({
  className = "mb-12 md:mb-14 xl:mb-16",
  data
}) => {
  let data1 = data?.[1];
  let data2 = data?.[2];
  const { t } = useTranslation("common");
  return (
    <div className={`rounded-md overflow-hidden lg:block ${className}`}>
      <div className="flex justify-between gap-10">
       { data1 ? <div
            className={`group w-2/4 flex justify-end items-end relative transition duration-200 ease-in 
            `}
            key={`exclusive--key${data1?.id}`}
          >
            <div className="exclusiveImage relative z-10 flex transform transition duration-200 ease-in group-hover:scale-105">
              <Image
                src={data1?.image?.mobile?.url || data1?.image?.desktop?.url || '/'}
                alt={data1?.title}
                width={600}
                height={600}
              />
            </div>
            <Link
              href={data1?.slug || '/'}
              className={`absolute z-10 bottom-3 sm:bottom-5 xl:bottom-7 inline-block bg-white shadow-product rounded-md text-heading lowercase text-sm xl:text-xl 2xl:text-xl sm:uppercase px-3 sm:px-5 xl:px-6 2xl:px-8 py-2.5 sm:py-4 xl:py-5 2xl:py-7  transform transition duration-300 ease-in-out hover:bg-heading hover:text-white`}
            >
              {t(`${data1?.title}`)}
            </Link>
          </div> : <span></span>
}
{ data2 ? 
          <div
            className={`group w-2/4 flex justify-between items-end relative transition duration-200 ease-in 
            `}
            key={`exclusive--key${data2?.id}`}
          >
            <div className="exclusiveImage relative z-10 flex transform transition duration-200 ease-in group-hover:scale-105">
              <Image
                src={data2?.image?.mobile?.url || data2?.image?.desktop?.url || '/'}
                alt={data2?.title}
                width={600}
                height={600}
              />
            </div>
            <Link
              href={data2?.slug || '/'}
              className={`absolute z-10 bottom-3 sm:bottom-5 xl:bottom-7 inline-block bg-white shadow-product rounded-md text-heading lowercase text-sm xl:text-xl 2xl:text-xl sm:uppercase px-3 sm:px-5 xl:px-6 2xl:px-8 py-2.5 sm:py-4 xl:py-5 2xl:py-7  transform transition duration-300 ease-in-out hover:bg-heading hover:text-white`}
            >
              {t(`${data2?.title}`)}
            </Link>
          </div>
: <span></span>}
      </div>
    </div>
  );
};

export default ExclusiveBlock;
