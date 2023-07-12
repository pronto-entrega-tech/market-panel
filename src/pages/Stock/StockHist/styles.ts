import styled from 'styled-components';
import * as mui from '@mui/material';
import { componentWidth } from '~/constants/componentWidths';

export const OrderList = styled(mui.Box).attrs({
  boxShadow: 3,
})`
  height: -webkit-fill-available;
  width: ${componentWidth.stockHist}px;
`;

export const HeaderLine = styled.div`
  display: flex;
  padding: 12px;
`;

export const SearchBar = styled(mui.Input).attrs({
  fullWidth: true,
})``;
