import styled from 'styled-components';
import * as mui from '@mui/material';

export const Container = styled.div`
  height: -webkit-fill-available;
  width: -webkit-fill-available;
  display: flex;
`;

export const SideBar = styled(mui.Box).attrs({
  boxShadow: 3,
})`
  height: -webkit-fill-available;
  width: 180px;
  display: flex;
  flex-direction: column;
  padding: 16px;
`;

export const Main = styled.div`
  height: -webkit-fill-available;
  width: -webkit-fill-available;
  display: flex;
  flex-direction: column;
  padding: 24px;
  overflow: auto;
`;

export const ConfigButton = styled(mui.Button).attrs({
  variant: 'text',
})`
  && {
    transition: 300ms;
    &.unselected {
      color: rgba(0, 0, 0, 0.5);
    }
  }
`;
