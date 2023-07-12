import {
  Header,
  SubHeader,
  AvatarButton,
  Avatar,
  Picture,
  CartIcon,
  ChangePictureButton,
  Name,
  OpenLabel,
  Button,
} from './styles';
import useMyContext from '~/core/context';
import { useEffect, useState } from 'react';
import { Camera as CameraIcon } from 'mdi-material-ui';
import { local } from '~/services/local';
import { api } from '~/services/api';
import { OpenFlip, ProfileType } from '~/core/types';
import MyErrors from '~/components/Errors';
import Loading from '~/components/Loading';
import { errMsg } from '~/constants/errorMessages';
import { getMarketOpenness, getOpennessMsg } from '~/functions/marketOpenness';
import { fail } from '~/functions/fail';
import { useLoading } from '~/hooks/useLoading';
import { second } from '~/constants/time';
import { lightFormat } from 'date-fns';
import { timeStringToMs } from '~/functions/timeStringToMs';
import { useNavigate } from 'react-router-dom';
import { Page } from '~/constants/pages';
import { getImageUrl } from '~/functions/imageUrl';
import { useError } from '~/hooks/useError';
import { Backdrop } from '@mui/material';

export const useProfileState = () => {
  const { socket } = useMyContext();
  const [hasError, setError, tryAgain] = useError();
  const [profile, setProfile] = useState<ProfileType>();

  useEffect(() => {
    if (!socket || hasError) return;

    api.markets.find().then(setProfile).catch(setError);
  }, [socket, hasError, setError]);

  return { profile, setProfile, hasError, tryAgain };
};

function Profile({
  profile,
  setProfile,
  hasError,
  tryAgain,
}: ReturnType<typeof useProfileState>) {
  const { alert, signOut } = useMyContext();
  const navigate = useNavigate();
  const [isLoading, , withLoading] = useLoading();
  const [now, setNow] = useState(new Date());
  const [isOpen, setIsOpen] = useState<boolean>();
  const [isEarly, setIsEarly] = useState<boolean>();
  const [flipDate, setFlipDate] = useState<Date>();
  const [opennessMsg, setOpennessMsg] = useState<string>();
  const [canShowPicture, setCanShowPicture] = useState<boolean>();
  const [showPicture, setShowPicture] = useState(false);

  useEffect(() => {
    if (!profile) return;

    const openness = getMarketOpenness(profile);
    const opennessMsg = getOpennessMsg(openness);

    setIsOpen(openness.isOpen);
    setIsEarly(openness.nextHour?.isEarly);
    setFlipDate(openness.nextHour?.flipDate);
    setOpennessMsg(opennessMsg);

    if (!openness.nextHour) return;

    const getTimeLeftToNextBH = (now: Date) => {
      const nowInMs = timeStringToMs(lightFormat(now, 'HH:mm:ss:MM'));
      const nextBhTimeInMs = timeStringToMs(
        !openness.nextHour.isTomorrow ? openness.nextHour.time : '24', // new day
      );

      const timeLeft = nextBhTimeInMs - nowInMs;

      return timeLeft > 0 ? timeLeft : 60 * second; // bug protection
    };

    const updateTimeout = setTimeout(() => {
      setNow(new Date());
    }, getTimeLeftToNextBH(now));

    return () => clearTimeout(updateTimeout);
  }, [profile, now]);

  const openFlip = async () => {
    const createOpenFlip = withLoading(async (type: OpenFlip['type']) => {
      const flip = await api.markets.openFlip.create({ type });

      setProfile((old) => {
        const newProfile = { ...(old ?? fail()) };
        newProfile.open_flips.unshift(flip);
        return newProfile;
      });
    });

    const deleteOpenFlip = withLoading(async () => {
      if (!flipDate) return fail('Missing flipDate');

      await api.markets.openFlip.delete(flipDate);

      setProfile((old) => {
        const newProfile = { ...(old ?? fail()) };
        newProfile.open_flips = newProfile.open_flips.filter(
          (v) => +v.created_at !== +flipDate,
        );
        return newProfile;
      });
    });

    if (isEarly) {
      return deleteOpenFlip();
    }

    if (!isOpen) {
      return createOpenFlip('OPEN');
    }

    alert('Fechar até quando?', '', {
      confirmTitle: 'Até final do dia',
      cancelTitle: 'Até o proximo hora de abertura',
      onConfirm: () => createOpenFlip('CLOSE_UNTIL_NEXT_DAY'),
      onCancel: () => createOpenFlip('CLOSE_UNTIL_NEXT_OPEN'),
    });
  };

  if (hasError) return <MyErrors type='server' onTryAgain={tryAgain} />;
  if (!profile || isLoading) return <Loading />;

  const pictureUrl = getImageUrl('market', profile.market_id);

  const changePicture = async () => {
    const picture = await local
      .getPicture()
      .catch(() => alert('Erro ao obter imagem'));
    if (!picture) return;

    withLoading(() =>
      api.markets
        .uploadPicture(new File([picture.data], picture.name))
        .then(() => fetch(pictureUrl, { cache: 'reload' }))
        .catch(() => alert(errMsg.server())),
    )();
  };

  return (
    <>
      <Header>
        <AvatarButton
          sx={{ background: 'white' }}
          disabled={!canShowPicture}
          onClick={() => setShowPicture(true)}>
          <Avatar
            onLoad={() => setCanShowPicture(true)}
            src={pictureUrl}
            className={canShowPicture === false ? 'fallback' : undefined}>
            <CartIcon />
          </Avatar>
        </AvatarButton>
        <Backdrop open={showPicture} onClick={() => setShowPicture(false)}>
          <Picture onError={() => setShowPicture(false)} src={pictureUrl} />
        </Backdrop>
        <ChangePictureButton
          aria-label='Mudar foto de perfil'
          onClick={changePicture}>
          <CameraIcon />
        </ChangePictureButton>
        <SubHeader>
          <Name>{profile.name}</Name>
          <OpenLabel>{opennessMsg}</OpenLabel>
        </SubHeader>
      </Header>
      <Button onClick={openFlip}>
        {!isEarly
          ? `${isOpen ? 'Fechar' : 'Abrir'} mais cedo`
          : 'Voltar ao horário programado'}
      </Button>
      <Button onClick={() => navigate(Page.EditProfile)}>Editar Perfil</Button>
      <Button onClick={() => navigate(Page.EditBHs)}>Editar horários</Button>
      <Button onClick={() => navigate(Page.EditSDs)}>
        Agendar horários especiais
      </Button>
      <Button onClick={() => navigate(Page.Subs)}>Funcionários</Button>
      <Button onClick={withLoading(signOut)}>Sair</Button>
    </>
  );
}

export default Profile;
