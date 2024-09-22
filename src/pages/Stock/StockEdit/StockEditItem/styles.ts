import styled from "styled-components";
import * as mui from "@mui/material";

export const Container = styled.div`
  && {
    display: grid;
    grid-template-columns: 110px 110px 85px 40px auto;
    grid-template-rows: auto 32px 36px 38px 32px;
    padding: 12px 20px 8px 20px;
    border-bottom: 1px solid #eee;
    font-size: 15px;
    align-items: center;
  }
`;

export const Description = styled.div`
  grid-column: 1 / span 4;
  grid-row: 1;
  color: rgba(0, 0, 0, 0.76);
`;

export const UnitWeightLabel = styled.div`
  grid-column: 3;
  grid-row: 1;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.74);
`;

export const UnitWeightInput = styled(mui.TextField)`
  grid-column: 4;
  grid-row: 1;
  width: 70px;
`;

export const Code = styled.div`
  grid-column: 1;
  grid-row: 2;
  font-size: 14px;
`;

export const Price = styled.div`
  grid-column: 2;
  grid-row: 2;
  font-weight: 500;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.8);
`;

export const Quantity = styled.div`
  grid-column: 3 / span 2;
  grid-row: 2;
  font-weight: 500;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.8);
`;

export const PriceLabel = styled.div`
  grid-column: 1;
  grid-row: 3;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.74);
`;

export const PriceInput = styled(mui.TextField)`
  grid-column: 2;
  grid-row: 3;
  width: 100px;
`;

export const QuantityLabel = styled.div`
  grid-column: 3;
  grid-row: 3;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.74);
`;

export const QuantityInput = styled(mui.TextField)`
  grid-column: 4;
  grid-row: 3;
  width: 65px;
`;

export const DiscountTypeLabel = styled.div`
  grid-column: 1;
  grid-row: 4;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.74);
`;

export const DiscountTypeSelect = styled(mui.Select)`
  grid-column: 2;
  grid-row: 4;
  width: 100px;
`;

export const DiscountMaxLabel = styled.div`
  grid-column: 3;
  grid-row: 4;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.74);
`;

export const DiscountMaxInput = styled(mui.TextField)`
  grid-column: 4;
  grid-row: 4;
  width: 65px;
`;

export const Discount1Label = styled.div`
  grid-column: 1;
  grid-row: 5;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.74);
`;

export const Discount1Input = styled(mui.TextField)`
  grid-column: 2;
  grid-row: 5;
  width: 100px;
`;

export const Discount2Label = styled.div`
  grid-column: 3;
  grid-row: 5;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.74);
`;

export const Discount2Input = styled(mui.TextField)`
  grid-column: 4;
  grid-row: 5;
  width: 65px;
`;

export const ConfirmButton = styled(mui.IconButton)`
  grid-column: 5;
  grid-row: 1;
  justify-self: flex-end;
  bottom: 6px;
  width: 30px;
  height: 30px;
`;

export const DeleteButton = styled(mui.IconButton)`
  grid-column: 5;
  grid-row: 2;
  justify-self: flex-end;
  width: 30px;
  height: 30px;
`;
