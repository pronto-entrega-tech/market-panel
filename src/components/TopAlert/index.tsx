import {
  WebOff as WebOffIcon,
  PowerPlugOff as SocketOffIcon,
} from 'mdi-material-ui';
import useMyContext from '~/core/context';
import { Alert } from './styles';

const displayData = {
  connection: ['Sem internet', WebOffIcon],
  socket: ['Sistema inacessível', SocketOffIcon],
} as const;

export type TopAlertType = keyof typeof displayData;

const TopAlert = () => {
  const { topAlertType } = useMyContext();

  if (!topAlertType) return null;

  const [msg, Icon] = displayData[topAlertType];

  return (
    <Alert icon={<Icon fontSize='inherit' />} severity='error'>
      {msg}
    </Alert>
  );
};

export default TopAlert;
