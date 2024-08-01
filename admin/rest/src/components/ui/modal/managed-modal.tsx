import Modal from "@components/ui/modal/modal";
import dynamic from "next/dynamic";
import { useModalAction, useModalState } from "./modal.context";
import MenuBuilderDeleteView from "@components/menu-builder/menu-builder-delete-view";
const TagDeleteView = dynamic(() => import("@components/tag/tag-delete-view"));
const TaxDeleteView = dynamic(() => import("@components/tax/tax-delete-view"));
const AccountDeleteView = dynamic(() => import("@components/account/account-delete-view"));
const AccountDeleteConfirmedView = dynamic(() => import("@components/account/account-delete-confirmed-view"));
const EnterCtView = dynamic(() => import("@components/product/enter-ct-view"));
const AddMoreTypeView = dynamic(() => import("@components/product/add-more-type-view"));
const AddMoreTypeFormView = dynamic(() => import("@components/product/add-more-type-form-view"));
const BanCustomerView = dynamic(() => import("@components/user/user-ban-view"));
const Test = dynamic(() => import("@components/product/test-view"));
const ShopDetail = dynamic(() => import("@components/shop/shop-detail"));
const UserWalletPointsAddView = dynamic(
  () => import("@components/user/user-wallet-points-add-view")
);
const ShippingDeleteView = dynamic(
  () => import("@components/shipping/shipping-delete-view")
);
const CategoryDeleteView = dynamic(
  () => import("@components/category/category-delete-view")
);
const CouponDeleteView = dynamic(
  () => import("@components/coupon/coupon-delete-view")
);

const ProductDeleteView = dynamic(
  () => import("@components/product/product-delete-view")
);
const BannerDeleteView = dynamic(
  () => import("@components/banner/banner-delete-view")
);
const TypeDeleteView = dynamic(
  () => import("@components/brand/brand-delete-view")
);
const AttributeDeleteView = dynamic(
  () => import("@components/attribute/attribute-delete-view")
);

const ApproveShopView = dynamic(
  () => import("@components/shop/approve-shop-view")
);

const ApproveBusinessView = dynamic(
  () => import("@components/shop/approve-business-view")
);

const ApproveCsvView = dynamic(
  () => import("@components/product/approve-csv-view")
);

const DisApproveShopView = dynamic(
  () => import("@components/shop/disapprove-shop-view")
);
const RemoveStaffView = dynamic(
  () => import("@components/shop/staff-delete-view")
);

const ExportImportView = dynamic(
  () => import("@components/product/import-export-modal")
);

const ExportImportNSView = dynamic(
  () => import("@components/product/import-export-nsmodal")
);

const AttributeExportImport = dynamic(
  () => import("@components/attribute/attribute-import-export")
);
const ManagedModal = () => {
  const { isOpen, view } = useModalState();
  const { closeModal } = useModalAction();
  return (
    <Modal open={isOpen} onClose={closeModal}>
      {view === "TEST" && <Test />}
      {view === "ADD_MORE_TYPE" && <AddMoreTypeView />}
      {view === "ADD_MORE_TYPE_FORM" && <AddMoreTypeFormView />}
      {view === "DELETE_MENU_BUILDER" && <MenuBuilderDeleteView />}
      {view === "DELETE_BANNER" && <BannerDeleteView />}
      {view === "DELETE_PRODUCT" && <ProductDeleteView />}
      {view === "DELETE_TYPE" && <TypeDeleteView />}
      {view === "DELETE_ATTRIBUTE" && <AttributeDeleteView />}
      {view === "DELETE_CATEGORY" && <CategoryDeleteView />}
      {view === "DELETE_COUPON" && <CouponDeleteView />}
      {view === "DELETE_TAX" && <TaxDeleteView />}
      {view === "DELETE_ACCOUNT" && <AccountDeleteView />}
      {view === "DELETE_ACCOUNT_CONFIRMED" && <AccountDeleteConfirmedView />}
      {view === "ENTER_CT" && <EnterCtView />}
      {view === "DELETE_SHIPPING" && <ShippingDeleteView />}
      {view === "DELETE_TAG" && <TagDeleteView />}
      {view === "BAN_CUSTOMER" && <BanCustomerView />}
      {view === "SHOP_DETAIL" && <ShopDetail />}
      {view === "SHOP_APPROVE_VIEW" && <ApproveShopView />}
      {view === "BUSINESS_APPROVE_VIEW" && <ApproveBusinessView />}
      {view === "CSV_APPROVE_VIEW" && <ApproveCsvView />}
      {view === "SHOP_DISAPPROVE_VIEW" && <DisApproveShopView />}
      {view === "DELETE_STAFF" && <RemoveStaffView />}
      {view === "ADD_WALLET_POINTS" && <UserWalletPointsAddView />}
      {view === "EXPORT_IMPORT_PRODUCT" && <ExportImportView />}
      {view === "EXPORT_IMPORT_NS_PRODUCT" && <ExportImportNSView />}
      {view === "EXPORT_IMPORT_ATTRIBUTE" && <AttributeExportImport />}
    </Modal>
  );
};

export default ManagedModal;
