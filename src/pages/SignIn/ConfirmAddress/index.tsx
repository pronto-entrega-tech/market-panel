import { useState } from "react";
import Loading from "~/components/Loading";
import { api } from "~/services/api";
import useMyContext from "~/core/context";
import { Container, Title, Row, Input, ButtonsRow, Button } from "./styles";
import { errMsg } from "~/constants/errorMessages";
import { CreateMarketDto } from "~/core/types";
import { useLoading } from "~/hooks/useLoading";

export type Address = {
  address_street: string;
  address_number: string;
  address_district: string;
  address_city: string;
  address_state: string;
  address_complement?: string;
};

const props: [keyof CreateMarketDto, string, string?][] = [
  ["address_street", "Rua", "half1"],
  ["address_number", "Numero", "half2"],
  ["address_district", "Bairro"],
  ["address_city", "Cidade", "half1"],
  ["address_state", "Estado", "half2"],
  ["address_complement", "Complemento"],
];

const ConfirmAddress = (p: {
  dto: CreateMarketDto;
  createToken: string;
  goBack: () => void;
}) => {
  const { setAccessToken, alert } = useMyContext();
  const [isLoading, , withLoading] = useLoading();
  const [dto, setDto] = useState(p.dto);
  const [inputError, setInputError] = useState(
    {} as Record<keyof CreateMarketDto, boolean>,
  );

  if (isLoading) return <Loading />;

  const confirm = withLoading(async () => {
    const [hasErr, errs] = props
      .slice(0, -1)
      .reduce<[boolean, Record<string, boolean>]>(
        ([hasErr, errs], [prop]) => {
          if (dto[prop]) return [hasErr, errs];

          setInputError({ ...inputError, [prop]: true });
          return [true, { ...errs, [prop]: true }];
        },
        [false, {}],
      );

    if (hasErr) return setInputError({ ...inputError, ...errs });

    try {
      const validDecimal = (v: string) => v.replace(",", ".");
      const { token } = await api.markets.create(p.createToken, {
        ...p.dto,
        ...dto,
        order_min: validDecimal(dto.order_min),
        delivery_fee: validDecimal(dto.delivery_fee),
        markup: validDecimal(dto.markup),
      });

      setAccessToken(token);
    } catch {
      alert(errMsg.server());
    }
  });

  const inputs = props.map(([prop, name, type]) => (
    <Input
      key={name}
      label={name}
      value={dto[prop] || ""}
      onChange={({ target: { value } }) => {
        setDto({ ...dto, [prop]: value.slice(0, 256) });
        setInputError({ ...inputError, [prop]: false });
      }}
      error={inputError[prop]}
      className={type}
    />
  ));

  return (
    <Container>
      <Title>Confirmar endereço</Title>
      <Row>{inputs.slice(0, 2)}</Row>
      {inputs.at(2)}
      <Row>{inputs.slice(3, 5)}</Row>
      {inputs.at(5)}
      <ButtonsRow>
        <Button onClick={p.goBack} variant="outlined">
          Voltar
        </Button>
        <Button onClick={confirm}>Confirmar</Button>
      </ButtonsRow>
    </Container>
  );
};

export default ConfirmAddress;
