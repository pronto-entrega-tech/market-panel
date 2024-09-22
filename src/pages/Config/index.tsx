import { Container, SideBar, ConfigButton, Main } from "./styles";
import { Page } from "~/constants/pages";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

export const useConfigState = () => {
  const [path, setPath] = useState<string>(Page.Profile);

  return { path, setPath };
};

const Config = ({ path, setPath }: ReturnType<typeof useConfigState>) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const configPath = pathname.split("/")[2] ?? "";
  const routes = [
    ["Perfil", Page.Profile],
    ["Integração", Page.Plugin],
  ];

  useEffect(() => {
    configPath ? setPath(pathname) : navigate(path);
  }, [navigate, setPath, path, configPath, pathname]);

  return (
    <Container>
      <SideBar>
        {routes.map(([title, path]) => (
          <ConfigButton
            key={title}
            className={configPath === path ? "selected" : "unselected"}
            onClick={() => navigate(path)}
          >
            {title}
          </ConfigButton>
        ))}
      </SideBar>
      <Main>
        <Outlet />
      </Main>
    </Container>
  );
};

export default Config;
