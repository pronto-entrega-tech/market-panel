/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  OrderType,
  ProductType,
  ProfileType,
  OpenFlip,
  MarketSub,
} from "~/core/types";
import { cleanString } from "./cleanString";

export const filterUndefined = (o: UnknownRecord) => {
  Object.entries(o).forEach(([k, v]) => {
    if (v === undefined) delete o[k];
  });
  return o;
};

export const transformOrder = ({ customer, items, ...rest }: any) =>
  filterUndefined({
    ...rest,
    customer_name: customer?.name,
    items: items?.map(transformProduct),
  }) as OrderType;

export const transformProduct = ({ stock, product, ...rest }: any) =>
  filterUndefined({
    ...rest,
    key: rest.is_kit ? rest.item_id : `${product?.code}`,
    isNew: !rest.item_id,
    isCommodity: product ? !product.quantity : undefined,
    code: rest.code ?? product?.code,
    stock: stock === null ? "Ilimitada" : undefined,
    description:
      product &&
      cleanString(`${product.name} ${product.brand} ${product.quantity}`),
  }) as ProductType;

export const transformProfile = ({ open_flips, ...res }: any) =>
  ({
    ...res,
    open_flips: open_flips?.map(transformOpenFlip),
  }) as ProfileType;

export const transformOpenFlip = ({ created_at, ...res }: any) =>
  ({
    ...res,
    created_at: created_at && new Date(created_at),
  }) as OpenFlip;

export const transformMarketSub = ({ created_at, ...res }: any) =>
  ({
    ...res,
    created_at: created_at && new Date(created_at),
  }) as MarketSub;

export const transformCreatedAt = <T extends { created_at?: Date }>({
  created_at,
  ...res
}: T) =>
  ({
    ...res,
    created_at: created_at && new Date(created_at),
  }) as T;
