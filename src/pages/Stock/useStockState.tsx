import { useState, useEffect } from "react";
import { errMsg } from "~/constants/errorMessages";
import { useStockEditContext } from "~/contexts/StockEditContext";
import useMyContext from "~/core/context";
import { transformProduct } from "~/functions/transform";
import { useLoading } from "~/hooks/useLoading";
import { api } from "~/services/api";
import { ProductMap } from ".";

export function useStockState() {
  const { socket, alert } = useMyContext();
  const { updateProduct } = useStockEditContext();
  const [hasError, setError] = useState(false);
  const [isLoading, , withLoading] = useLoading();
  const [products, setProducts] = useState<ProductMap>();
  const [queryProducts, setQueryProducts] = useState<ProductMap>();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!socket) return;

    try {
      socket.on("items", (...newProducts: unknown[]) => {
        newProducts.forEach((raw) => {
          const newProduct = transformProduct(raw);

          const createUpdated = (products: ProductMap) =>
            products.set(newProduct.key, {
              ...(products.get(newProduct.key) ?? {}),
              ...newProduct,
            });

          setProducts((v) => createUpdated(new Map(v)));
          setQueryProducts((v) =>
            v?.has(newProduct.key) ? createUpdated(new Map(v)) : v,
          );
          updateProduct(newProduct);
        });
      });
      socket.emit("items");
    } catch {
      return setError(true);
    }
  }, [socket, updateProduct]);

  const fetchQuery = withLoading(async () => {
    if (!query) {
      return setQueryProducts(undefined);
    }

    try {
      const products = await api.products.findMany(query);
      setQueryProducts(new Map(products.map((p) => [p.key, p])));
    } catch {
      alert(errMsg.server());
    }
  });

  return {
    hasError,
    isLoading,
    products,
    query,
    setQuery,
    queryProducts,
    fetchQuery,
  };
}
