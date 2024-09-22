import styled from "styled-components";
import * as mui from "@mui/material";

export const Container = styled.div`
  && {
    display: grid;
    grid-template-columns: 46px 130px 90px;
    grid-template-rows: 24px auto;
    padding: 10px 18px 10px 18px;
    border-bottom: 1px solid #eee;
    font-size: 13px;
  }
`;

export const Code = styled.div`
  grid-column: 1;
  grid-row: 1;
`;

export const Price = styled.div`
  grid-column: 2;
  grid-row: 1;
  justify-self: flex-end;
`;

export const Quantity = styled.div`
  grid-column: 3;
  grid-row: 1;
  justify-self: flex-end;
`;

export const Description = styled.div`
  grid-column: 1 / span 2;
  grid-row: 2;
`;

export const Add = styled(mui.IconButton)`
  grid-column: 3;
  grid-row: 2;
  justify-self: flex-end;
  width: 30px;
  height: 30px;
`;
