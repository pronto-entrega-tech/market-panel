import styled from "styled-components";
import * as mui from "@mui/material";

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.p`
  margin-left: 12px;
  font-size: 18px;
`;

export const Button = styled(mui.Button).attrs({
  variant: "text",
})`
  width: 500px;
  align-self: center;
  margin-top: 8px;
`;

export const Dialog = styled(mui.Dialog)``;

export const DialogContainer = styled.div`
  min-width: 200px;
  padding: 0px 24px 24px 24px;
  display: flex;
  flex-direction: column;
  align-content: center;
`;

export const DialogTitle = styled(mui.DialogTitle)`
  && {
    text-align: center;
  }
`;

export const DialogButton = styled(mui.Button)`
  margin-top: 8px;
`;
