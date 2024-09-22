import { isPast } from "date-fns";
import { OrderType } from "~/core/types";

export const getStatusName = (order: OrderType) =>
  isOrderLate(order)
    ? "Atrasado"
    : ({
        APPROVAL_PENDING: "Pendente",
        PROCESSING: "Em preparo",
        DELIVERY_PENDING: "Saiu",
        COMPLETING: "Concluindo",
        COMPLETED: "Concluído",
        CANCELING: "Cancelando",
        CANCELED: "Cancelado",
      }[order.status] ?? "");

export const getStatusColor = (order: OrderType) =>
  isOrderLate(order)
    ? "red"
    : ({
        APPROVAL_PENDING: "green",
        PROCESSING: "yellow",
        DELIVERY_PENDING: "blue",
        COMPLETING: "grey",
        COMPLETED: "grey",
        CANCELING: "grey",
        CANCELED: "grey",
      }[order.status] ?? "");

export const isOrderLate = (order: OrderType) =>
  isPast(new Date(order.delivery_max_time));
