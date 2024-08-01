export declare type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export declare type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Object: object;
  /** A datetime string with format `Y-m-d H:i:s`, e.g. `2018-05-23 13:43:32`. */
  DateTime: any;
  /**
   * Loose type that allows any value. Be careful when passing in large `Int` or `Float` literals,
   * as they may not be parsed correctly on the server side. Use `String` literals if you are
   * dealing with really large numbers to be on the safe side.
   */
  Mixed: any;
  Upload: any;
  /** A date string with format `Y-m-d`, e.g. `2011-05-23`. */
  Date: any;
  /** A datetime and timezone string in ISO 8601 format `Y-m-dTH:i:sO`, e.g. `2020-04-20T13:53:12+02:00`. */
  DateTimeTz: any;
};
/** A paginated list of Menu Builder. */
export declare type MenuBuilderPaginator = {
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
  /** A list of Menu items. */
  data: Array<MenuBuilder>;
};
export declare type MenuBuilder = {
  id: Scalars["ID"],
  label: Scalars["String"],
  categories: {
    name: string,
    slug: string,
  },
  parent?: Scalars["Int"],
  path: Scalars["Object"],
  icon?:Maybe<Attachment>,
  banners?: Maybe<Attachment[]>
};
export declare type CreateMenuBuilder = {
  label: Scalars["String"],
  categories: Scalars["Object"],
  parent?: Scalars["Int"],
  icon?:Maybe<Attachment>,
  banners?: Maybe<Attachment[]>
};
export declare type UpdateMenuBuilder = {
  label: Scalars["String"],
  categories: Scalars["Object"],
  id: Scalars["Int"],
  parent?: Scalars["Int"],
  icon?:Maybe<Attachment>,
  banners?: Maybe<Attachment[]>
};
export enum MenuBuilderType {
  /** Simple */
  Simple = "simple",
  /** Variable */
  Variable = "variable",
}

/** A paginated list of Banners. */
export declare type BannerPaginator = {
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
  /** A list of Product items. */
  data: Array<Product>;
};
export declare type CreateBanner = {
  title: Scalars["String"],
  slug: Scalars["String"],
  imageMobileUrl: Scalars["String"],
  imageMobileWidth: Scalars["Int"],
  imageMobileHeight: Scalars["Int"],
  imageDesktopUrl: Scalars["String"],
  imageDesktopWidth: Scalars["Int"],
  imageDesktopHeight: Scalars["Int"],
  type: Scalars["String"],
  bannerType: Scalars["String"],
  sequence: Scalars["Int"],
};
export declare type UpdateBanner = {
  title: Scalars["String"],
  slug: Scalars["String"],
  imageMobileUrl: Scalars["String"],
  imageMobileWidth: Scalars["Int"],
  imageMobileHeight: Scalars["Int"],
  imageDesktopUrl: Scalars["String"],
  imageDesktopWidth: Scalars["Int"],
  imageDesktopHeight: Scalars["Int"],
  type: Scalars["String"],
  bannerType: Scalars["String"],
  sequence: Scalars["Int"],
};
export enum BannerType {
  /** Simple */
  Simple = "simple",
  /** Variable */
  Variable = "variable",
}

export declare type Address = {
  id: Scalars["ID"];
  title?: Maybe<Scalars["String"]>;
  default?: Maybe<Scalars["Boolean"]>;
  address?: Maybe<UserAddress>;
  type?: Maybe<Scalars["String"]>;
  customer?: Maybe<User>;
};
export declare type UserAddress = {
  country?: Maybe<Scalars["String"]>;
  city?: Maybe<Scalars["String"]>;
  state?: Maybe<Scalars["String"]>;
  zip?: Maybe<Scalars["String"]>;
  street_address?: Maybe<Scalars["String"]>;
};
export declare type User = {
  id: Scalars["ID"];
  name: Scalars["String"];
  shops: [Shop];
  managed_shop: Shop;
  is_active: Boolean;
  email: Scalars["String"];
  created_at: Scalars["DateTime"];
  updated_at: Scalars["DateTime"];
  profile?: Maybe<Profile>;
  address: Array<Address>;
  orders?: Maybe<OrderPaginator>;
};

export declare type Profile = {
  id: Scalars["ID"];
  avatar?: Maybe<Attachment>;
  bio?: Maybe<Scalars["String"]>;
  contact: Maybe<Scalars["String"]>;
  socials?: Maybe<Array<Maybe<Social>>>;
  customer?: Maybe<User>;
};
export declare type Social = {
  type?: Maybe<Scalars["String"]>;
  link?: Maybe<Scalars["String"]>;
};
/** A paginated list of Order items. */
export declare type OrderPaginator = {
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
  /** A list of Order items. */
  data: Array<Order>;
};
/** Pagination information about the corresponding list of items. */
export declare type PaginatorInfo = {
  /** Total count of available items in the page. */
  count: Scalars["Int"];
  /** Current pagination page. */
  currentPage: Scalars["Int"];
  /** If collection has more pages. */
  hasMorePages: Scalars["Boolean"];
  /** Last page number of the collection. */
  lastPage: Scalars["Int"];
  /** Number of items per page in the collection. */
  perPage: Scalars["Int"];
  /** Total items available in the collection. */
  total: Scalars["Int"];
};
export declare type Order = {
  id: Scalars["ID"];
  tracking_number: Scalars["String"];
  courier:Scalars["String"];
  customer_contact: Scalars["String"];
  customer_id: Scalars["Int"];
  customer?: Maybe<User>;
  status: OrderStatus;
  amount: Scalars["Float"];
  sales_tax: Scalars["Float"];
  total: Scalars["Float"];
  paid_total: Scalars["Float"];
  payment_id?: Maybe<Scalars["String"]>;
  payment_gateway?: Maybe<Scalars["String"]>;
  coupon?: Maybe<Coupon>;
  discount?: Maybe<Scalars["Float"]>;
  delivery_fee?: Maybe<Scalars["Float"]>;
  delivery_time: Scalars["String"];
  products: Array<Product>;
  created_at: Scalars["DateTime"];
  updated_at: Scalars["DateTime"];
  billing_address?: Maybe<UserAddress>;
  shipping_address?: Maybe<UserAddress>;
};
export declare type OrderStatus = {
  id: Scalars["ID"];
  name: Scalars["String"];
  color: Scalars["String"];
  serial: Scalars["Int"];
  created_at: Scalars["DateTime"];
  updated_at: Scalars["DateTime"];
};
export declare type Coupon = {
  id: Scalars["ID"];
  code: Scalars["String"];
  description: Scalars["String"];
  orders: Array<Order>;
  type: Scalars["String"];
  vendor_type: Scalars["Int"];
  image: Scalars["String"];
  wastage: Scalars["Int"];
  makingCharges: Scalars["Int"];
  totalUsage: Scalars["Int"];
  usagePerUser: Scalars["Int"];
  amount: Scalars["Int"];
  active_from: Scalars["DateTime"];
  expire_at: Scalars["DateTime"];
  created_at: Scalars["DateTime"];
  updated_at: Scalars["DateTime"];
};
export declare type Product = {
  id: Scalars["ID"];
  shop_id: Scalars["ID"];
  name: Scalars["String"];
  stylecode: Scalars["String"];
  hsn: Scalars["String"];
  slug: Scalars["String"];
  type: Type;
  product_type: ProductType;
  makingCharges?: Maybe<Scalars["Float"]>;
  max_price?: Maybe<Scalars["Float"]>;
  min_price?: Maybe<Scalars["Float"]>;
  categories: Array<Category>;
  variations?: Maybe<Array<Maybe<AttributeValue>>>;
  variation_options?: Maybe<Array<Maybe<Variation>>>;
  pivot?: Maybe<OrderProductPivot>;
  orders: Array<Order>;
  description?: Maybe<Scalars["String"]>;
  in_stock?: Maybe<Scalars["Boolean"]>;
  is_taxable?: Maybe<Scalars["Boolean"]>;
  sale_price?: Maybe<Scalars["Float"]>;
  sku?: Maybe<Scalars["String"]>;
  gallery?: Maybe<Array<Maybe<Attachment>>>;
  image?: Maybe<Attachment>;
  video?: Maybe<Attachment>;
  is_featured_video?: Maybe<Scalars["Boolean"]>;
  zero_inventory_fill? :Maybe<Scalars["Int"]>;
  status?: Maybe<ProductStatus>;
  height?: Maybe<Scalars["String"]>;
  length?: Maybe<Scalars["String"]>;
  width?: Maybe<Scalars["String"]>;
  price: Scalars["Float"];
  quantity?: Maybe<Scalars["Int"]>;
  image_link?: Maybe<Scalars["String"]>;
  video_link?: Maybe<Scalars["String"]>;
  certificate_link?: Maybe<Scalars["String"]>;
  cert_no?: Maybe<Scalars["String"]>;
  shape?: Maybe<Scalars["String"]>;
  size?: Maybe<Scalars["Float"]>;
  rate_per_unit?: Maybe<Scalars["Float"]>;
  rate_per_unit_before_commission?: Maybe<Scalars["Float"]>;
  commission?: Maybe<Scalars["Float"]>;
  discount?: Maybe<Scalars["Float"]>;
  color?:Maybe<Scalars["String"]>;
  clarity?:Maybe<Scalars["String"]>;
  cut?:Maybe<Scalars["String"]>;
  polish?:Maybe<Scalars["String"]>;
  symmetry?:Maybe<Scalars["String"]>;
  fluorescence?:Maybe<Scalars["String"]>;
  grading?:Maybe<Scalars["String"]>;
  location?:Maybe<Scalars["String"]>;
  created_at: Scalars["DateTime"];
  updated_at: Scalars["DateTime"];
  buy_back_policy : BuyBackPolicyInput;
};

export declare type ImportedCsv = {
  id: Scalars["ID"];
  type_id: Scalars["Int"];
  type_name: Scalars["String"];
  shop_id: Scalars["Int"];
  shop_name: Scalars["String"];
  status: Scalars["String"];
  csv_link:Scalars["String"];
  created_at: Scalars["DateTime"];
  updated_at: Scalars["DateTime"];
};

export declare type Variation = {
  __typename?: "Variation";
  id?: Maybe<Scalars["ID"]>;
  title?: Maybe<Scalars["String"]>;
  price?: Maybe<Scalars["Float"]>;
  sku?: Maybe<Scalars["String"]>;
  is_disable?: Maybe<Scalars["Boolean"]>;
  sale_price?: Maybe<Scalars["Float"]>;
  quantity?: Maybe<Scalars["Int"]>;
  options?: Maybe<Array<Maybe<VariationOption>>>;
};
export declare type VariationInput = {
  id?: Maybe<Scalars["ID"]>;
  title?: Maybe<Scalars["String"]>;
  sku?: Maybe<Scalars["String"]>;
  is_disable?: Maybe<Scalars["Boolean"]>;
  sale_price?: Maybe<Scalars["Float"]>;
  price?: Maybe<Scalars["Float"]>;
  quantity?: Maybe<Scalars["Int"]>;
  options?: Maybe<Array<Maybe<VariationOptionInput>>>;
};
export declare type VariationOption = {
  __typename?: "VariationOption";
  name?: Maybe<Scalars["String"]>;
  value?: Maybe<Scalars["String"]>;
};
export declare type VariationOptionInput = {
  name?: Maybe<Scalars["String"]>;
  value?: Maybe<Scalars["String"]>;
};

export declare type TaxInput = {
  name?: Maybe<Scalars["String"]>;
  rate?: Maybe<Scalars["Float"]>;
  is_global?: Maybe<Scalars["Boolean"]>;
  country?: Maybe<Scalars["String"]>;
  state?: Maybe<Scalars["String"]>;
  excludeState?: Maybe<Scalars["String"]>;
  zip?: Maybe<Scalars["String"]>;
  city?: Maybe<Scalars["String"]>;
  priority?: Maybe<Scalars["Int"]>;
  on_shipping?: Maybe<Scalars["Boolean"]>;
  parents?: Maybe<Scalars["Int"]>;
};
export declare type TaxUpdateInput = {
  name?: Maybe<Scalars["String"]>;
  rate?: Maybe<Scalars["Float"]>;
  is_global?: Maybe<Scalars["Boolean"]>;
  country?: Maybe<Scalars["String"]>;
  state?: Maybe<Scalars["String"]>;
  excludeState?: Maybe<Scalars["String"]>;
  zip?: Maybe<Scalars["String"]>;
  city?: Maybe<Scalars["String"]>;
  priority?: Maybe<Scalars["Int"]>;
  on_shipping?: Maybe<Scalars["Boolean"]>;
  parents?: Maybe<Scalars["Int"]>;
};

export declare type ShippingInput = {
  name: Scalars["String"];
  amount: Scalars["Float"];
  is_global?: Maybe<Scalars["Boolean"]>;
  type: ShippingType;
};
export declare type ShippingUpdateInput = {
  name?: Maybe<Scalars["String"]>;
  amount?: Maybe<Scalars["Float"]>;
  is_global?: Maybe<Scalars["Boolean"]>;
  type?: ShippingType;
};

export declare type Type = {
  id: Scalars["ID"];
  name: Scalars["String"];
  applicableTax: Scalars["Int"];
  icon: Scalars["String"];
  slug: Scalars["String"];
  promotional_sliders?: Maybe<Array<Maybe<Attachment>>>;
  images?: Maybe<any>;
  settings?: Maybe<TypeSettings>;
  products?: Maybe<ProductPaginator>;
  created_at: Scalars["DateTime"];
  updated_at: Scalars["DateTime"];
};

export declare type TypeSettings = {
  isHome?: Maybe<Scalars["Boolean"]>;
  layoutType?: Maybe<Scalars["String"]>;
  productCard?: Maybe<Scalars["String"]>;
};

/** The available directions for ordering a list of records. */
export enum SortOrder {
  /** Sort records in ascending order. */
  Asc = "asc",
  /** Sort records in descending order. */
  Desc = "desc",
}

/** A paginated list of Product items. */
export declare type ProductPaginator = {
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
  /** A list of Product items. */
  data: Array<Product>;
};

export declare type ImportedCsvPaginator = {
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
  /** A list of ImportedCsv items. */
  data: Array<ImportedCsv>;
};

export declare type Category = {
  id: Scalars["ID"];
  name: Scalars["String"];
  slug: Scalars["String"];
  parent?: Maybe<Scalars["Int"]>;
  children: Array<Category>;
  details?: Maybe<Scalars["String"]>;
  image?: Maybe<Attachment>;
  icon?: Maybe<Scalars["String"]>;
  type: Type;
  products: Array<Product>;
  created_at: Scalars["DateTime"];
  updated_at: Scalars["DateTime"];
};
export declare type Attachment = {
  thumbnail?: Maybe<Scalars["String"]>;
  original?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["ID"]>;
};
export declare type AttributeValue = {
  id: Scalars["ID"];
  value?: Maybe<Scalars["String"]>;
  vendor_type:Scalars["Int"];
  attribute?: Maybe<Attribute>;
  products: Array<Product>;
  pivot?: Maybe<VariationProductPivot>;
};
export declare type Attribute = {
  id: Scalars["ID"];
  name: Scalars["String"];
  slug: Scalars["String"];
  values: Array<AttributeValue>;
  shop_id?: Maybe<Scalars["Int"]>;
};
export declare type VariationProductPivot = {
  price?: Maybe<Scalars["Float"]>;
};
export declare type OrderProductPivot = {
  order_quantity?: Maybe<Scalars["Int"]>;
  unit_price?: Maybe<Scalars["Float"]>;
  subtotal?: Maybe<Scalars["Float"]>;
};

export enum ProductStatus {
  Publish = "publish",
  Draft = "draft",
}

/** A paginated list of Category items. */
export declare type CategoryPaginator = {
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
  /** A list of Category items. */
  data: Array<Category>;
};
/** A paginated list of Coupon items. */
export declare type CouponPaginator = {
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
  /** A list of Coupon items. */
  data: Array<Coupon>;
};

/** A paginated list of OrderStatus items. */
export declare type OrderStatusPaginator = {
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
  /** A list of OrderStatus items. */
  data: Array<OrderStatus>;
};

export declare type Settings = {
  id: Scalars["ID"];
  options: SettingsOptions;
};

/** A paginated list of User items. */
export declare type UserPaginator = {
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
  /** A list of User items. */
  data: Array<User>;
};
export declare type AddressInput = {
  title: Scalars["String"];
  default?: Maybe<Scalars["Boolean"]>;
  address: UserAddressInput;
  type: Scalars["String"];
  customer?: Maybe<ConnectBelongsTo>;
};
export declare type UserAddressInput = {
  country: Maybe<Scalars["String"]>;
  city: Maybe<Scalars["String"]>;
  state: Maybe<Scalars["String"]>;
  zip: Maybe<Scalars["String"]>;
  street_address: Maybe<Scalars["String"]>;
};
export declare type ConnectBelongsTo = {
  connect?: Maybe<Scalars["ID"]>;
};
export declare type AttributeValueInput = {
  id?: Maybe<Scalars["Int"]>;
  value: Scalars["String"];
  rate: Scalars["Float"];
  meta?: Maybe<Scalars["String"]>;
};
export declare type AttributeInput = {
  name: Scalars["String"];
  vendor_type: Scalars["Int"];
  values: AttributeValueInput;
};
export declare type AttributeValueCreateInput = {
  value: Scalars["String"];
  meta: Scalars["String"];
  rate: Scalars["Float"];
  attribute_id?: Scalars["ID"];
};
export declare type AttributeBelongTo = {
  connect: Scalars["ID"];
};
export declare type AttributeValueUpdateInput = {
  id?: Maybe<Scalars["Int"]>;
  value?: Maybe<Scalars["String"]>;
  rate: Scalars["Float"];
  meta?: Maybe<Scalars["String"]>;
  attribute_id?: Scalars["ID"];
};
export declare type CreateCategory = {
  name: Scalars["String"];
  type_id?: Maybe<Scalars["ID"]>;
  parent?: Maybe<Scalars["Int"]>;
  details?: Maybe<Scalars["String"]>;
  image?: Maybe<AttachmentInput>;
  icon?: Maybe<Scalars["String"]>;
};
export declare type ConnectTypeBelongsTo = {
  connect?: Maybe<Scalars["ID"]>;
};
export declare type AttachmentInput = {
  thumbnail?: Maybe<Scalars["String"]>;
  original?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["ID"]>;
};
export declare type UpdateCategory = {
  name?: Maybe<Scalars["String"]>;
  type_id?: Maybe<Scalars["ID"]>;
  parent?: Maybe<Scalars["Int"]>;
  details?: Maybe<Scalars["String"]>;
  image?: Maybe<AttachmentInput>;
  icon?: Maybe<Scalars["String"]>;
};
export declare type CheckoutVerificationInput = {
  amount: Scalars["Float"];
  products: Array<ConnectProductOrderPivot>;
  billing_address?: Maybe<UserAddressInput>;
  shipping_address?: Maybe<UserAddressInput>;
};
export declare type ConnectProductOrderPivot = {
  product_id: Scalars["ID"];
  order_quantity?: Maybe<Scalars["Int"]>;
  unit_price?: Maybe<Scalars["Float"]>;
  subtotal?: Maybe<Scalars["Float"]>;
};
export declare type VerifiedCheckoutData = {
  total_tax: Scalars["Float"];
  shipping_charge: Scalars["Float"];
  unavailable_products: Array<Scalars["ID"]>;
};

export type Shipping = {
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  amount?: Maybe<Scalars["Float"]>;
  is_global?: Maybe<Scalars["Boolean"]>;
  type?: ShippingType;
};

export enum ShippingType {
  /** Fixed */
  Fixed = "fixed",
  /** Percentage */
  Percentage = "percentage",
  /** Free */
  Free = "free_shipping",
}

export type Tax = {
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  rate?: Maybe<Scalars["Float"]>;
  is_global?: Maybe<Scalars["Boolean"]>;
  country?: Maybe<Scalars["String"]>;
  state?: Maybe<Scalars["String"]>;
  excludeState?: Maybe<Scalars["String"]>;
  zip?: Maybe<Scalars["String"]>;
  city?: Maybe<Scalars["String"]>;
  priority?: Maybe<Scalars["Int"]>;
  on_shipping?: Maybe<Scalars["Boolean"]>;
  parents?:Maybe<Scalars["Int"]>;
};

export declare type CouponInput = {
  code: Scalars["String"];
  type: CouponType;
  vendor_type: Scalars["Int"];
  wastage: Scalars["Int"];
  makingCharges: Scalars["Int"];
  totalUsage: Scalars["Int"];
  usagePerUser: Scalars["Int"];
  amount: Scalars["Int"];
  description?: Maybe<Scalars["String"]>;
  image?: Maybe<AttachmentInput>;
  active_from: Scalars["DateTime"];
  expire_at: Scalars["DateTime"];
};

export enum CouponType {
  /** Fixed coupon */
  FixedCoupon = "fixed",
  /** Percentage coupon */
  PercentageCoupon = "percentage",
  /** Free shipping coupon */
  FreeShippingCoupon = "free_shipping",
}

export declare type CouponUpdateInput = {
  code?: Maybe<Scalars["String"]>;
  type?: Maybe<CouponType>;
  vendor_type: Scalars["Int"];
  wastage: Scalars["Int"];
  makingCharges: Scalars["Int"];
  totalUsage: Scalars["Int"];
  usagePerUser: Scalars["Int"];
  amount?: Maybe<Scalars["Int"]>;
  description?: Maybe<Scalars["String"]>;
  image?: Maybe<AttachmentInput>;
  active_from?: Maybe<Scalars["DateTime"]>;
  expire_at?: Maybe<Scalars["DateTime"]>;
};
export declare type UpdateOrder = {
  tracking_number?: Maybe<Scalars["String"]>;
  courier:Scalars["String"];
  customer_id?: Maybe<Scalars["ID"]>;
  status?: Maybe<Scalars["ID"]>;
  products?: Array<ConnectProductOrderPivot>;
  amount?: Maybe<Scalars["Float"]>;
  sales_tax?: Maybe<Scalars["Float"]>;
  total?: Maybe<Scalars["Float"]>;
  paid_total?: Maybe<Scalars["Float"]>;
  payment_id?: Maybe<Scalars["String"]>;
  payment_gateway?: Maybe<Scalars["String"]>;
  coupon_id?: Maybe<Scalars["ID"]>;
  discount?: Maybe<Scalars["Float"]>;
  delivery_fee?: Maybe<Scalars["Float"]>;
  delivery_time?: Maybe<Scalars["String"]>;
  billing_address?: Maybe<UserAddressInput>;
  shipping_address?: Maybe<UserAddressInput>;
};
export declare type CreateOrder = {
  tracking_number: Scalars["String"];
  courier:Scalars["String"];
  customer_id: Scalars["Int"];
  status: Scalars["Int"];
  products: Array<ConnectProductOrderPivot>;
  amount: Scalars["Float"];
  sales_tax?: Maybe<Scalars["Float"]>;
  total: Scalars["Float"];
  paid_total: Scalars["Float"];
  payment_id?: Maybe<Scalars["String"]>;
  payment_gateway: Scalars["String"];
  coupon_id?: Maybe<Scalars["Int"]>;
  discount?: Maybe<Scalars["Float"]>;
  delivery_fee?: Maybe<Scalars["Float"]>;
  delivery_time: Scalars["String"];
  card?: Maybe<CardInput>;
  billing_address?: Maybe<UserAddressInput>;
  shipping_address?: Maybe<UserAddressInput>;
};
export declare type CardInput = {
  number: Scalars["String"];
  expiryMonth: Scalars["String"];
  expiryYear: Scalars["String"];
  cvv: Scalars["String"];
  email?: Maybe<Scalars["String"]>;
};
export declare type OrderStatusInput = {
  name: Scalars["String"];
  color: Scalars["String"];
  serial: Scalars["Int"];
};

export declare type OrderStatusUpdateInput = {
  id: Scalars["ID"];
  name: Scalars["String"];
  color: Scalars["String"];
  serial: Scalars["Int"];
};

export declare type CreateProduct = {
  name: Scalars["String"];
  stylecode: Scalars["String"];
  hsn: Scalars["String"];
  type_id: Scalars["String"];
  price: Scalars["Float"];
  sale_price?: Maybe<Scalars["Float"]>;
  quantity: Scalars["Int"];
  unit: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
  categories?: Maybe<Array<Scalars["ID"]>>;
  variations?: Maybe<Array<AttributeProductPivot>>;
  in_stock?: Maybe<Scalars["Boolean"]>;
  is_taxable?: Maybe<Scalars["Boolean"]>;
  sku?: Maybe<Scalars["String"]>;
  gallery?: Maybe<Array<Maybe<AttachmentInput>>>;
  image?: Maybe<AttachmentInput>;
  video?: Maybe<AttachmentInput>;
  is_featured_video?: Maybe<Scalars["Boolean"]>;
  status?: Maybe<ProductStatus>;
  height?: Maybe<Scalars["String"]>;
  length?: Maybe<Scalars["String"]>;
  width?: Maybe<Scalars["String"]>;
  image_link?: Maybe<Scalars["String"]>;
  video_link?: Maybe<Scalars["String"]>;
  certificate_link?: Maybe<Scalars["String"]>;
  cert_no?: Maybe<Scalars["String"]>;
  shape?: Maybe<Scalars["String"]>;
  size?: Maybe<Scalars["Float"]>;
  rate_per_unit?: Maybe<Scalars["Float"]>;
  rate_per_unit_before_commission?: Maybe<Scalars["Float"]>;
  commission?: Maybe<Scalars["Float"]>;
  discount?: Maybe<Scalars["Float"]>;
  color?:Maybe<Scalars["String"]>;
  clarity?:Maybe<Scalars["String"]>;
  cut?:Maybe<Scalars["String"]>;
  polish?:Maybe<Scalars["String"]>;
  symmetry?:Maybe<Scalars["String"]>;
  fluorescence?:Maybe<Scalars["String"]>;
  grading?:Maybe<Scalars["String"]>;
  location?:Maybe<Scalars["String"]>;
};
export declare type AttributeProductPivot = {
  id: Scalars["ID"];
  price?: Maybe<Scalars["Float"]>;
};
export declare type UpdateProduct = {
  name: Scalars["String"];
  stylecode: Scalars["String"];
  hsn: Scalars["String"];
  type_id: Scalars["String"];
  price: Scalars["Float"];
  sale_price?: Maybe<Scalars["Float"]>;
  quantity: Scalars["Int"];
  unit: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
  categories?: Maybe<Array<Scalars["ID"]>>;
  variations?: Maybe<Array<AttributeProductPivot>>;
  in_stock?: Maybe<Scalars["Boolean"]>;
  is_taxable?: Maybe<Scalars["Boolean"]>;
  sku?: Maybe<Scalars["String"]>;
  gallery?: Maybe<Array<Maybe<AttachmentInput>>>;
  image?: Maybe<AttachmentInput>;
  video?: Maybe<AttachmentInput>;
  is_featured_video?: Maybe<Scalars["Boolean"]>;
  status?: Maybe<ProductStatus>;
  height?: Maybe<Scalars["String"]>;
  length?: Maybe<Scalars["String"]>;
  width?: Maybe<Scalars["String"]>;
  image_link?: Maybe<Scalars["String"]>;
  video_link?: Maybe<Scalars["String"]>;
  certificate_link?: Maybe<Scalars["String"]>;
  cert_no?: Maybe<Scalars["String"]>;
  shape?: Maybe<Scalars["String"]>;
  size?: Maybe<Scalars["Float"]>;
  rate_per_unit?: Maybe<Scalars["Float"]>;
  rate_per_unit_before_commission?: Maybe<Scalars["Float"]>;
  commission?: Maybe<Scalars["Float"]>;
  discount?: Maybe<Scalars["Float"]>;
  color?:Maybe<Scalars["String"]>;
  clarity?:Maybe<Scalars["String"]>;
  cut?:Maybe<Scalars["String"]>;
  polish?:Maybe<Scalars["String"]>;
  symmetry?:Maybe<Scalars["String"]>;
  fluorescence?:Maybe<Scalars["String"]>;
  grading?:Maybe<Scalars["String"]>;
  location?:Maybe<Scalars["String"]>;
};
export declare type ProfileInput = {
  avatar?: Maybe<Scalars["String"]>;
  bio?: Maybe<Scalars["String"]>;
  socials?: Maybe<Array<Maybe<SocialInput>>>;
  contact?: Maybe<Scalars["String"]>;
  customer?: Maybe<ConnectBelongsTo>;
};

export declare type SettingsInput = {
  options?: Maybe<SettingsOptionsInput>;
};

export type SettingsOptionsInput = {
  siteTitle?: Maybe<Scalars["String"]>;
  siteSubtitle?: Maybe<Scalars["String"]>;
  currency?: Maybe<Scalars["String"]>;
  minimumOrderAmount?: Maybe<Scalars["Float"]>;
  logo?: Maybe<AttachmentInput>;
  taxClass?: Maybe<Scalars["String"]>;
  shippingClass?: Maybe<Scalars["String"]>;
  contactDetails?: Maybe<ContactDetailsInput>;
};
export type DeliveryTime = {
  description?: Maybe<Scalars["String"]>;
  title?: Maybe<Scalars["String"]>;
};

export type DeliveryTimeInput = {
  description?: Maybe<Scalars["String"]>;
  title?: Maybe<Scalars["String"]>;
};

export type FacebookSettings = {
  appId?: Maybe<Scalars["String"]>;
  isEnable?: Maybe<Scalars["Boolean"]>;
  pageId?: Maybe<Scalars["String"]>;
};

export type GoogleSettings = {
  isEnable?: Maybe<Scalars["Boolean"]>;
  tagManagerId?: Maybe<Scalars["String"]>;
};

export type SeoSettings = {
  canonicalUrl?: Maybe<Scalars["String"]>;
  metaDescription?: Maybe<Scalars["String"]>;
  metaTags?: Maybe<Scalars["String"]>;
  metaTitle?: Maybe<Scalars["String"]>;
  ogDescription?: Maybe<Scalars["String"]>;
  ogImage?: Maybe<Attachment>;
  ogTitle?: Maybe<Scalars["String"]>;
  twitterCardType?: Maybe<Scalars["String"]>;
  twitterHandle?: Maybe<Scalars["String"]>;
};

export type SettingsOptions = {
  contactDetails?: Maybe<ContactDetails>;
  currency?: Maybe<Scalars["String"]>;
  deliveryTime?: Maybe<Array<Maybe<DeliveryTime>>>;
  facebook?: Maybe<FacebookSettings>;
  google?: Maybe<GoogleSettings>;
  logo?: Maybe<Attachment>;
  minimumOrderAmount?: Maybe<Scalars["Float"]>;
  seo?: Maybe<SeoSettings>;
  shippingClass?: Maybe<Scalars["String"]>;
  siteSubtitle?: Maybe<Scalars["String"]>;
  siteTitle?: Maybe<Scalars["String"]>;
  taxClass?: Maybe<Scalars["String"]>;
  signupPoints: Maybe<Scalars["Int"]>;
};

export declare type LoginInput = {
  email: Scalars["String"];
  password: Scalars["String"];
};
export declare type RegisterInput = {
  email: Scalars["String"];
  password: Scalars["String"];
  name: Scalars["String"];
  shop_id?: Scalars["Int"];
  permission: Permission;
};

export type ChangePasswordInput = {
  oldPassword: Scalars["String"];
  newPassword: Scalars["String"];
};

export type PasswordChangeResponse = {
  message?: Maybe<Scalars["String"]>;
  success?: Maybe<Scalars["Boolean"]>;
};

export type ForgetPasswordInput = {
  email: Scalars["String"];
};

export type VerifyForgetPasswordTokenInput = {
  token: Scalars["String"];
  email: Scalars["String"];
};

export type ResetPasswordInput = {
  token: Scalars["String"];
  email: Scalars["String"];
  password: Scalars["String"];
};

export enum Permission {
  /** Super admin */
  SuperAdmin = "super_admin",
  /** Store owner */
  StoreOwner = "store_owner",
  /** Store keeper */
  Staff = "staff" /** Customer */,
  Customer = "customer",
}

export type UpdateUser = {
  name?: Maybe<Scalars["String"]>;
  profile?: Maybe<UserProfileInput>;
  address?: Maybe<Array<Maybe<UserAddressUpsertInput>>>;
};
export type CreateUser = {
  name?: Maybe<Scalars["String"]>;
  email: Scalars["String"];
  password: Scalars["String"];
  profile?: Maybe<UserProfileInput>;
  address?: Maybe<Array<Maybe<UserAddressUpsertInput>>>;
};

export type SocialInput = {
  type?: Maybe<Scalars["String"]>;
  link?: Maybe<Scalars["String"]>;
};

export type UserProfileInput = {
  id: Scalars["ID"];
  avatar?: Maybe<AttachmentInput>;
  bio?: Maybe<Scalars["String"]>;
  socials?: Maybe<Array<Maybe<SocialInput>>>;
  contact?: Maybe<Scalars["String"]>;
};

export type UserAddressUpsertInput = {
  title: Scalars["String"];
  default?: Maybe<Scalars["Boolean"]>;
  address: UserAddressInput;
  type: Scalars["String"];
};

export declare type Analytics = {
  totalRevenue?: Maybe<Scalars["Float"]>;
  todaysRevenue?: Maybe<Scalars["Float"]>;
  totalOrders?: Maybe<Scalars["Int"]>;
  totalShops?: Maybe<Scalars["Int"]>;
  newCustomers?: Maybe<Scalars["Int"]>;
  totalYearSaleByMonth?: Maybe<Array<Maybe<TotalYearSaleByMonth>>>;
};
export declare type TotalYearSaleByMonth = {
  total?: Maybe<Scalars["Float"]>;
  month?: Maybe<Scalars["String"]>;
};

export type CreateTypeInput = {
  name: Scalars["String"];
  gallery?: Maybe<Array<AttachmentInput>>;
  icon?: Maybe<Scalars["String"]>;
  banner_text?: Maybe<Scalars["String"]>;
};

export enum ProductType {
  /** Simple */
  Simple = "simple",
  /** Variable */
  Variable = "variable",
}

export declare type ApproveShopInput = {
  id: Scalars["ID"];
  customer_type: Scalars["Int"],
  admin_commission_rate: Scalars["Float"];
  admin_commission_rate_solitaire: Scalars["Float"];
  vendor_code:Scalars["String"];
  markup_type:Scalars["String"];
  making_charges_markup:Scalars["Float"];
  wastage_markup:Scalars["Float"];
};
export declare type ApproveBusinessInput = {
  user_id: Scalars["ID"];
  customer_type: Scalars["Int"];
  is_approved: Scalars["Int"];
};
export declare type ApproveWithdrawInput = {
  id: Scalars["ID"];
  status: WithdrawStatus;
};

export declare enum WithdrawStatus {
  /** Approved */
  Approved = "APPROVED",

  /** Pending */
  Pending = "PENDING",

  /** On hold */
  OnHold = "ON_HOLD",

  /** Rejected */
  Rejected = "REJECTED",

  /** Processing */
  Processing = "PROCESSING",
}

export declare type Shop = {
  id?: Maybe<Scalars["ID"]>;
  owner_id?: Maybe<Scalars["Int"]>;
  owner?: Maybe<User>;
  vendor_code:Scalars["String"];
  staffs?: Maybe<Array<Maybe<User>>>;
  is_active?: Maybe<Scalars["Boolean"]>;
  orders_count?: Maybe<Scalars["Int"]>;
  products_count?: Maybe<Scalars["Int"]>;
  balance?: Maybe<Balance>;
  name?: Maybe<Scalars["String"]>;
  slug?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  cover_image?: Maybe<Attachment>;
  logo?: Maybe<Attachment>;
  address?: Maybe<UserAddress>;
  settings?: Maybe<ShopSettings>;
  created_at?: Maybe<Scalars["DateTime"]>;
  updated_at?: Maybe<Scalars["DateTime"]>;
  buy_back_policy?:Maybe<BuyBackPolicyInput>;
};

export declare type PaymentInfo = {
  accounts: Maybe<Scalars["String"]>;
  name: Maybe<Scalars["String"]>;
  email: Maybe<Scalars["String"]>;
  bank: Maybe<Scalars["String"]>;
  ifsc: Maybe<Scalars["String"]>;
};
export declare type PaymentInfoInput = {
  accounts: Maybe<Scalars["String"]>;
  name: Maybe<Scalars["String"]>;
  email: Maybe<Scalars["String"]>;
  bank: Maybe<Scalars["String"]>;
  ifsc: Maybe<Scalars["String"]>;
  gstin: Maybe<Scalars["String"]>;
};

export declare type Balance = {
  id?: Maybe<Scalars["ID"]>;
  admin_commission_rate?: Maybe<Scalars["Float"]>;
  admin_commission_rate_solitaire?: Scalars["Float"];
  shop?: Maybe<Shop>;
  total_earnings?: Maybe<Scalars["Float"]>;
  withdrawn_amount?: Maybe<Scalars["Float"]>;
  current_balance?: Maybe<Scalars["Float"]>;
  payment_info: Maybe<PaymentInfo>;
};
export declare type BalanceInput = {
  id?: Maybe<Scalars["ID"]>;
  payment_info: Maybe<PaymentInfoInput>;
};
export declare type ShopInput = {
  name: Scalars["String"];
  vendor_code:Scalars["String"];
  description?: Maybe<Scalars["String"]>;
  cover_image?: Maybe<AttachmentInput>;
  logo?: Maybe<AttachmentInput>;
  address?: Maybe<UserAddressInput>;
  settings?: Maybe<ShopSettingsInput>;
  categories?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  balance?: Maybe<BalanceInput>;
  buy_back_policy?:Maybe<BuyBackPolicyInput>;
};
/** A paginated list of Shop items. */

export declare type ShopPaginator = {
  /** Pagination information about the list of items. */

  paginatorInfo: PaginatorInfo;
  /** A list of Shop items. */

  data: Array<Shop>;
};

export declare type Tag = {
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  slug?: Maybe<Scalars["String"]>;
  parent?: Maybe<Scalars["Int"]>;
  details?: Maybe<Scalars["String"]>;
  image?: Maybe<Attachment>;
  icon?: Maybe<Scalars["String"]>;
  type?: Maybe<Type>;
  products?: Maybe<Array<Maybe<Product>>>;
  created_at?: Maybe<Scalars["DateTime"]>;
  updated_at?: Maybe<Scalars["DateTime"]>;
};
/** A paginated list of Tag items. */

export declare type TagPaginator = {
  /** Pagination information about the list of items. */

  paginatorInfo: PaginatorInfo;
  /** A list of Tag items. */

  data: Array<Tag>;
};

export declare type CreateTagInput = {
  name: Scalars["String"];
  type?: Maybe<ConnectTypeBelongsTo>;
  slug?: Maybe<Scalars["String"]>;
  details?: Maybe<Scalars["String"]>;
  image?: Maybe<AttachmentInput>;
  icon?: Maybe<Scalars["String"]>;
};

export declare type UpdateTagInput = {
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  slug?: Maybe<Scalars["String"]>;
  type?: Maybe<ConnectTypeBelongsTo>;
  details?: Maybe<Scalars["String"]>;
  image?: Maybe<AttachmentInput>;
  icon?: Maybe<Scalars["String"]>;
};

export declare type Withdraw = {
  __typename?: "Withdraw";
  id?: Maybe<Scalars["ID"]>;
  amount?: Maybe<Scalars["Float"]>;
  status?: Maybe<WithdrawStatus>;
  shop_id?: Maybe<Scalars["Int"]>;
  shop?: Maybe<Shop>;
  payment_method?: Maybe<Scalars["String"]>;
  details?: Maybe<Scalars["String"]>;
  note?: Maybe<Scalars["String"]>;
  created_at?: Maybe<Scalars["DateTime"]>;
  updated_at?: Maybe<Scalars["DateTime"]>;
};
/** A paginated list of Withdraw items. */

export declare type WithdrawPaginator = {
  __typename?: "WithdrawPaginator";
  /** Pagination information about the list of items. */

  paginatorInfo: PaginatorInfo;
  /** A list of Withdraw items. */

  data: Array<Withdraw>;
};

export declare type CreateWithdrawInput = {
  amount: Scalars["Float"];
  shop_id: Scalars["Int"];
  payment_method?: Maybe<Scalars["String"]>;
  details?: Maybe<Scalars["String"]>;
  note?: Maybe<Scalars["String"]>;
};

export declare type AddStaffInput = {
  email: Scalars["String"];
  password: Scalars["String"];
  name: Scalars["String"];
  shop_id: Scalars["Int"];
};

export declare type BuyBackPolicyInput = {
  buy_back_description: Scalars["String"];
  buy_back_value: Scalars["String"];
};

export declare type ShopSettings = {
  socials?: Maybe<Array<Maybe<ShopSocials>>>;
  contact: Maybe<Scalars["String"]>;
  location?: Maybe<Location>;
  website?: Maybe<Scalars["String"]>;
};
export declare type ShopSocialInput = {
  icon?: Maybe<Scalars["String"]>;
  url?: Maybe<Scalars["String"]>;
  label?: Maybe<Scalars["String"]>;
};
export declare type ShopSocials = {
  icon?: Maybe<Scalars["String"]>;
  url?: Maybe<Scalars["String"]>;
};

export declare type Location = {
  lat?: Maybe<Scalars["Float"]>;
  lng?: Maybe<Scalars["Float"]>;
  city?: Maybe<Scalars["String"]>;
  state?: Maybe<Scalars["String"]>;
  country?: Maybe<Scalars["String"]>;
  zip?: Maybe<Scalars["String"]>;
  formattedAddress?: Maybe<Scalars["String"]>;
};

export declare type LocationInput = {
  lat?: Maybe<Scalars["Float"]>;
  lng?: Maybe<Scalars["Float"]>;
  city?: Maybe<Scalars["String"]>;
  state?: Maybe<Scalars["String"]>;
  country?: Maybe<Scalars["String"]>;
  zip?: Maybe<Scalars["String"]>;
  formattedAddress?: Maybe<Scalars["String"]>;
};

export declare type ShopSettingsInput = {
  socials?: Maybe<Array<Maybe<ShopSocialInput>>>;
  contact: Maybe<Scalars["String"]>;
  location?: Maybe<LocationInput>;
  website?: Maybe<Scalars["String"]>;
};

export declare type ContactDetails = {
  __typename?: "ContactDetails";
  socials?: Maybe<Array<Maybe<ShopSocials>>>;
  contact: Maybe<Scalars["String"]>;
  location?: Maybe<Location>;
  website?: Maybe<Scalars["String"]>;
};
export declare type ContactDetailsInput = {
  socials?: Maybe<Array<Maybe<ShopSocialInput>>>;
  contact: Maybe<Scalars["String"]>;
  location?: Maybe<LocationInput>;
  website?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
};

export declare type TypeSettingsInput = {
  isHome?: Maybe<Scalars["Boolean"]>;
  layoutType?: Maybe<Scalars["String"]>;
  productCard?: Maybe<Scalars["String"]>;
};

export declare type CustomerType = {
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
};

export declare type CustomerTypeInput = {
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
};