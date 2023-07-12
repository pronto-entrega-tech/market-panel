import { Avatar, ClickAwayListener, Slide } from '@mui/material';
import {
  AlertCircle as ErrorIcon,
  Upload as UploadIcon,
  ClockTimeThreeOutline as ClockIcon,
} from 'mdi-material-ui';
import { useState, forwardRef } from 'react';
import {
  Background,
  Container,
  HeaderContainer,
  Name,
  ChatListContainer,
  InputContainer,
  Input,
  MsgRow,
  MsgContainer,
  MessageContainer,
  Message,
  MessagePad,
  Time,
  RetryButton,
} from './styles';
import Loading from '~/components/Loading';
import {
  useChatContext,
  useOpenChatContext,
  useChatItemContext,
} from '~/contexts/ChatContext';
import { OrderType, ChatMsg, PendingChatMsg } from '~/core/types';
import { formatTime } from '~/functions/format';
import { pick } from '~/functions/pick';

const Chat = (p: { order: OrderType }) => {
  const { isOpen, closeChat } = useOpenChatContext(p.order.customer_id);

  return (
    <Slide direction='left' in={isOpen} mountOnEnter unmountOnExit>
      <Background>
        <ClickAwayListener onClickAway={closeChat}>
          <ChatBody {...p.order} />
        </ClickAwayListener>
      </Background>
    </Slide>
  );
};

// `ClickAwayListener` need a component with ref
//
// eslint-disable-next-line react/display-name
const ChatBody = forwardRef((order: OrderType, ref) => {
  const { addMsg } = useChatContext();

  const [input, setInput] = useState('');

  const sendMsg = () => {
    addMsg({
      ...pick(order, 'customer_id', 'market_id', 'order_id'),
      message: input,
    });
    setInput('');
  };

  return (
    <Container ref={ref}>
      <HeaderContainer>
        <Avatar />
        <Name>{order.customer_name}</Name>
      </HeaderContainer>
      <ChatMsgsList {...order} />
      <InputContainer>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              sendMsg();
            }
          }}
          placeholder='Digite uma mensagem'
        />
      </InputContainer>
    </Container>
  );
});

const ChatMsgsList = ({ customer_id }: OrderType) => {
  const { retryAddMsg } = useChatContext();
  const { chat, pendingMsgs } = useChatItemContext(customer_id);

  if (!chat) return <Loading />;

  const retrySendMsg = (msg: PendingChatMsg) => {
    retryAddMsg(customer_id, msg);
  };

  return (
    <ChatListContainer>
      {[...chat.values()].reverse().map((chatMsg, i, chat) => (
        <ChatMsgItem key={chatMsg.id} chatMsg={chatMsg} index={i} chat={chat} />
      ))}
      {pendingMsgs.map((pendingMsg, i) => (
        <PendingMsgItem
          key={i}
          pendingMsg={pendingMsg}
          onRetry={() => retrySendMsg(pendingMsg)}
        />
      ))}
    </ChatListContainer>
  );
};

const ChatMsgItem = ({
  chatMsg,
  index,
  chat,
}: {
  chatMsg: ChatMsg;
  index: number;
  chat: ChatMsg[];
}) => {
  const direction = chatMsg.author === 'CUSTOMER' ? 'left' : 'right';
  const pad = chat[index - 1]?.author !== chatMsg.author ? 'pad' : '';

  return (
    <MsgContainer className={`${direction} ${pad}`}>
      <MessageContainer>
        <Message>{chatMsg.message}</Message>
        <MessagePad />
      </MessageContainer>
      <Time>{formatTime(chatMsg.created_at)}</Time>
    </MsgContainer>
  );
};

const PendingMsgItem = ({
  pendingMsg,
  onRetry: retrySendMsg,
}: {
  pendingMsg: PendingChatMsg;
  onRetry: () => void;
}) => {
  return (
    <MsgRow>
      {pendingMsg.hasError ? (
        <RetryButton onClick={retrySendMsg}>
          <UploadIcon />
          Retentar
        </RetryButton>
      ) : null}
      <MsgContainer className='right'>
        <MessageContainer>
          <Message>{pendingMsg.message}</Message>
          <MessagePad />
        </MessageContainer>
        <Time>
          {pendingMsg.hasError ? (
            <ErrorIcon color='error' fontSize='small' />
          ) : (
            <ClockIcon sx={{ fontSize: 16 }} />
          )}
        </Time>
      </MsgContainer>
    </MsgRow>
  );
}; /* <CircularProgress size={14} /> */

export default Chat;
