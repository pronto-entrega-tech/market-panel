import {
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { PlusCircle as AddIcon } from "mdi-material-ui";
import { useState } from "react";
import useMyContext from "~/core/context";
import {
  Container,
  Div,
  ColumnsContainer,
  Column,
  Title,
  Description,
  Input,
  PaymentsContainer,
  AddPaymentsText,
  PaymentChip,
  HoursContainer,
  HoursItemContainer,
  TimeField,
  RemoveHoursButton,
  FormControl,
  Button,
  CreateButton,
  ErrorText,
} from "./styles";
import {
  digitsMask,
  CNPJMask,
  decimalMask,
  integerMask,
} from "~/functions/mask";
import { BusinessHour, CreateMarketDto } from "~/core/types";
import ConfirmAddress from "../ConfirmAddress";
import { api } from "~/services/api";
import { is404 } from "~/functions/errors";
import { errMsg } from "~/constants/errorMessages";
import Loading from "~/components/Loading";
import { useLoading } from "~/hooks/useLoading";
import produce from "immer";

const weekDays = [
  ["SUN", "DOM"],
  ["MON", "SEG"],
  ["TUE", "TER"],
  ["WED", "QUA"],
  ["THU", "QUI"],
  ["FRI", "SEX"],
  ["SAT", "SAB"],
];

const payments = [
  "Dinheiro",
  "Pix",
  "Crédito Mastercard",
  "Débito Mastercard",
  "Crédito Visa",
  "Débito Visa",
  "Crédito Elo",
  "Débito Elo",
  "Crédito Hipercard",
  "Débito Hipercard",
];

const SignOn = (p: { createToken: string }) => {
  const { alert } = useMyContext();
  const [dto, setDto] = useState({
    ...({} as Partial<CreateMarketDto>),
    type: "SUPERMARKET",
    payments_accepted: payments.slice(0, 8),
    business_hours: [] as BusinessHour[],
    pix_key_type: "CNPJ",
  });
  const [inputError, setInputError] = useState(
    {} as Record<keyof CreateMarketDto, boolean>,
  );
  const [isLoading, , withLoading] = useLoading();
  const [validDto, setValidDto] = useState<CreateMarketDto>();

  const pixKeyMask = ["CPF", "CNPJ", "PHONE"].includes(dto.pix_key_type)
    ? digitsMask
    : undefined;

  const props: [
    string,
    string,
    ((v?: string) => string)?,
    { prefix?: string; suffix?: string; type?: string }?,
  ][] = [
    ["name", "Nome"],
    ["document", "CNPJ", CNPJMask],
    [
      "order_min",
      "Valor mínimo do pedido",
      decimalMask,
      { prefix: "R$", type: "half" },
    ],
    [
      "delivery_fee",
      "Taxa de entrega",
      decimalMask,
      { prefix: "R$", type: "half" },
    ],
    ["markup", "Markup", decimalMask, { suffix: "%", type: "half1" }],
    [
      "min_time",
      "Tempo de entrega",
      integerMask,
      { prefix: "Mínimo", suffix: "minutos", type: "half" },
    ],
    [
      "max_time",
      "",
      integerMask,
      { prefix: "Máximo", suffix: "minutos", type: "half" },
    ],
    ["pix_key", "Chave pix", pixKeyMask, { type: "half2" }],
  ];

  const createAccount = withLoading(async () => {
    const [hasErr, errs] = props.reduce<[boolean, Record<string, boolean>]>(
      ([hasErr, errs], [prop]) => {
        const value = dto[prop];
        if (Array.isArray(value) ? value.length : value) return [hasErr, errs];

        setInputError(produce((dto) => void (dto[prop] = true)));

        return [true, produce(errs, (errs) => void (errs[prop] = true))];
      },
      [false, {}],
    );

    if (hasErr)
      return setInputError(produce((dto) => void Object.assign(dto, errs)));

    const validDto = dto as CreateMarketDto;

    try {
      const address = await api.markets.address(validDto.document);

      setValidDto({ ...validDto, ...address });
    } catch (err) {
      alert(is404(err) ? errMsg.notFound("CNPJ") : errMsg.server());
    }
  });

  if (isLoading) return <Loading />;

  if (validDto)
    return (
      <ConfirmAddress
        dto={validDto}
        createToken={p.createToken}
        goBack={() => setValidDto(undefined)}
      />
    );

  const addPayment = (name: string) => {
    if (dto.payments_accepted.length >= 50)
      return alert("Máximo de 50 pagamentos");

    const add = (value: string) =>
      setDto(produce((dto) => void dto.payments_accepted.push(value)));

    name === "Outro"
      ? alert("Nome do pagamento", "", {
          showInput: true,
          onConfirm: (input) => add(input),
        })
      : add(name);
  };

  const removePayment = (value: string) => {
    setDto(
      produce((dto) => void dto.payments_accepted.pick((v) => v !== value)),
    );
  };

  const addHours = () => {
    if (dto.business_hours.length >= 50) return alert("Máximo de 50 horários");

    const defaultBH: BusinessHour = {
      days: dto.business_hours.length
        ? []
        : ["MON", "TUE", "WED", "THU", "FRI"],
      open_time: dto.business_hours.at(-1)?.open_time ?? "07:00",
      close_time: dto.business_hours.at(-1)?.close_time ?? "22:00",
    };

    setDto(produce((dto) => void dto.business_hours.push(defaultBH)));
  };

  const setBHsDays = (index: number, days: string[]) => {
    setDto(produce((dto) => void (dto.business_hours[index].days = days)));
  };

  const setBHsTimes = (
    index: number,
    times: Partial<Pick<BusinessHour, "open_time" | "close_time">>,
  ) => {
    setDto(
      produce((dto) => void Object.assign(dto.business_hours[index], times)),
    );
  };

  const removeHours = (index: number) => {
    setDto(
      produce((dto) => void dto.business_hours.pick((_, i) => i !== index)),
    );
  };

  const inputs = props.map(
    ([prop, name, mask = (v) => v, { prefix, suffix, type } = {} as any]) => (
      <Input
        key={name}
        label={name}
        value={mask(dto[prop]) || ""}
        onChange={({ target: { value } }) => {
          setDto(
            produce((dto) => void (dto[prop] = mask(value.slice(0, 256)))),
          );
          setInputError(produce((dto) => void (dto[prop] = false)));
        }}
        error={inputError[prop]}
        className={type}
        inputProps={{
          sx: { textAlign: suffix ? "end" : "start" },
        }}
        InputProps={{
          startAdornment: prefix && (
            <InputAdornment position="start">{prefix}</InputAdornment>
          ),
          endAdornment: suffix && (
            <InputAdornment position="end">{suffix}</InputAdornment>
          ),
        }}
      />
    ),
  );

  const businessHours = dto.business_hours.map(
    ({ days, open_time, close_time }, i) => (
      <HoursItemContainer key={i}>
        <ToggleButtonGroup
          value={days}
          size="small"
          onChange={(_, values) => setBHsDays(i, values)}
        >
          {weekDays.map(([day, name]) => (
            <ToggleButton key={day} value={day}>
              {name}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        {[
          [open_time, "open_time", "Abre"],
          [close_time, "close_time", "Fecha"],
        ].map(([time, prop, name]) => (
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

  const paymentsToAdd = payments
    .filter((v) => !dto.payments_accepted.includes(v))
    .concat("Outro");

  const leftColumn = (
    <Column>
      {inputs.slice(0, 2)}
      <Div>
        <FormControl>
          <InputLabel id="pix_key_type">Tipo da chave pix</InputLabel>
          <Select
            labelId="pix_key_type"
            value={dto.pix_key_type}
            onChange={(e) =>
              setDto(
                produce((dto) => {
                  dto.pix_key_type = e.target.value;
                }),
              )
            }
          >
            <MenuItem value="CPF">CPF</MenuItem>
            <MenuItem value="CNPJ">CNPJ</MenuItem>
            <MenuItem value="EMAIL">Email</MenuItem>
            <MenuItem value="PHONE">Telefone</MenuItem>
            <MenuItem value="EVP">Aleatória</MenuItem>
          </Select>
        </FormControl>
        {inputs.at(-1)}
      </Div>

      <Title>Pagamentos aceitos</Title>
      <PaymentsContainer>
        {dto.payments_accepted.length ? (
          dto.payments_accepted.map((name) => (
            <PaymentChip
              key={name}
              label={name}
              onDelete={() => removePayment(name)}
            />
          ))
        ) : (
          <ErrorText>Adicione ao menos um pagamento</ErrorText>
        )}
      </PaymentsContainer>
      <PaymentsContainer className="pad">
        <AddPaymentsText>Adicionar</AddPaymentsText>
        {paymentsToAdd.map((name) => (
          <PaymentChip
            key={name}
            label={name}
            icon={<AddIcon />}
            onClick={() => addPayment(name)}
          />
        ))}
      </PaymentsContainer>
    </Column>
  );

  const rightColumn = (
    <Column>
      <Div>{inputs.slice(2, 4)}</Div>

      <Div>{inputs.slice(5, 7)}</Div>

      <Div>
        {inputs.at(4)}
        <Description>
          Quantos porcento a mais deverá ser o preço no ProntoEntrega, em
          relação a sua loja.
        </Description>
      </Div>

      <Title>Horários</Title>
      <HoursContainer
        style={{ height: `${64.5 * businessHours.length || 24}px` }}
      >
        {businessHours.length ? (
          businessHours
        ) : (
          <ErrorText>Adicione ao menos um horário</ErrorText>
        )}
      </HoursContainer>
      <Button onClick={addHours} variant="outlined">
        Adicionar horário
      </Button>
    </Column>
  );

  return (
    <Container>
      <Title>Criar conta</Title>
      <ColumnsContainer>
        {leftColumn}
        {rightColumn}
      </ColumnsContainer>
      <CreateButton onClick={createAccount}>Criar</CreateButton>
    </Container>
  );
};

export default SignOn;
