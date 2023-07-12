import { ReactNode, useState, useCallback, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { createContext, useContextSelector } from 'use-context-selector';
import { notifyMsg } from '~/constants/notifyMessages';
import useMyContext from '~/core/context';
import { ChatMsg, CreateChatMsgDto, PendingChatMsg } from '~/core/types';
import { createUseContext } from '~/functions/createUseContext';
import { fail } from '~/functions/fail';
import { transformCreatedAt } from '~/functions/transform';
import { api } from '~/services/api';
import { withMutex } from '~/services/mutex';

type ChatMap = Map<string, ChatMsg>;

const useProviderValues = () => {
  const { socket, notify, dismissNotifies } = useMyContext();
  const [allOpenChats, setAllOpenChats] = useState<string[]>([]);
  const [newMsgs, setNewMsgs] = useState<ChatMsg[]>([]);
  const [allChats, setAllChats] = useState(new Map<string, ChatMap>());
  const [allPendingMsgs, setAllPendingMsgs] = useState(
    new Map<string, PendingChatMsg[]>(),
  );

  const updateChat = useCallback((customer_id: string, newMsgs: ChatMsg[]) => {
    setAllChats((allChats) => {
      const newChat = new Map(allChats.get(customer_id));

      newMsgs.forEach((newMsg) =>
        newChat.set(newMsg.id, transformCreatedAt(newMsg)),
      );

      return new Map(allChats).set(customer_id, newChat);
    });
  }, []);

  const deletePendingMsg = useCallback((newMsg: ChatMsg) => {
    const { customer_id, message } = newMsg;

    setAllPendingMsgs((allPendingMsgs) => {
      const oldPendingMsgs = allPendingMsgs.get(customer_id);

      const value = oldPendingMsgs?.find((v) => v.message === message);
      if (!value || !oldPendingMsgs) return allPendingMsgs;

      const newPendingMsgs = oldPendingMsgs.filter((v) => v !== value);

      return new Map(allPendingMsgs).set(customer_id, newPendingMsgs);
    });
  }, []);

  useEffect(() => {
    if (socket)
      socket.on('chatMsg', (newMsg: ChatMsg) => {
        setNewMsgs((old) => [...old, newMsg]);
      });
  }, [socket]);

  useEffect(() => {
    if (!newMsgs.length) return;

    newMsgs.forEach((newMsg: ChatMsg) => {
      const isChatOpen = allOpenChats.includes(newMsg.customer_id);

      if (newMsg.author === 'CUSTOMER' && !isChatOpen)
        notify(notifyMsg.msgReceded(newMsg.market_order_id), '', {
          customer_id: newMsg.customer_id,
        });

      updateChat(newMsg.customer_id, [newMsg]);
      deletePendingMsg(newMsg);
    });
    setNewMsgs([]);
  }, [newMsgs, allOpenChats, notify, updateChat, deletePendingMsg]);

  useEffect(() => {
    allOpenChats.forEach((customer_id) => {
      dismissNotifies((v) => v.customer_id === customer_id);
    });
  }, [allOpenChats, dismissNotifies]);

  const subscribeToChatMsgs = useCallback(
    (socket: Socket, order_id: string) => {
      (socket ?? fail('Missing socket')).emit('subscribeToChatMsgs', order_id);
    },
    [],
  );

  const getChat = useCallback(
    (customer_id: string) => {
      const chat = allChats.get(customer_id);

      if (!chat)
        withMutex(customer_id, () =>
          api.chats
            .getOldMsgs(customer_id)
            .then((msgs) => updateChat(customer_id, msgs)),
        );

      return chat;
    },
    [allChats, updateChat],
  );

  const setMsgError = useCallback(
    (customer_id: string, msg: CreateChatMsgDto, hasError = true) => {
      setAllPendingMsgs((allPendingMsgs) => {
        const newPendingMsgs = [...(allPendingMsgs.get(customer_id) ?? [])];

        const i = newPendingMsgs.indexOf(msg);

        newPendingMsgs[i] = { ...msg, hasError };

        return new Map(allPendingMsgs).set(customer_id, newPendingMsgs);
      });
    },
    [],
  );

  const addMsg = useCallback(
    ({
      customer_id,
      ...newMsg
    }: CreateChatMsgDto & { customer_id: string }) => {
      setAllPendingMsgs((allPendingMsgs) => {
        const oldPendingMsgs = allPendingMsgs.get(customer_id);

        const newPendingMsgs = [...(oldPendingMsgs ?? []), newMsg];

        return new Map(allPendingMsgs).set(customer_id, newPendingMsgs);
      });

      api.chats.create(newMsg).catch(() => setMsgError(customer_id, newMsg));
    },
    [setMsgError],
  );

  const retryAddMsg = useCallback(
    (customer_id: string, pendingMsg: PendingChatMsg) => {
      setMsgError(customer_id, pendingMsg, false);

      api.chats
        .create(pendingMsg)
        .catch(() => setMsgError(customer_id, pendingMsg));
    },
    [setMsgError],
  );

  const openChat = useCallback((customer_id: string) => {
    setAllOpenChats((old) => [...old, customer_id]);
  }, []);

  const closeChat = useCallback((customer_id: string) => {
    setAllOpenChats((old) => old.filter((v) => v !== customer_id));
  }, []);

  return {
    subscribeToChatMsgs,
    allOpenChats,
    openChat,
    closeChat,
    getChat,
    allPendingMsgs,
    addMsg,
    retryAddMsg,
  };
};

type ChatContextValues = ReturnType<typeof useProviderValues>;

const ChatContext = createContext({} as ChatContextValues);

const PublicContext = {
  ...({} as Omit<
    ChatContextValues,
    'getChat' | 'allPendingMsgs' | 'allOpenChats' | 'openChat' | 'closeChat'
  >),
}; // Just for the typing

export const useChatContext = createUseContext<typeof PublicContext>(
  ChatContext as any,
);

export const useOpenChatContext = (customer_id: string) => {
  const isOpen = useContextSelector(ChatContext, (v) =>
    v.allOpenChats.includes(customer_id),
  );
  const openChat = useContextSelector(ChatContext, (v) => v.openChat);
  const closeChat = useContextSelector(ChatContext, (v) => v.closeChat);

  return {
    isOpen,
    openChat: () => openChat(customer_id),
    closeChat: () => closeChat(customer_id),
  };
};

export const useChatItemContext = (customer_id: string) => {
  const chat = useContextSelector(ChatContext, (v) => v.getChat(customer_id));
  const pendingMsgs =
    useContextSelector(ChatContext, (v) => v.allPendingMsgs.get(customer_id)) ??
    [];

  return { chat, pendingMsgs };
};

export const ChatProvider = (props: { children: ReactNode }) => (
  <ChatContext.Provider value={useProviderValues()} {...props} />
);
