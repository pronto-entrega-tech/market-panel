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
import Loading from "~/components/Loading";
import MyErrors from "~/components/Errors";
import { OrderStatus } from "~/core/types";
import { Central } from "~/components/Central/styles";
import { useOrdersState } from "./useOrdersState";

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
              onChange={(e) => setOrderBy(e.target.value as "new" | "old")}
            >
              <MenuItem value="new">Recentes</MenuItem>
              <MenuItem value="old">Antigos</MenuItem>
            </Select1>
            <Select2
              value={filter}
              onChange={(e) => setFilter(e.target.value as OrderStatus | "all")}
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
