import styled from 'styled-components';
import * as mui from '@mui/material';

export const Container = styled.div`
  width: -webkit-fill-available;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0 48px 0;
`;

export const Div = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  width: 330px;
`;

export const ColumnsContainer = styled.div`
  display: flex;
  width: 100%;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
`;

export const Title = styled.div`
  margin-top: 34px;
  font-size: large;
`;

export const Description = styled.div`
  font-size: small;
  width: 240px;
`;

export const Input = styled(mui.TextField)`
  margin-top: 24px;
  width: 330px;
  &.half {
    width: 160px;
  }
  &.half1 {
    width: 80px;
  }
  &.half2 {
    width: 220px;
  }
`;

export const PaymentsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 6px;
  align-items: center;
  justify-content: center;
  max-width: 550px;
  margin-top: 18px;
  &.pad {
    margin-top: 28px;
  }
`;

export const AddPaymentsText = styled.div`
  margin-right: 8px;
`;

export const PaymentChip = styled(mui.Chip)`
  align-self: center;
  justify-self: center;
  animation-duration: 400ms;
  animation-name: animate-fade;
  animation-fill-mode: backwards;
`;

export const HoursContainer = styled.div`
  transition: 150ms;
`;

export const HoursItemContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
  height: 48.5px;
  animation-duration: 200ms;
  animation-delay: 100ms;
  animation-name: animate-fade;
  animation-fill-mode: backwards;
`;

export const TimeField = styled(mui.TextField)`
  && {
    margin: 0 16px 0 16px;
    /* width: 300px; */
  }
`;

export const RemoveHoursButton = styled(mui.Button)`
  && {
    margin-right: 16px;
    /* width: 300px; */
  }
`;

export const FormControl = styled(mui.FormControl)`
  margin-top: 16px;
  width: 100px;
`;

export const Button = styled(mui.Button)`
  && {
    margin-top: 28px;
    width: 300px;
  }
`;

export const CreateButton = styled(mui.Button)`
  && {
    position: fixed;
    bottom: 38px;
    width: 600px;
  }
`;

export const ErrorText = styled.p`
  color: var(--error);
`;
