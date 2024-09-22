import { useState, useEffect } from "react";
import OrderItem from "./OrderItem";
import OrderDetails from "~/pages/Orders/OrderDetails";
import {
  Container,
  OrdersContainer,
  Header,
  SelectLine,
  Select1,
  Select2,
} from "./styles";
import { MenuItem } from "@mui/material";
import useMyContext from "~/core/context";
import Loading from "~/components/Loading";
import MyErrors from "~/components/Errors";
import { OrderStatus, OrderType, OrderUpdate } from "~/core/types";
import { Central } from "~/components/Central/styles";
import { transformOrder } from "~/functions/transform";
import { notifyMsg } from "~/constants/notifyMessages";
import { useChatContext } from "~/contexts/ChatContext";

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

const Orders = (ordersState: ReturnType<typeof useOrdersState>) => {
  const { orders, selectedId, orderBy, setOrderBy, filter, setFilter } =
    ordersState;

  return (
    <Container>
      <OrdersContainer>
        <Header>
          <SelectLine>
            <Select1
              value={orderBy}
              onChange={(e) => setOrderBy(e.target.value as any)}
            >
              <MenuItem value="new">Recentes</MenuItem>
              <MenuItem value="old">Antigos</MenuItem>
            </Select1>
            <Select2
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="APPROVAL_PENDING">Pendentes</MenuItem>
              <MenuItem value="PROCESSING">Em preparo</MenuItem>
              <MenuItem value="DELIVERY_PENDING">Saiu para entrega</MenuItem>
              {/* <MenuItem value='LATE'>Atrasados</MenuItem> */}
            </Select2>
          </SelectLine>
        </Header>
        <OrdersList {...ordersState} />
      </OrdersContainer>
      <OrderDetails order={orders?.get(selectedId ?? "")} />
    </Container>
  );
};

const OrdersList = ({
  hasError,
  orders,
  selectedId,
  setSelectedId,
  orderBy,
  filter,
}: ReturnType<typeof useOrdersState>) => {
  if (hasError) return <MyErrors type="server" />;
  if (!orders) return <Loading />;

  const ordersValues = (() => {
    const o = [...orders.values()];
    if (filter !== "all") o.pick((o) => o.status === filter);
    if (orderBy === "old") o.reverse();
    return o;
  })();

  if (!ordersValues.length)
    return <Central>Nenhum pedido disponível ainda</Central>;

  return (
    <>
      {ordersValues.map((order) => (
        <OrderItem
          key={order.order_id}
          order={order}
          onClick={() => setSelectedId(order.order_id)}
          isSelected={selectedId === order.order_id}
        />
      ))}
    </>
  );
};

export default Orders;
