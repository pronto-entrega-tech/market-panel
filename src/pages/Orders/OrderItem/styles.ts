import styled from "styled-components";
import { ButtonBase } from "@mui/material";

const Container = styled(ButtonBase)`
  && {
    display: grid;
    grid-template-columns: 150px 92px;
    grid-template-rows: 24px 24px;
    padding: 8px 16px 8px 16px;
    border-radius: 0px;
    border-bottom: 1px solid var(--divider);
    font-size: 13px;
    transition: 200ms;
    border-right: 2px solid transparent;
    &.unselected {
      &:hover {
        background-color: var(--hover);
      }
    }
    &.selected {
      background-color: var(--selected);
      border-right-color: var(--primary);
    }
  }
`;

const Id = styled.div`
  grid-column: 1;
  grid-row: 1;
  justify-self: flex-start;
  font-size: 14px;
  font-family: "Roboto";
  font-weight: 500;
  color: rgba(0, 0, 0, 0.8);
`;

const Status = styled.div`
  grid-column: 2;
  grid-row: 1;
  justify-self: flex-end;
  font-size: 13px;
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

const Name = styled.span`
  grid-column: 1;
  grid-row: 2;
  justify-self: flex-start;
`;

const Hour = styled.div`
  grid-column: 2;
  grid-row: 2;
  justify-self: flex-end;
`;

export { Container, Id, Hour, Name, Status };
