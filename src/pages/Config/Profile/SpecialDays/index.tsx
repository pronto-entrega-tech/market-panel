import { lightFormat } from 'date-fns';
import { useState } from 'react';
import GoBackHeader from '~/components/GoBackHeader';
import Loading from '~/components/Loading';
import { errMsg } from '~/constants/errorMessages';
import useMyContext from '~/core/context';
import { SpecialDay } from '~/core/types';
import { useGoBack } from '~/hooks/useGoBack';
import { useLoading } from '~/hooks/useLoading';
import { api } from '~/services/api';
import { useProfileState } from '..';
import {
  Container,
  HoursContainer,
  Scroll,
  HoursItemContainer,
  TimeField,
  RemoveHoursButton,
  Button,
  CreateButton,
  ErrorText,
} from './styles';

export const useSpecialDaysState = ({
  profile,
  setProfile,
}: ReturnType<typeof useProfileState>) => {
  const [specialDays, setSpecialDays] = useState(profile?.special_days ?? []);

  return { specialDays, setSpecialDays, setProfile };
};

const SpecialDays = ({
  specialDays,
  setSpecialDays,
  setProfile,
}: ReturnType<typeof useSpecialDaysState>) => {
  const { alert } = useMyContext();
  const goBack = useGoBack();
  const [isLoading, , withLoading] = useLoading();

  if (isLoading) return <Loading />;

  const addHours = () => {
    if (specialDays.length >= 50) return alert('Máximo de 50 horários');

    const defaultBH: SpecialDay = {
      date: new Date(),
      open_time: specialDays.at(-1)?.open_time ?? '07:00',
      close_time: specialDays.at(-1)?.close_time ?? '22:00',
      reason_code: 0,
      reason_name: 'Motivo',
    };

    setSpecialDays(specialDays.concat(defaultBH));
  };

  const setBHsDate = (index: number, date: Date) => {
    setSpecialDays(
      specialDays.map((v, i) => (i === index ? { ...v, date } : v)),
    );
  };

  const setBHsTimes = (
    index: number,
    times: Partial<Pick<SpecialDay, 'open_time' | 'close_time'>>,
  ) => {
    setSpecialDays(
      specialDays.map((v, i) => (i === index ? { ...v, ...times } : v)),
    );
  };

  const removeHours = (index: number) => {
    setSpecialDays(specialDays.filter((_, i) => i !== index));
  };

  const specialDaysComponents = specialDays.map(
    ({ date, open_time, close_time }, i) => (
      <HoursItemContainer key={i}>
        <TimeField
          label='Data'
          type='date'
          value={lightFormat(date, 'yyyy-MM-dd')}
          onChange={(e) => setBHsDate(i, new Date(e.target.value))}
        />
        {[
          [open_time, 'open_time', 'Abre'],
          [close_time, 'close_time', 'Fecha'],
        ].map(([time, prop, name]) => (
          <TimeField
            key={prop}
            label={name}
            type='time'
            value={time}
            onChange={(e) => setBHsTimes(i, { [prop]: e.target.value })}
            inputProps={{ step: 5 * 60 }}
          />
        ))}
        <RemoveHoursButton onClick={() => removeHours(i)} variant='text'>
          Remover
        </RemoveHoursButton>
      </HoursItemContainer>
    ),
  );

  const update = withLoading(async () => {
    try {
      await api.markets.update({ special_days: specialDays });
      setProfile((v) => v && { ...v, special_days: specialDays });
      goBack();
    } catch (err) {
      alert(errMsg.server());
    }
  });

  return (
    <>
      <GoBackHeader>Atualizar horários especiais</GoBackHeader>
      <Container>
        <Scroll>
          <HoursContainer
            style={{
              height: `${64.5 * specialDaysComponents.length || 24}px`,
            }}>
            {specialDaysComponents.length ? (
              specialDaysComponents
            ) : (
              <ErrorText>Nenhum horário ainda</ErrorText>
            )}
          </HoursContainer>
          <Button onClick={addHours} variant='outlined'>
            Adicionar horário
          </Button>
        </Scroll>
        <CreateButton onClick={update}>Atualizar</CreateButton>
      </Container>
    </>
  );
};

export default SpecialDays;
