import styled from "styled-components";
import * as mui from "@mui/material";
import * as icons from "mdi-material-ui";
import { componentWidth } from "~/constants/componentWidths";
import { ZIndex } from "~/constants/zIndex";

export const Container = styled.div`
  height: -webkit-fill-available;
  width: -webkit-fill-available;
  display: flex;
`;

export const HeaderLine = styled.div`
  display: flex;
  padding: 12px;
`;

export const SearchBar = styled(mui.Input).attrs({
  fullWidth: true,
})``;

export const Receipt = styled(mui.IconButton)`
  width: 40px;
  height: 40px;
`;

export const ReceiptIcon = styled(icons.Receipt)`
  width: 24px;
  height: 24px;
`;

export const OrderList = styled(mui.Box).attrs({
  boxShadow: 3,
})`
  height: -webkit-fill-available;
  width: ${componentWidth.stockSelect}px;
  z-index: ${ZIndex.Zero};
`;
