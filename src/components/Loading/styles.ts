import styled from 'styled-components';
import { CircularProgress } from '@mui/material';

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Progress = styled(CircularProgress)``;

export { Container, Progress };
