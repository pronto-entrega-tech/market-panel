import styled from 'styled-components';
import * as mui from '@mui/material';

export const Container = styled.div`
  height: -webkit-fill-available;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #fcfcfc;
`;

export const HeaderLine = styled(mui.Box).attrs({
  boxShadow: 3,
})`
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--background);
`;

export const Title = styled.div`
  margin-left: 8px;
`;

export const ConfirmAll = styled(mui.Button)`
  && {
    text-transform: none;
  }
`;
