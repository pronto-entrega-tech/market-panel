import { useEffect, useState } from "react";
import { FixedSizeList } from "react-window";
import useMyContext from "~/core/context";
import { ProductActivity } from "~/core/types";
import { api } from "~/services/api";
import MyErrors from "~/components/Errors";
import Loading from "~/components/Loading";
import { OrderList, HeaderLine, SearchBar } from "./styles";
import StockHistItem from "./StockHistItem";
import { useWindowSize } from "~/hooks/useWindowSize";
import { componentWidth } from "~/constants/componentWidths";
import { errMsg } from "~/constants/errorMessages";
import { useLoading } from "~/hooks/useLoading";

export const useStockHistState = () => {
  const { socket, alert } = useMyContext();
  const [hasError, setError] = useState(false);
  const [isLoading, , withLoading] = useLoading();
  const [activities, setActivities] = useState<ProductActivity[]>();
  const [queryActivities, setQueryActivities] = useState<ProductActivity[]>();
  const [query, setQuery] = useState("");

  useEffect(() => {
    api.products
      .findActivities()
      .then(setActivities)
      .catch(() => setError(true));
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("items-activities", (...newActivities: ProductActivity[]) => {
      setActivities((activities = []) => [...newActivities, ...activities]);
    });
  }, [socket]);

  const fetchQuery = withLoading(async () => {
    if (!query) return setQueryActivities(undefined);

    api.products
      .findActivities(query)
      .then(setQueryActivities)
      .catch(() => alert(errMsg.server()));
  });

  return {
    hasError,
    isLoading,
    activities,
    queryActivities,
    query,
    setQuery,
    fetchQuery,
  };
};

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
          onKeyPress={(e) => e.key === "Enter" && fetchQuery()}
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
          <div key={activities[index].item_id} style={style}>
            <StockHistItem activity={activities[index]} />
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
