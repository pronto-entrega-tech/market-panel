import { MarketSub, CreateSubDto } from "~/core/types";
import { transformMarketSub } from "~/functions/transform";
import utils from "./utils";

const { apiCall, authHeader } = utils;

export default {
  async create(dto: CreateSubDto) {
    const { data } = await apiCall.post<MarketSub>(
      "/markets/sub",
      dto,
      await authHeader(),
    );
    return transformMarketSub(data);
  },

  async findMany() {
    const { data } = await apiCall.get<MarketSub[]>(
      "/markets/sub",
      await authHeader(),
    );
    return data.map(transformMarketSub);
  },

  async connectToken(id: string) {
    const { data } = await apiCall.post<{ connect_token: string }>(
      `/markets/sub/${id}/connect-token`,
      null,
      await authHeader(),
    );
    return data;
  },

  async update(id: string, dto: Partial<CreateSubDto>) {
    const { data } = await apiCall.patch<MarketSub>(
      `/markets/sub/${id}`,
      dto,
      await authHeader(),
    );
    return transformMarketSub(data);
  },

  async delete(id: string) {
    await apiCall.delete(`/markets/sub/${id}`, await authHeader());
  },
};
