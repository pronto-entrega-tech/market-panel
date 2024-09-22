import { getStatusName, getStatusColor } from "~/functions/orderStatus";
import { OrderType } from "~/core/types";
import { Container, Id, Hour, Name, Status } from "./styles";
import { lightFormat } from "date-fns";
import { formatOrderId } from "~/functions/format";

const formatTime = (d: string) => lightFormat(new Date(d), "HH:mm");

function OrderItem({
  order,
  isSelected,
  onClick,
}: {
  order: OrderType;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <Container
      className={isSelected ? "selected" : "unselected"}
      onClick={onClick}
    >
      <Id>Pedido {formatOrderId(order.market_order_id)}</Id>
      <Status className={getStatusColor(order)}>{getStatusName(order)}</Status>
      <Name>{order.customer_name}</Name>
      <Hour>Feito ás {formatTime(order.created_at)}</Hour>
    </Container>
  );
}

export default OrderItem;
