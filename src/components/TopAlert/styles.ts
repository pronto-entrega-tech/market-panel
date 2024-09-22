import styled from "styled-components";
import * as mui from "@mui/material";
import { ZIndex } from "~/constants/zIndex";

export const Alert = styled(mui.Alert)`
  position: absolute;
  top: 0;
  z-index: ${ZIndex.TopAlert};
  margin: 6px 0px 0px 6px;
`;
