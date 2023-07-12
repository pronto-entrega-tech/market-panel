import { isPast } from 'date-fns';
import { getTokenExp } from '~/functions/tokenExp';
import { api } from '~/services/api';

export type AccessToken = string | null | undefined;

let accessTokenValue: AccessToken;
let accessTokenExp: Date | undefined;

/**
 * To be used by auth context.
 */
export const innerSetAccessToken = (newToken: AccessToken) => {
  accessTokenValue = newToken;
  accessTokenExp = newToken ? getTokenExp(newToken) : undefined;
};

export const getAccessToken = async () => {
  if (!accessTokenExp || isPast(accessTokenExp)) await revalidate();

  return accessTokenValue;
};

const revalidate = async () => {
  const newToken = await api.auth.revalidate();
  innerSetAccessToken(newToken);
};
