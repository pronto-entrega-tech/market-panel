import { local } from "../local";
import { withCache } from "../cache";
import utils from "./utils";

const { apiCall } = utils;

const role = "MARKET";

export default {
  email: async (email: string) => {
    const { data } = await apiCall.post<{
      key: string;
    }>("/auth/email", { role, email });

    return data;
  },

  validate: async (key: string, otp: string) => {
    const { data } = await apiCall.post<{
      type: "CREATE" | "CONNECT" | "ACCESS";
      token: string;
      session?: {
        refresh_token: string;
        expires_in: Date;
      };
    }>("/auth/validate", {
      role,
      key,
      otp,
    });

    const { refresh_token } = data.session ?? {};
    if (refresh_token) {
      await local.setPassword("token", refresh_token);
    }

    return data;
  },

  revalidate: async () => {
    const refreshToken = await local.getPassword("token");
    if (!refreshToken) throw new Error("Missing refresh token");

    const { data } = await withCache(refreshToken, async () => {
      return apiCall.post<{
        access_token: string;
        refresh_token: string;
        expires_in: Date;
      }>("/auth/revalidate", { role }, { params: { refreshToken } });
    });

    await local.setPassword("token", data.refresh_token);
    return data.access_token;
  },

  signOut: async () => {
    const currentToken = await local.getPassword("token");
    if (!currentToken) throw new Error("Missing refresh token");

    await apiCall.post(
      "/auth/sign-out",
      { role },
      { params: { refreshToken: currentToken } },
    );
  },
};
