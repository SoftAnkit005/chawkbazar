import { ILFlag } from "@components/icons/ILFlag";
import { SAFlag } from "@components/icons/SAFlag";
import { CNFlag } from "@components/icons/CNFlag";
import { USFlag } from "@components/icons/USFlag";
import { DEFlag } from "@components/icons/DEFlag";
import { ESFlag } from "@components/icons/ESFlag";

export const siteSettings = {
  name: "Zweler",
  description:
    "Integrated Jewellery B2B platform",
  author: {
    name: "Zweler",
    powerName:"Softieons",
    websiteUrl: "https://softieons.com/",
    address: "",
  },
  logo: {
    url: "https://zweler.com/icons/logo.webp",
    alt: "Zweler",
    href: "/",
    width: 95,
    height: 30,
  },
  chatButtonUrl: "https://l.facebook.com/l.php?u=https%3A%2F%2Fapi.whatsapp.com%2Fsend%3Fphone%3D%252B919624077111%26data_filter_required%3DARByqWNLVfROZVrx-i2ctLl6ebcUidcU58MX2MvEGOwxBUXg5pYzv-0YCCCcSETx7nHh1hlil0izUmpexI4v3eQJUsDe710O4NGUPmIttfWXdc3dFsOgBx3wYBUxA7lO-MrktxtpCNVksVsRUtA1idhKSA%26source%3DFB_Page%26app%3Dfacebook%26entry_point%3Dpage_cta%26fbclid%3DIwAR3tXPUyEQe-n8cZgPGewH0QaSJrESMCo1my35n34lMpFGrfZc3BdKWK6ss&h=AT0h_sNoENkphcbNsWlcEAsM6FW9iJ8oWNL2aLWrgWRHPKtUo5Ftbcdzuq6B_Jzke4y3R_zNHwF-r7kkFjlolG6LmhX9_uJtGJv6IMmGrkrK9JjKC2vany9rhiL_nw",
  defaultLanguage: "en",
  currency: "USD",
  site_header: {
    languageMenu: [
      {
        id: "ar",
        name: "عربى - AR",
        value: "ar",
        icon: <SAFlag width="20px" height="15px"/>,
      },
      {
        id: "zh",
        name: "中国人 - ZH",
        value: "zh",
        icon: <CNFlag width="20px" height="15px"/>,
      },
      {
        id: "en",
        name: "English - EN",
        value: "en",
        icon: <USFlag width="20px" height="15px"/>,
      },
      {
        id: "de",
        name: "Deutsch - DE",
        value: "de",
        icon: <DEFlag width="20px" height="15px"/>,
      },
      {
        id: "he",
        name: "rעברית - HE",
        value: "he",
        icon: <ILFlag width="20px" height="15px"/>,
      },
      {
        id: "es",
        name: "Español - ES",
        value: "es",
        icon: <ESFlag width="20px" height="15px"/>,
      },
    ],
  },
  product: {
    placeholderImage: (variant = "list") => {
      return `https://zweler.com/admin/assets/placeholder/products/product-${variant}.svg`;
    }
  },
  homePageBlocks: {
    flashSale: {
      slug: "flash-sale",
    },
    featuredProducts: {
      slug: "featured-products"
    },
    onSaleSettings: {
      slug: "on-sale",
    }
  }
};
