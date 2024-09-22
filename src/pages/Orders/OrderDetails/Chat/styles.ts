import styled from "styled-components";
import * as mui from "@mui/material";

export const Background = styled.div`
  display: flex;
  justify-content: flex-end;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: -webkit-fill-available;
  width: -webkit-fill-available;
`;

export const Container = styled(mui.Box).attrs({
  boxShadow: 3,
})`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 450px;
  background: var(--background);
`;

export const HeaderContainer = styled(mui.Box).attrs({
  boxShadow: 3,
})`
  display: flex;
  align-items: center;
  padding: 12px;
  z-index: 1;
`;

export const Name = styled.div`
  padding-left: 16px;
  font-size: 18px;
`;

export const ChatListContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  flex: 1;
  padding: 8px 16px;
  gap: 4px;
  overflow: auto;
`;

export const InputContainer = styled(mui.Box).attrs({
  boxShadow: 3,
})`
  display: flex;
`;

export const Input = styled(mui.TextField).attrs({
  multiline: true,
  variant: "outlined",
})`
  flex: 1;
  margin: 8px;
`;

export const MsgRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  gap: 4px;
`;

export const MsgContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  border-radius: 14px;
  max-width: 75%;
  padding: 10px;

  &.pad {
    margin-top: 8px;
  }
  &.left {
    align-self: flex-start;
    border-bottom-left-radius: 0px;
    border-color: #eee;
    border-style: solid;
    border-width: 2px;
  }
  &.right {
    align-self: flex-end;
    border-bottom-right-radius: 0px;
    background-color: #eee;
  }
`;

export const MessageContainer = styled.div`
  /* padding-right: 50px; */
`;

export const Message = styled.span`
  font-size: 16px;
  color: var(--body);
`;

export const MessagePad = styled.span`
  display: inline-block;
  width: 40px;
`;

export const Time = styled.div`
  font-size: 11px;
  color: var(--body);
  margin-top: -10px;
  margin-right: 0px;
  margin-bottom: -5px;
`;

export const RetryButton = styled(mui.Button).attrs({
  variant: "text",
})``;
