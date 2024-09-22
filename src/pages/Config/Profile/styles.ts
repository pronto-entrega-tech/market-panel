import styled from "styled-components";
import * as mui from "@mui/material";
import * as icons from "mdi-material-ui";

export const Header = styled.div`
  display: flex;
  flex-direction: row;
`;

export const AvatarButton = styled(mui.ButtonBase)`
  border-radius: 100%;
`;

export const Avatar = styled(mui.Avatar)`
  height: 100px;
  width: 100px;
  &.fallback {
    background-color: var(--primary);
  }
`;

export const Picture = styled.img`
  /* position: absolute;
  align-self: center;
  justify-self: center; */
  height: 400px;
  width: 400px;
`;

export const CartIcon = styled(icons.Cart)`
  && {
    color: white;
    height: 55%;
    width: 55%;
  }
`;

export const ChangePictureButton = styled(mui.Fab).attrs({
  size: "medium",
})`
  position: absolute;
  margin-left: 64px;
  margin-top: 64px;
`;

export const SubHeader = styled.div`
  padding-top: 18px;
  padding-left: 32px;
`;

export const Name = styled.span`
  font-size: 24px;
`;

export const OpenLabel = styled.div`
  margin-top: 8px;
`;

export const Button = styled(mui.Button).attrs({
  variant: "text",
})`
  width: 500px;
  align-self: center;
  margin-top: 8px;
`;
