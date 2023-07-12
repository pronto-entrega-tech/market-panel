import styled from 'styled-components';
import * as mui from '@mui/material';

export const Container = styled.div`
  height: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* padding: 8px; */
  text-align: center;
`;

export const Title = styled.p`
  font-size: large;
`;

export const SubTitle = styled.p`
  color: var(--body);
`;

export const TryAgainButton = styled(mui.Button)``;
