import { CreateMarketDto, ProfileType, OpenFlip } from "~/core/types";
import { transformProfile, transformOpenFlip } from "~/functions/transform";
import { Address } from "~/pages/SignIn/ConfirmAddress";
import { local } from "../local";
import utils from "./utils";

const { apiCall, authHeader } = utils;

export default {
  async address(document: string) {
    const { data } = await apiCall.get<{
      street: string;
      number: string;
      district: string;
      city: string;
      state: string;
      lat: number;
      lng: number;
    }>(`/location/address/from-document/${document}`);

    return {
      address_street: data.street,
      address_number: data.number,
      address_district: data.district,
      address_city: data.city,
      address_state: data.state,
    } as Address;
  },

  async create(create_token: string, dto: CreateMarketDto) {
    const { data } = await apiCall.post<{
      token: string;
      refresh_token: string;
    }>("/markets", dto, {
      headers: { create_token },
    });

    const { refresh_token } = data;
    if (refresh_token) await local.setPassword("token", refresh_token);

    return data;
  },

  async find() {
    const { data } = await apiCall.get<ProfileType>(
      "/markets",
      await authHeader(),
    );

    return transformProfile(data);
  },

  async update(dto: unknown) {
    await apiCall.patch<ProfileType>("/markets", dto, await authHeader());
  },

  async uploadPicture(picture: File) {
    const formData = new FormData();
    formData.append("picture", picture);

    return apiCall.post("/markets/upload-picture", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...(await authHeader()).headers,
      },
    });
  },

  openFlip: {
    async create(dto: Pick<OpenFlip, "type">) {
      const { data } = await apiCall.post<OpenFlip>(
        "/markets/open-flip",
        dto,
        await authHeader(),
      );
      return transformOpenFlip(data);
    },

    async delete(date: OpenFlip["created_at"]) {
      await apiCall.delete(`/markets/open-flip/${+date}`, await authHeader());
    },
  },
};
