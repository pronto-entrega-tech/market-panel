import styled from "styled-components";
import * as mui from "@mui/material";
import { Logo } from "~/components/Logo";

export const Container = styled.div`
  height: -webkit-fill-available;
  width: -webkit-fill-available;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 70px;
  background-color: var(--background);
`;

export const LogoIcon = styled(Logo).attrs({ color: "primary" })`
  height: 110px;
  width: 110px;
`;

export const Title = styled.strong`
  margin-top: 16px;
  font-size: 26px;
  color: rgba(0, 0, 0, 0.72);
`;

export const Subtitle = styled.div`
  margin-top: 10px;
  color: rgba(0, 0, 0, 0.7);
`;

export const Input = styled(mui.Input)`
  margin-top: 56px;
  width: 300px;
`;

export const Button = styled(mui.Button)`
  && {
    margin-top: 38px;
    width: 300px;
  }
`;
