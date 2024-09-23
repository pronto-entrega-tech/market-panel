import StockItem from "./StockItem";
import StockEdit from "./StockEdit";
import StockHist from "./StockHist";
import { useStockHistState } from "./StockHist/useStockHistState";
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
import MyErrors from "~/components/Errors";
import Loading from "~/components/Loading";
import { FixedSizeList } from "react-window";
import { useWindowSize } from "~/hooks/useWindowSize";
import { componentWidth } from "~/constants/componentWidths";
import { useStockEditContext } from "~/contexts/StockEditContext";
import { useStockState } from "./useStockState";

export type ProductMap = Map<string, ProductType>;

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
          const product = productsValues[index]!;
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
