import styled from 'styled-components';
import * as mui from '@mui/material';

export const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const Card = styled(mui.Card)`
  position: relative;
`;

export const CardActionArea = styled(mui.CardActionArea)`
  align-items: flex-start;
  padding: 16px;
  gap: 8px;
  font-size: 15px;
`;

export const Title = styled.div`
  font-size: 16px;
`;

export const Subtitle = styled.span`
  color: var(--subtitle);
`;

export const Body = styled.div`
  margin-top: 8px;
  color: var(--body);
`;

export const Input = styled(mui.TextField)``;

export const CardButtons = styled.div`
  position: absolute;
  right: 0;
  margin-top: -60px;
  z-index: 2;
`;

export const IconButton = styled(mui.IconButton)``;

export const SelectButton = styled(mui.Button).attrs({
  variant: 'outlined',
})`
  &.unselected {
    color: var(--unselected);
    border-color: var(--unselected);
  }
`;

export const CreateButton = styled(mui.Button)`
  margin-top: 14px;
`;

export const Stack = styled(mui.Stack)`
  margin-top: 18px;
  gap: 14px;
`;

export const QRCodeContainer = styled.div`
  height: 256px;
  width: 256px;
`;
