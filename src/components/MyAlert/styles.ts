import styled from 'styled-components';
import * as mui from '@mui/material';

export const Title = styled(mui.DialogTitle)`
  text-align: 'center';
  font-size: 20;
`;

export const DialogContent = styled(mui.DialogContent)`
  min-width: 250px;
`;

export const Input = styled(mui.TextField)`
  margin-top: 16px;
  width: 300px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 22px;
`;

export const Button = styled(mui.Button)`
  flex: 1;
  &&.cancel {
    margin-right: 12px;
  }
`;
