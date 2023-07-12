import './assets/global.css';
import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from '~/core/App';
import { AppContexts } from '~/core/AppContexts';
import Loading from './components/Loading';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { fail } from './functions/fail';
import TopAlert from './components/TopAlert';
import Notifications from './components/Notification';
import ModalAlert from './components/MyAlert';
import { ZIndex } from '~/constants/zIndex';
import { enableMapSet } from 'immer';

enableMapSet();

Array.prototype.pick = function (fn, thisArg) {
  this.map((...args) =>
    (thisArg ? fn.bind(thisArg) : fn)(...args) ? args[1] : undefined,
  ).forEach((i) => {
    if (i !== undefined) this.splice(i, 1);
  });
};

Map.prototype.remove = function (key) {
  const hasDeleted = this.delete(key);
  if (!hasDeleted) throw new Error("Can't delete item");
  return this;
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196F3',
      contrastText: '#FFF',
    },
  },
  typography: { fontFamily: 'Roboto' },
  components: {
    MuiTextField: { defaultProps: { variant: 'standard' } },
    MuiFormControl: { defaultProps: { variant: 'standard' } },
    MuiSelect: { defaultProps: { variant: 'standard' } },
    MuiButton: {
      defaultProps: { variant: 'contained', disableElevation: true },
    },
    MuiIconButton: { defaultProps: { color: 'primary' } },
    MuiFab: {
      defaultProps: {
        sx: {
          zIndex: ZIndex.Fab,
          background: 'white',
          color: 'var(--primary)',
        },
      },
    },
    MuiBackdrop: {
      defaultProps: { sx: { zIndex: ZIndex.Backdrop } },
    },
  },
});

const container = document.getElementById('target') ?? fail();
const root = createRoot(container);
root.render(
  <Suspense fallback={<Loading />}>
    <AppContexts>
      <HashRouter>
        <ThemeProvider theme={theme}>
          <App />
          <TopAlert />
          <Notifications />
          <ModalAlert />
        </ThemeProvider>
      </HashRouter>
    </AppContexts>
  </Suspense>,
);
