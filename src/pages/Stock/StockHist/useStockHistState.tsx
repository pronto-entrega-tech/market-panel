import { useState, useEffect } from "react";
import { errMsg } from "~/constants/errorMessages";
import useMyContext from "~/core/context";
import { ProductActivity } from "~/core/types";
import { useLoading } from "~/hooks/useLoading";
import { api } from "~/services/api";

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
