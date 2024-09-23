import { useCallback, useEffect, useState } from "react";
import { AlertState } from "~/components/MyAlert";
import { TopAlertType } from "~/components/TopAlert";
import { createContext } from "~/contexts/createContext";
import { api } from "~/services/api";
import { io, Socket } from "socket.io-client";
import { Url } from "~/constants/urls";
import { events } from "~/services/events";
import { AccessToken, innerSetAccessToken } from "./accessToken";
import { getTokenExp } from "~/functions/tokenExp";
import { Notif } from "~/components/Notification";

const useCommon = () => {
  const [statefulAccessToken, setStatefulAccessToken] = useState<AccessToken>();
  const [socket, setSocket] = useState<Socket>();
  const [alertState, setAlertState] = useState<AlertState>();
  const [notifies, setNotifies] = useState<Notif[]>([]);
  const [hasConnectionErr, setConnectionErr] = useState(false);
  const [hasSocketErr, setSocketErr] = useState(false);

  const isAuthed =
    statefulAccessToken === undefined ? undefined : !!statefulAccessToken;

  const setAccessToken = useCallback((newToken: AccessToken) => {
    innerSetAccessToken(newToken);
    setStatefulAccessToken(newToken);
  }, []);

  const topAlertType: TopAlertType | undefined = hasConnectionErr
    ? "connection"
    : hasSocketErr
      ? "socket"
      : undefined;

  useEffect(() => {
    window.addEventListener("online", () => setConnectionErr(false));
    window.addEventListener("offline", () => setConnectionErr(true));

    const clear1 = events.unauthorized.on(() => setAccessToken(null));
    const clear2 = events.accessTokenUpdated.on(setStatefulAccessToken);

    return () => {
      clear1();
      clear2();
    };
  }, [setAccessToken]);

  useEffect(() => {
    if (hasSocketErr) return;

    const revalidateToken = async () => {
      if (statefulAccessToken === null) return;

      try {
        const token = await api.auth.revalidate();
        setAccessToken(token);
      } catch {
        setAccessToken(null);
      }
    };

    if (!statefulAccessToken) {
      revalidateToken();
      return;
    }

    const tokenExp = getTokenExp(statefulAccessToken);
    const timeLeft = +tokenExp - Date.now();

    const revalidateTimeout = setTimeout(revalidateToken, timeLeft);
    return () => clearTimeout(revalidateTimeout);
  }, [hasSocketErr, statefulAccessToken, setAccessToken]);

  useEffect(() => {
    if (!isAuthed) return;

    const socket = io(Url.ApiWs, {
      transports: ["websocket"],
      auth: { token: statefulAccessToken },
    });
    socket.on("connect", () => setSocketErr(false));
    socket.on("connect_error", () => setSocketErr(true));
    setSocket(socket);

    return () => {
      setSocket(undefined);
      socket.close();
    };
  }, [isAuthed, statefulAccessToken]);

  const signOut = useCallback(async () => {
    await api.auth.signOut();
    setAccessToken(null);
  }, [setAccessToken]);

  const alert = useCallback(
    (
      title: string,
      subtitle?: string,
      opts?: Omit<AlertState, "title" | "subtitle">,
    ) => setAlertState({ title, subtitle, ...opts } as AlertState),
    [],
  );

  const dismissAlert = () => {
    setAlertState(undefined);
  };

  const notify = useCallback(
    (title: string, body?: string, metadata?: Notif["metadata"]) =>
      setNotifies((arr) => [...arr, { title, body, metadata }]),
    [],
  );

  const dismissNotifies = useCallback(
    (fn: (metadata: Notif["metadata"]) => boolean) =>
      setNotifies((arr) => arr.filter((v) => !fn(v.metadata))),
    [],
  );

  const removeNotify = useCallback(
    (index: number) => setNotifies((arr) => arr.filter((_, i) => i !== index)),
    [],
  );

  return {
    alert,
    dismissAlert,
    notify,
    dismissNotifies,
    removeNotify,
    alertState,
    notifies,
    topAlertType,
    isAuthed,
    setAccessToken,
    signOut,
    socket,
  };
};

export const [MyProvider, useMyContext] = createContext(useCommon);

export default useMyContext;
