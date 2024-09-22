import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  Container,
  TextGrid,
  InfoLine,
  ChatButton,
  Name,
  Status,
  Time,
  AddressIcon,
  Address,
  Complement,
  CheckIcon,
  AlertIcon,
  Payment,
  SubtotalLabel,
  FeeLabel,
  TotalLabel,
  Subtotal,
  DeliveryFee,
  Total,
  OrderTableContainer,
  OrderButton,
} from "./styles";
import Chat from "./Chat";
import { OrderType } from "~/core/types";
import { moneyString } from "~/functions/money";
import { getStatusName, getStatusColor } from "~/functions/orderStatus";
import { api } from "~/services/api";
import { Central } from "~/components/Central/styles";
import { useLoading } from "~/hooks/useLoading";
import { formatTime, formatOrderId } from "~/functions/format";
import { useOpenChatContext } from "~/contexts/ChatContext";

const getOrderInfo = (o: OrderType) => {
  const id = formatOrderId(o.market_order_id);
  const createdAt = formatTime(o.created_at);

  return `Pedido ${id} • Feito ás ${createdAt}`;
};

const formatDeliveryTime = (o: OrderType) => {
  const min = formatTime(o.delivery_min_time);
  const max = formatTime(o.delivery_max_time);

  return `${min} - ${max}`;
};

const formatAddress = (o: OrderType) =>
  `${o.address_street}, ${o.address_number} - ${o.address_district}`;

const formatPayment = (o: OrderType) => {
  const onAppOrDelivery = o.paid_in_app
    ? "Pago no App"
    : "Pagamento na Entrega";

  const change = o.payment_change ? ` (Troco para R$${o.payment_change})` : "";

  return `${onAppOrDelivery} - ${o.payment_description}${change}`;
};

const OpenChatButton = (p: { order: OrderType }) => {
  const { openChat } = useOpenChatContext(p.order.customer_id);

  return <ChatButton onClick={openChat}>Entrar em contato</ChatButton>;
};

function OrderDetails({ order }: { order?: OrderType }) {
  const [isLoading, , withLoading] = useLoading();

  if (!order) return <Central>Nenhum pedido selecionado ainda</Central>;

  const [buttonTitle, nextAction] =
    {
      APPROVAL_PENDING: ["Confirmar", "APPROVE"],
      PROCESSING: ["Sair para entrega", "DELIVERY"],
    }[order.status] ?? [];

  const action = withLoading(async () => {
    await api.orders.update(order.order_id, nextAction);
  });

  return (
    <Container>
      <TextGrid>
        <InfoLine>
          {getOrderInfo(order)}
          <OpenChatButton order={order} />
          <Chat order={order} />
        </InfoLine>
        <Name>{order.customer_name}</Name>
        <Status className={getStatusColor(order)}>
          {getStatusName(order)}
        </Status>
        <Time>Previsão {formatDeliveryTime(order)}</Time>
        <AddressIcon />
        <Address>{formatAddress(order)}</Address>
        <Complement>{order.address_complement || "Sem complemento"}</Complement>
        {order.paid_in_app ? <CheckIcon /> : <AlertIcon />}
        <Payment>{formatPayment(order)}</Payment>
        <SubtotalLabel>Subtotal</SubtotalLabel>
        <FeeLabel>Taxa de entrega</FeeLabel>
        <TotalLabel>Total</TotalLabel>
        <Subtotal>{moneyString(+order.total - +order.delivery_fee)}</Subtotal>
        <DeliveryFee>{moneyString(order.delivery_fee)}</DeliveryFee>
        <Total>{moneyString(order.total)}</Total>
      </TextGrid>
      <OrderTableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell width="68px">Código</TableCell>
              <TableCell width="68px" align="right">
                Preço
              </TableCell>
              <TableCell width="26px" align="right">
                Qtd.
              </TableCell>
              <TableCell>Descrição</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.items.map(({ code, price, quantity, description }) => (
              <TableRow key={code}>
                <TableCell>{code}</TableCell>
                <TableCell align="right">{moneyString(price)}</TableCell>
                <TableCell align="right">{quantity}x</TableCell>
                <TableCell>{description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </OrderTableContainer>
      {buttonTitle && (
        <OrderButton onClick={action} loading={isLoading}>
          {buttonTitle}
        </OrderButton>
      )}
    </Container>
  );
}

export default OrderDetails;
