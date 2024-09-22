import { Buffer } from "buffer";
import { second, minute } from "~/constants/time";
import { fail } from "./fail";

/**
 * Token expiration minus one minute.
 */
export const getTokenExp = (token: string) => {
  const [, encodedPayload] = token.split(".");
  const payload = JSON.parse(
    Buffer.from(encodedPayload ?? fail(), "base64").toString(),
  );

  return new Date(payload.exp * second - 1 * minute);
};
