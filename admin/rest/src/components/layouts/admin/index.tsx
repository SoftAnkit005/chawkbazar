import Navbar from "@components/layouts/navigation/top-navbar";
import { Fragment } from "react";
import MobileNavigation from "@components/layouts/navigation/mobile-navigation";
import { siteSettings } from "@settings/site.settings";
import { useTranslation } from "next-i18next";
import SidebarItem from "@components/layouts/navigation/sidebar-item";
import { ROUTES } from "@utils/routes";
import { useMeQuery } from "@data/user/use-me.query";

const AdminLayout: React.FC = ({ children }) => {
  const { data: meData } = useMeQuery();
  let attributesRoute = siteSettings.sidebarLinks.admin.find(x=>x.href == ROUTES.ATTRIBUTES)
  let bannersRoute = siteSettings.sidebarLinks.admin.find(x=>x.href == ROUTES.BANNER)
  let shopsRoute = siteSettings.sidebarLinks.admin.find(x=>x.href == ROUTES.SHOPS)
  let menuBuilderRoute = siteSettings.sidebarLinks.admin.find(x=>x.href == ROUTES.MENU_BUILDER)
  let categoriesRoute = siteSettings.sidebarLinks.admin.find(x=>x.href == ROUTES.CATEGORIES )
  let tagsRoute = siteSettings.sidebarLinks.admin.find(x=>x.href == ROUTES.TAGS )
  let brandsRoute = siteSettings.sidebarLinks.admin.find(x=>x.href == ROUTES.BRANDS )
  let usersRoute = siteSettings.sidebarLinks.admin.find(x=>x.href == ROUTES.USERS )
  let taxesRoute = siteSettings.sidebarLinks.admin.find(x=>x.href == ROUTES.TAXES  )

  const { data, isLoading: loading, error } = useMeQuery();
  attributesRoute.hidden = true;
  bannersRoute.hidden = true;
  shopsRoute.hidden = true;
  menuBuilderRoute.hidden = true;
  categoriesRoute.hidden = true;
  tagsRoute.hidden = true;
  brandsRoute.hidden = true;
  usersRoute.hidden = true;
  taxesRoute.hidden = true;
  if(data?.email == "zweler.web@gmail.com")
  {
    attributesRoute.hidden = false;
    bannersRoute.hidden = false;
    shopsRoute.hidden = false;
    menuBuilderRoute.hidden = false;
    categoriesRoute.hidden = false;
    tagsRoute.hidden = false;
    brandsRoute.hidden = false;
    usersRoute.hidden = false;
    taxesRoute.hidden = false;
  }
  const { t } = useTranslation();
  const SidebarItemMap = () => (
    <Fragment>
      {siteSettings.sidebarLinks.admin.filter(x=> !x.hidden).map(({ href, label, icon }) => (
        <SidebarItem href={href} label={t(label)} icon={icon} meData={meData} key={href} />
      ))}
    </Fragment>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col transition-colors duration-150">
      <Navbar />
      <MobileNavigation>
        <SidebarItemMap />
      </MobileNavigation>

      <div className="flex flex-1 pt-20">
        <aside className="shadow w-72 xl:w-76 hidden lg:block overflow-y-auto bg-white px-4 fixed start-0 bottom-0 h-full pt-22">
          <div className="flex flex-col space-y-6 py-3">
            <SidebarItemMap />
          </div>
        </aside>
        <main className="w-full lg:ps-72 xl:ps-76">
          <div className="p-5 md:p-8 overflow-y-auto h-full">{children}</div>
        </main>
      </div>
    </div>
  );
};
export default AdminLayout;
