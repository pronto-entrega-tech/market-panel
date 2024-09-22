import { lightFormat } from "date-fns";

export const formatDateTime = (d: string | Date) =>
  lightFormat(new Date(d), "dd/MM/yyyy - HH:mm");

export const formatTime = (d: string | Date) =>
  lightFormat(new Date(d), "HH:mm");

export const formatOrderId = (id: string) => `#${id.padStart(4, "0")}`;
