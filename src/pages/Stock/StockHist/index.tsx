import { FixedSizeList } from "react-window";
import MyErrors from "~/components/Errors";
import Loading from "~/components/Loading";
import { OrderList, HeaderLine, SearchBar } from "./styles";
import StockHistItem from "./StockHistItem";
import { useWindowSize } from "~/hooks/useWindowSize";
import { componentWidth } from "~/constants/componentWidths";
import { useStockHistState } from "./useStockHistState";

const StockHistBody = ({
  hasError,
  isLoading,
  query,
  setQuery,
  fetchQuery,
  ...p
}: ReturnType<typeof useStockHistState>) => {
  const { height } = useWindowSize();

  const activities = p.queryActivities ?? p.activities;

  if (hasError) return <MyErrors type="server" />;
  if (!activities || isLoading) return <Loading />;

  return (
    <>
      <HeaderLine>
        <SearchBar
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchQuery()}
          placeholder="Busque por código ou descrição"
        />
      </HeaderLine>
      <FixedSizeList
        height={height - 56}
        width={componentWidth.stockHist}
        itemCount={activities.length}
        itemSize={80}
      >
        {({ index, style }) => (
          <div key={activities[index]!.item_id} style={style}>
            <StockHistItem activity={activities[index]!} />
          </div>
        )}
      </FixedSizeList>
    </>
  );
};

const StockHist = (...[p]: Parameters<typeof StockHistBody>) => (
  <OrderList>
    <StockHistBody {...p} />
  </OrderList>
);

export default StockHist;
