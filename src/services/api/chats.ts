import { ChatMsg, CreateChatMsgDto } from "~/core/types";
import { transformCreatedAt } from "~/functions/transform";
import utils from "./utils";

const { apiCall, authHeader } = utils;

export default {
  async create(dto: CreateChatMsgDto) {
    const { data } = await apiCall.post<ChatMsg>(
      "/chats",
      dto,
      await authHeader(),
    );
    return transformCreatedAt(data);
  },

  async getOldMsgs(customer_id: string) {
    const { data } = await apiCall.get<ChatMsg[]>(
      `/chats/${customer_id}`,
      await authHeader(),
    );
    return data.map(transformCreatedAt);
  },
};
