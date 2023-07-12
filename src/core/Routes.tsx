import { Routes, Route } from 'react-router-dom';
import { Page } from '~/constants/pages';
import Orders, { useOrdersState } from '~/pages/Orders';
import Stock, { useStockState } from '~/pages/Stock';
import { useStockHistState } from '~/pages/Stock/StockHist';
import Help from '~/pages/Help';
import Config, { useConfigState } from '~/pages/Config';
import Profile, { useProfileState } from '~/pages/Config/Profile';
import EditProfile from '~/pages/Config/Profile/EditProfile';
import Plugin from '~/pages/Config/Plugin';
import BusinessHours, {
  useBusinessHours,
} from '~/pages/Config/Profile/BusinessHours';
import SpecialDays, {
  useSpecialDaysState,
} from '~/pages/Config/Profile/SpecialDays';
import Subs from '~/pages/Config/Profile/Subs';

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
