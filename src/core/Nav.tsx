import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import * as mui from "@mui/material";
import {
  Cart as OrdersIcon,
  PackageVariantClosed as StockIcon,
  Cog as ConfigIcon,
  HelpCircle as HelpIcon,
} from "mdi-material-ui";
import { Page } from "~/constants/pages";
import { Logo } from "~/components/Logo";
import { componentWidth } from "~/constants/componentWidths";
import { ReactNode } from "react";
import { ZIndex } from "~/constants/zIndex";

const SideNav = styled.nav`
  display: flex;
  height: -webkit-fill-available;
  width: ${componentWidth.nav}px;
  background-color: var(--primary);
  padding-top: 24px;
  flex-direction: column;
  z-index: ${ZIndex.Nav};
`;

const Bottom = styled.div`
  display: flex;
  width: 140px;
  flex-direction: column;
  position: absolute;
  bottom: 48px;
`;

const Button = styled(mui.Button).attrs({
  variant: "text",
  size: "large",
})`
  && {
    margin-top: 8px;
    margin-left: 12px;
    padding: 10px 16px 10px 16px;
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
    text-transform: none;
    justify-content: flex-start;
    transition: 300ms;
    &.unselected {
      color: white;
      &:hover {
        background-color: var(--primaryLight);
      }
    }
    &.selected {
      background-color: var(--background);
    }
  }
`;

const LogoIcon = styled(Logo)`
  color: white;
  height: 80px;
  width: 80px;
  margin-bottom: 14px;
  align-self: center;
`;

const Badge = styled(mui.Badge).attrs({
  invisible: true,
  variant: "dot",
  color: "error",
})``;

const Nav = () => (
  <SideNav>
    <LogoIcon />
    <NavButton Icon={OrdersIconB} path={Page.Orders}>
      Pedidos
    </NavButton>
    <NavButton Icon={StockIcon} path={Page.Stock}>
      Estoque
    </NavButton>
    <Bottom>
      {/* <NavButton Icon={HelpIcon} path={ROUTES.HELP}>
        Ajuda
      </NavButton> */}
      <NavButton Icon={ConfigIconB} path={Page.Config}>
        Ajustes
      </NavButton>
    </Bottom>
  </SideNav>
);

const NavButton = ({
  Icon,
  path,
  children,
}: {
  Icon: any;
  path: string;
  children: ReactNode;
}) => {
  const navigate = useNavigate();
  const [, currentPath] = useLocation().pathname.split("/");

  return (
    <Button
      onClick={() => navigate(path)}
      className={currentPath === path ? "selected" : "unselected"}
      startIcon={
        <Icon color="inherit" sx={{ height: "26px", width: "26px" }} />
      }
    >
      {children}
    </Button>
  );
};

const OrdersIconB = (props: any) => (
  <Badge>
    <OrdersIcon {...props} />
  </Badge>
);

const ConfigIconB = (props: any) => (
  <Badge>
    <ConfigIcon {...props} />
  </Badge>
);

export default Nav;
