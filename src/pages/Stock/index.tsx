import { useEffect, useState } from "react";
import StockItem from "./StockItem";
import StockEdit from "./StockEdit";
import StockHist, { useStockHistState } from "./StockHist";
import { ProductType } from "~/core/types";
import {
  Container,
  HeaderLine,
  SearchBar,
  Receipt,
  ReceiptIcon,
  OrderList,
} from "./styles";
import { local } from "~/services/local";
import { transformProduct } from "~/functions/transform";
import useMyContext from "~/core/context";
import MyErrors from "~/components/Errors";
import Loading from "~/components/Loading";
import { FixedSizeList } from "react-window";
import { useWindowSize } from "~/hooks/useWindowSize";
import { componentWidth } from "~/constants/componentWidths";
import { api } from "~/services/api";
import { errMsg } from "~/constants/errorMessages";
import { useStockEditContext } from "~/contexts/StockEditContext";
import { useLoading } from "~/hooks/useLoading";

type ProductMap = Map<string, ProductType>;

export const useStockState = () => {
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
      socket.on("items", (...newProducts: any[]) => {
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
};

const StockSelect = ({
  hasError,
  isLoading,
  products,
  query,
  setQuery,
  queryProducts,
  fetchQuery,
}: ReturnType<typeof useStockState>) => {
  const { height } = useWindowSize();
  const { keys, selectStock } = useStockEditContext();

  const receipt = async () => {
    const receipt = await local.getReceipt().catch(console.error);
    if (!receipt) return;

    console.log(receipt);
  };

  if (hasError) return <MyErrors type="server" />;
  if (!products || isLoading) return <Loading />;

  const productsValues = [...(queryProducts ?? products).values()];

  return (
    <>
      <HeaderLine>
        <SearchBar
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && fetchQuery()}
          placeholder="Busque por código ou descrição"
        />
        <Receipt onClick={receipt}>
          <ReceiptIcon />
        </Receipt>
      </HeaderLine>
      <FixedSizeList
        height={height - 64}
        width={componentWidth.stockSelect}
        itemCount={productsValues.length}
        itemSize={75}
      >
        {({ index, style }) => {
          const product = productsValues[index];
          return (
            <div key={product.key} style={style}>
              <StockItem
                product={product}
                disabled={keys.includes(product.key)}
                onAdd={() =>
                  !keys.includes(product.key) && selectStock(product)
                }
              />
            </div>
          );
        }}
      </FixedSizeList>
    </>
  );
};

const Stock = ({
  stockState,
  stockHistState,
}: {
  stockState: ReturnType<typeof useStockState>;
  stockHistState: ReturnType<typeof useStockHistState>;
}) => {
  return (
    <Container>
      <OrderList>
        <StockSelect {...stockState} />
      </OrderList>
      <StockEdit />
      <StockHist {...stockHistState} />
    </Container>
  );
};

export default Stock;
