import { Routes, Route } from "react-router-dom";
import { Page } from "~/constants/pages";
import Orders from "~/pages/Orders";
import { useOrdersState } from "~/pages/Orders/useOrdersState";
import Stock from "~/pages/Stock";
import { useStockState } from "~/pages/Stock/useStockState";
import { useStockHistState } from "~/pages/Stock/StockHist/useStockHistState";
import Help from "~/pages/Help";
import Config from "~/pages/Config";
import { useConfigState } from "~/pages/Config/useConfigState";
import Profile from "~/pages/Config/Profile";
import { useProfileState } from "~/pages/Config/Profile/useProfileState";
import EditProfile from "~/pages/Config/Profile/EditProfile";
import Plugin from "~/pages/Config/Plugin";
import BusinessHours from "~/pages/Config/Profile/BusinessHours";
import { useBusinessHours } from "~/pages/Config/Profile/BusinessHours/useBusinessHours";
import SpecialDays from "~/pages/Config/Profile/SpecialDays";
import { useSpecialDaysState } from "~/pages/Config/Profile/SpecialDays/useSpecialDaysState";
import Subs from "~/pages/Config/Profile/Subs";

const AppRoutes = () => {
  const orderState = useOrdersState();
  const stockHistState = useStockHistState();
  const stockState = useStockState();
  const configState = useConfigState();
  const profileState = useProfileState();
  const businessHoursState = useBusinessHours(profileState);
  const specialDaysState = useSpecialDaysState(profileState);

  return (
    <Routes>
      <Route index element={<Orders {...orderState} />} />
      <Route
        path={Page.Stock}
        element={<Stock {...{ stockState, stockHistState }} />}
      />
      <Route path={Page.Help} element={<Help />} />
      <Route path={Page.Config} element={<Config {...configState} />}>
        <Route path={Page.Profile}>
          <Route index element={<Profile {...profileState} />} />
          <Route
            path={Page.EditProfile}
            element={<EditProfile {...profileState} />}
          />
          <Route
            path={Page.EditBHs}
            element={<BusinessHours {...businessHoursState} />}
          />
          <Route
            path={Page.EditSDs}
            element={<SpecialDays {...specialDaysState} />}
          />
          <Route path={Page.Subs} element={<Subs />} />
        </Route>
        <Route path={Page.Plugin} element={<Plugin />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
