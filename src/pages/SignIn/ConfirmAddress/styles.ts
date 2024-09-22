import styled from "styled-components";
import * as mui from "@mui/material";

export const Container = styled.div`
  width: -webkit-fill-available;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Title = styled.div`
  margin-top: 34px;
  margin-bottom: 42px;
  font-size: large;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 330px;
`;

export const Input = styled(mui.TextField)`
  margin-top: 24px;
  width: 330px;
  &.half1 {
    width: 230px;
  }
  &.half2 {
    width: 80px;
  }
`;

export const ButtonsRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: fixed;
  bottom: 38px;
  width: 620px;
`;

export const Button = styled(mui.Button)`
  && {
    width: 300px;
  }
`;
