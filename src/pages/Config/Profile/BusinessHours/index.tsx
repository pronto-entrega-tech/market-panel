import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import GoBackHeader from "~/components/GoBackHeader";
import Loading from "~/components/Loading";
import { errMsg } from "~/constants/errorMessages";
import useMyContext from "~/core/context";
import { BusinessHour } from "~/core/types";
import { useGoBack } from "~/hooks/useGoBack";
import { useLoading } from "~/hooks/useLoading";
import { api } from "~/services/api";
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
} from "./styles";
import { useBusinessHours } from "./useBusinessHours";

const weekDays = [
  ["SUN", "DOM"],
  ["MON", "SEG"],
  ["TUE", "TER"],
  ["WED", "QUA"],
  ["THU", "QUI"],
  ["FRI", "SEX"],
  ["SAT", "SAB"],
];

const EditBusinessHours = ({
  businessHours,
  setBusinessHours,
  setProfile,
}: ReturnType<typeof useBusinessHours>) => {
  const { alert } = useMyContext();
  const goBack = useGoBack();
  const [isLoading, , withLoading] = useLoading();

  if (isLoading) return <Loading />;

  const addHours = () => {
    if (businessHours.length >= 50) return alert("Máximo de 50 horários");

    const defaultBH: BusinessHour = {
      days: businessHours.length ? [] : ["MON", "TUE", "WED", "THU", "FRI"],
      open_time: businessHours.at(-1)?.open_time ?? "07:00",
      close_time: businessHours.at(-1)?.close_time ?? "22:00",
    };

    setBusinessHours(businessHours.concat(defaultBH));
  };

  const setBHsDays = (index: number, date: Date) => {
    setBusinessHours(
      businessHours.map((v, i) => (i === index ? { ...v, date } : v)),
    );
  };

  const setBHsTimes = (
    index: number,
    times: Partial<Pick<BusinessHour, "open_time" | "close_time">>,
  ) => {
    setBusinessHours(
      businessHours.map((v, i) => (i === index ? { ...v, ...times } : v)),
    );
  };

  const removeHours = (index: number) => {
    setBusinessHours(businessHours.filter((_, i) => i !== index));
  };

  const businessHoursComponents = businessHours.map(
    ({ days, open_time, close_time }, i) => (
      <HoursItemContainer key={i}>
        <ToggleButtonGroup
          value={days}
          size="small"
          onChange={(_, values) => setBHsDays(i, values)}
        >
          {weekDays.map(([day, name]) => (
            <ToggleButton key={day} value={day != null}>
              {name}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        {(
          [
            [open_time, "open_time", "Abre"],
            [close_time, "close_time", "Fecha"],
          ] as const
        ).map(([time, prop, name]) => (
          <TimeField
            key={prop}
            label={name}
            type="time"
            value={time}
            onChange={(e) => setBHsTimes(i, { [prop]: e.target.value })}
            inputProps={{ step: 5 * 60 }}
          />
        ))}
        <RemoveHoursButton onClick={() => removeHours(i)} variant="text">
          Remover
        </RemoveHoursButton>
      </HoursItemContainer>
    ),
  );

  const update = withLoading(async () => {
    try {
      await api.markets.update({ business_hours: businessHours });
      setProfile((v) => v && { ...v, business_hours: businessHours });
      goBack();
    } catch {
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
              height: `${64.5 * businessHoursComponents.length || 24}px`,
            }}
          >
            {businessHoursComponents.length ? (
              businessHoursComponents
            ) : (
              <ErrorText>Nenhum horário ainda</ErrorText>
            )}
          </HoursContainer>
          <Button onClick={addHours} variant="outlined">
            Adicionar horário
          </Button>
        </Scroll>
        <CreateButton onClick={update}>Atualizar</CreateButton>
      </Container>
    </>
  );
};

export default EditBusinessHours;
