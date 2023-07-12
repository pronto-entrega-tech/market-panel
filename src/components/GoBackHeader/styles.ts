import styled from 'styled-components';
import * as mui from '@mui/material';

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

export const Title = styled.div`
  font-size: large;
  text-align: center;
  flex-grow: 1;
  margin-right: 40px;
`;

export const GoBackButton = styled(mui.IconButton)``;
