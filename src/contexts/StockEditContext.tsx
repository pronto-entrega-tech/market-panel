import { useState, useCallback } from "react";
import { errMsg } from "~/constants/errorMessages";
import { useMyContext } from "~/core/context";
import { DiscountType, ProductType, SetProductDto } from "~/core/types";
import { createContext } from "~/contexts/createContext";
import { fail } from "~/functions/fail";
import { api } from "~/services/api";
import { pick } from "~/functions/pick";

type ProductNotStatefulProps =
  | "item_id"
  | "city_slug"
  | "code"
  | "isNew"
  | "key";

export type StockState = {
  product: ProductType;
  state: Omit<
    SetProductDto,
    ProductNotStatefulProps | "discount_value_1" | "discount_value_2"
  >;
  discountState: Record<
    DiscountType | "",
    { [x in "v1" | "v2"]: { placeholder: string; value: string } }
  >;
};

const createState = (product: ProductType): StockState => ({
  product,
  state: { price: "", stock: "" },
  discountState: {
    DISCOUNT_VALUE: {
      v1: { placeholder: "0", value: "" },
      v2: { placeholder: "", value: "" },
    },
    DISCOUNT_PERCENT: {
      v1: { placeholder: "0", value: "" },
      v2: { placeholder: "", value: "" },
    },
    DISCOUNT_PERCENT_ON_SECOND: {
      v1: { placeholder: "0", value: "" },
      v2: { placeholder: "2", value: "" },
    },
    ONE_FREE: {
      v1: { placeholder: "3", value: "" },
      v2: { placeholder: "1", value: "" },
    },
    [product.discount_type ?? ""]: {
      v1: { placeholder: product.discount_value_1, value: "" },
      v2: { placeholder: product.discount_value_2, value: "" },
    },
    [""]: {
      v1: { placeholder: "", value: "" },
      v2: { placeholder: "", value: "" },
    },
  },
});

const tryGetStateFrom = (states: Map<string, StockState>, key: string) =>
  states.get(key) ??
  fail(`Missing product key`, {
    key,
    keys: [...states.keys()],
  });

const createDto = (v: StockState): SetProductDto => {
  const discount = v.discountState[v.product.discount_type ?? ""];

  const isDifferentType = v.state.discount_type !== v.product.discount_type;
  const a = (v: string) => (v ? +v : isDifferentType ? null : undefined);

  return {
    ...pick(v.product, "item_id", "city_slug", "code"),
    ...v.state,
    discount_value_1: a(discount.v1.value),
    discount_value_2: a(discount.v2.value),
  };
};

const useStockEdit = () => {
  const { alert } = useMyContext();
  const [isLoading, setLoading] = useState(false);
  const [states, _setStates] = useState(new Map<string, StockState>());
  const [keys, setKeys] = useState<string[]>([]);

  const setStates = useCallback(
    (fn: (v: Map<string, StockState>) => Map<string, StockState>) => {
      _setStates((v) => {
        const newV = fn(v);

        setKeys((oldKeys) =>
          newV.size !== oldKeys.length ? [...newV.keys()] : oldKeys,
        );

        return newV;
      });
    },
    [],
  );

  const getState = useCallback(
    (key: string) => tryGetStateFrom(states, key),
    [states],
  );

  const selectStock = useCallback(
    (product: ProductType) => {
      setStates((s) => new Map(s).set(product.key, createState(product)));
    },
    [setStates],
  );

  const unselectStock = useCallback(
    (key: string) => setStates((s) => new Map(s).remove(key)),
    [setStates],
  );

  const updateStock = useCallback(
    (key: string, updateFn: (v: StockState) => StockState) =>
      setStates((s) => new Map(s).set(key, updateFn(tryGetStateFrom(s, key)))),
    [setStates],
  );

  const updateProduct = useCallback(
    (newProduct: ProductType) =>
      setStates((state) => {
        const newState = new Map(state);
        const p = newState.get(newProduct.key);
        if (!p) return newState;

        p.product = { ...p.product, ...newProduct };
        return newState;
      }),
    [setStates],
  );

  const confirm = useCallback(
    async (s: StockState) => {
      try {
        setLoading(true);
        const dto = createDto(s);

        if (s.product.isNew) {
          await api.products.create(dto);
        } else {
          await api.products.update(dto);
        }

        unselectStock(s.product.key);
      } catch {
        alert(errMsg.server());
      }
      setLoading(false);
    },
    [alert, unselectStock],
  );

  const confirmAll = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all(
        [...states.values()].map(async (v) => {
          const dto = createDto(v);

          if (v.product.isNew) {
            await api.products.create(dto);
          } else {
            await api.products.update(dto);
          }

          unselectStock(v.product.key);
        }),
      );
    } catch {
      alert(errMsg.server());
    }
    setLoading(false);
  }, [alert, states, unselectStock]);

  return {
    isLoading,
    keys,
    getState,
    selectStock,
    unselectStock,
    updateStock,
    updateProduct,
    confirm,
    confirmAll,
  };
};

export const [
  StockEditProvider,
  useStockEditContext,
  useStockEditContextSelector,
] = createContext(useStockEdit);

export const useStockEditItemContext = (key: string) => {
  const state = useStockEditContextSelector((v) => v.getState(key));
  const confirm = useStockEditContextSelector((v) => v.confirm);

  return {
    ...state,
    confirm: () => confirm(state),
  };
};
