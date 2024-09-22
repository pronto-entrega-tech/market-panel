import { OrderAction } from "~/core/types";
import { transformOrder } from "~/functions/transform";
import utils from "./utils";

const { apiCall, authHeader } = utils;

export default {
  async findMany() {
    const { data } = await apiCall.get<[]>("/orders", await authHeader());
    return data.map(transformOrder);
  },

  async update(orderId: string, action: OrderAction) {
    await apiCall.patch(
      `/orders/market/${orderId}`,
      { action },
      await authHeader(),
    );
  },
};
