import { useState, useEffect } from "react";
import { notifyMsg } from "~/constants/notifyMessages";
import { useChatContext } from "~/contexts/ChatContext";
import useMyContext from "~/core/context";
import { OrderStatus, OrderUpdate, OrderType } from "~/core/types";
import { transformOrder } from "~/functions/transform";

type OrderMap = Map<string, OrderType>;

const completedStatuses = ["COMPLETING", "COMPLETED"];
const finishedStatuses = ["CANCELING", "CANCELED", ...completedStatuses];

export const useOrdersState = () => {
  const { socket, notify } = useMyContext();
  const { subscribeToChatMsgs } = useChatContext();
  const [hasError, setError] = useState(false);
  const [orders, setOrders] = useState<OrderMap>();
  const [selectedId, setSelectedId] = useState<string>();
  const [orderBy, setOrderBy] = useState<"new" | "old">("new");
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");

  useEffect(() => {
    if (!socket) return;

    try {
      socket.on("orders", (...newOrders: OrderUpdate[]) => {
        if (!newOrders.length) return setOrders((v) => v ?? new Map());

        newOrders.forEach((newOrder) => {
          setOrders((oldOrders) => {
            const orders = new Map(oldOrders);

            if (finishedStatuses.includes(newOrder.status ?? "")) {
              const id = orders.get(newOrder.order_id)?.market_order_id;
              if (id) {
                const msg = completedStatuses.includes(newOrder.status ?? "")
                  ? notifyMsg.orderCompleted(id)
                  : notifyMsg.orderCanceled(id);

                notify(msg);

                orders.delete(newOrder.order_id);
              }
            } else {
              orders.set(newOrder.order_id, {
                ...(orders.get(newOrder.order_id) ?? {}),
                ...transformOrder(newOrder),
              });
            }
            return orders;
          });
          subscribeToChatMsgs(socket, newOrder.order_id);
        });
      });
      socket.emit("active-orders");
    } catch {
      return setError(true);
    }
  }, [socket, notify, subscribeToChatMsgs]);

  return {
    hasError,
    orders,
    selectedId,
    setSelectedId,
    orderBy,
    setOrderBy,
    filter,
    setFilter,
  };
};
