import styled from "styled-components";
import * as mui from "@mui/material";

export const Container = styled.div`
  height: -webkit-fill-available;
  width: -webkit-fill-available;
  display: flex;
`;

export const OrdersContainer = styled(mui.Box).attrs({
  boxShadow: 3,
})`
  display: flex;
  flex-direction: column;
  height: -webkit-fill-available;
  width: 270px;
`;

export const SelectLine = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  gap: 12px;
`;

export const Select1 = styled(mui.Select)`
  width: 94px;
`;

export const Select2 = styled(mui.Select)`
  width: 140px;
`;

export const Header = styled.div`
  padding: 14px 16px 0px 16px;
`;
