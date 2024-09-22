import styled from "styled-components";
import * as mui from "@mui/material";
import * as icons from "mdi-material-ui";
import LoadingButton from "~/components/LoadingButton";

export const Container = styled.div`
  display: flex;
  height: -webkit-fill-available;
  width: -webkit-fill-available;
  display: grid;
  padding: 20px;
  grid-template-rows: 170px calc(100vh - calc(170px + 100px)) 100px;
  font-size: 14px;
`;

export const TextGrid = styled.div`
  width: -webkit-fill-available;
  grid-column: 1;
  grid-row: 1;
  display: grid;
  grid-template-columns: 30px auto 62px;
  grid-template-rows: 20px 26px 50px 20px 34px;
  align-items: end;
`;

export const InfoLine = styled.div`
  grid-column: 1 / span 2;
  grid-row: 1;
  display: flex;
  align-items: flex-end;
`;

export const ChatButton = styled(mui.Button).attrs({
  variant: "text",
})`
  && {
    text-transform: none;
    color: var(--primary);
    left: 12px;
    top: 10px;
  }
`;

export const Name = styled.div`
  grid-column: 1 / span 2;
  grid-row: 2;
  font-size: 18px;
`;

export const Status = styled.div`
  grid-column: 1 / span 3;
  grid-row: 1;
  justify-self: flex-end;
  font-family: "Roboto";
  font-weight: 500;
  color: white;
  padding: 4px 8px 4px 8px;
  border-radius: 16px;
  &.grey {
    background-color: lightgrey;
  }
  &.green {
    background-color: #83b75b;
  }
  &.yellow {
    background-color: #dec04c;
  }
  &.red {
    background-color: #e56745;
  }
  &.blue {
    background-color: var(--primary);
  }
`;

export const Time = styled.div`
  grid-column: 1 / span 3;
  grid-row: 2;
  justify-self: flex-end;
`;

export const AddressIcon = styled(icons.MapMarker).attrs({
  color: "primary",
})`
  grid-column: 1;
  grid-row: 3;
  margin-bottom: -2px;
`;

export const Address = styled.div`
  grid-column: 2;
  grid-row: 3;
  font-size: 16px;
`;

export const Complement = styled.div`
  grid-column: 2;
  grid-row: 4;
`;

export const CheckIcon = styled(icons.CheckCircle)`
  color: #4bb543;
  grid-column: 1;
  grid-row: 5;
  margin-bottom: -1.3px;
  && {
    height: 22px;
    width: 22px;
  }
`;

export const AlertIcon = styled(icons.AlertCircle)`
  color: #dec04c;
  grid-column: 1;
  grid-row: 5;
  margin-bottom: -1.3px;
  && {
    height: 22px;
    width: 22px;
  }
`;

export const Payment = styled.div`
  grid-column: 2;
  grid-row: 5;
  font-size: 16px;
`;

export const SubtotalLabel = styled.div`
  grid-column: 2;
  grid-row: 3;
  justify-self: flex-end;
  margin-right: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.86);
  margin-bottom: 6px;
`;

export const FeeLabel = styled.div`
  grid-column: 2;
  grid-row: 4;
  justify-self: flex-end;
  margin-right: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.86);
  margin-bottom: -2px;
`;

export const TotalLabel = styled.div`
  grid-column: 2;
  grid-row: 5;
  justify-self: flex-end;
  margin-right: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.86);
`;

export const Subtotal = styled.div`
  grid-column: 3;
  grid-row: 3;
  justify-self: flex-end;
  margin-bottom: 6px;
`;

export const DeliveryFee = styled.div`
  grid-column: 3;
  grid-row: 4;
  justify-self: flex-end;
  margin-bottom: -2px;
`;

export const Total = styled.div`
  grid-column: 3;
  grid-row: 5;
  justify-self: flex-end;
`;

export const OrderTableContainer = styled(mui.TableContainer)`
  && {
    grid-column: 1;
    grid-row: 2;
  }
`;

export const OrderButton = styled(LoadingButton)`
  && {
    grid-column: 1;
    grid-row: 3;
    padding: 10px 66px 10px 66px;
    bottom: 8px;
    min-width: 300px;
    font-size: 16px;
    justify-self: center;
    align-self: center;
  }
`;
