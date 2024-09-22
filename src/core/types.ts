import { Dispatch, SetStateAction } from "react";

export type SetState<T> = Dispatch<SetStateAction<T>>;

export type BusinessHour = {
  days: string[];
  open_time: string;
  close_time: string;
};

export type SpecialDay = {
  date: Date;
  reason_code: number;
  reason_name: string;
  open_time: string;
  close_time: string;
};

export type OpenFlip = {
  created_at: Date;
  type: "OPEN" | "CLOSE_UNTIL_NEXT_DAY" | "CLOSE_UNTIL_NEXT_OPEN";
};

export type CreateMarketDto = {
  type: string;
  name: string;
  document: string;
  pix_key?: string;
  pix_key_type?: string;
  order_min: string;
  delivery_fee: string;
  min_time: string;
  max_time: string;
  markup: string;
  payments_accepted: string[];
  business_hours: BusinessHour[];
  address_street: string;
  address_number: string;
  address_district: string;
  address_city: string;
  address_state: string;
  address_complement?: string;
};

export type ProfileType = Pick<
  CreateMarketDto,
  | "name"
  | "document"
  | "pix_key_type"
  | "pix_key"
  | "payments_accepted"
  | "order_min"
  | "delivery_fee"
  | "min_time"
  | "max_time"
  | "markup"
  | "business_hours"
> & {
  market_id: string;
  special_days: SpecialDay[];
  open_flips: OpenFlip[];
};

type ChatMessageAuthor = "CUSTOMER" | "MARKET";

export type ChatMsg = {
  id: string;
  customer_id: string;
  market_id: string;
  order_id: string;
  market_order_id: string;
  created_at: Date;
  author: ChatMessageAuthor;
  message: string;
};

export type CreateChatMsgDto = Pick<
  ChatMsg,
  "market_id" | "order_id" | "message"
>;

export type PendingChatMsg = CreateChatMsgDto & { hasError?: boolean };

export type OrderAction = "APPROVE" | "DELIVERY" | "COMPLETE" | "CANCEL";

export type OrderStatus =
  | "PAYMENT_PROCESSING"
  | "PAYMENT_FAILED"
  | "PAYMENT_REQUIRE_ACTION"
  | "APPROVAL_PENDING"
  | "PROCESSING"
  | "DELIVERY_PENDING"
  | "COMPLETING"
  | "COMPLETED"
  | "CANCELING"
  | "CANCELED";

export type OrderType = {
  order_id: string;
  market_id: string;
  market_order_id: string;
  customer_id: string;
  customer_name: string;
  status: OrderStatus;
  created_at: string;
  finished_at?: string;
  delivery_max_time: string;
  delivery_min_time: string;
  address_street: string;
  address_number: string;
  address_district: string;
  address_complement?: string;
  paid_in_app: boolean;
  payment_description: string;
  payment_change?: string;
  delivery_fee: string;
  total: string;
  items: (Omit<ProductType, "stock"> & { quantity: string })[];
};

export type OrderUpdate = Partial<OrderType> & { order_id: string };

export type DiscountType =
  | "DISCOUNT_VALUE"
  | "DISCOUNT_PERCENT"
  | "DISCOUNT_PERCENT_ON_SECOND"
  | "ONE_FREE";

export type ProductType = {
  key: string;
  isNew: boolean;
  isCommodity: boolean;
  item_id: string;
  city_slug: string;
  code: string;
  price: string;
  stock: string;
  description: string;
  is_kit?: boolean;
  unit_weight?: string;
  discount_type?: DiscountType;
  discount_value_1?: number | null;
  discount_value_2?: number | null;
  discount_max_per_client?: number;
  details?: { quantity: string; product: { name: string } };
  missing?: { quantity: string };
};

export type ProductActivity = {
  item_id: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  product_code: string;
  item_name: string;
  occurred_at: string;
  new_price: string | null;
  new_stock: string | null;
};

export type SetProductDto = Pick<
  ProductType,
  | "item_id"
  | "city_slug"
  | "code"
  | "price"
  | "stock"
  | "unit_weight"
  | "discount_type"
  | "discount_value_1"
  | "discount_value_2"
  | "discount_max_per_client"
>;

export type SubPermission = "STOCK" | "DELIVERY";

export type MarketSub = {
  id: string;
  created_at: Date;
  name: string;
  permissions: SubPermission[];
};

export type CreateSubDto = Pick<MarketSub, "name" | "permissions">;
