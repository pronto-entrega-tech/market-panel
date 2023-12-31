import { InputAdornment, InputLabel, MenuItem, Select } from '@mui/material';
import { PlusCircle as AddIcon } from 'mdi-material-ui';
import { useState } from 'react';
import useMyContext from '~/core/context';
import {
  Container,
  Div,
  ColumnsContainer,
  Column,
  Title2,
  Description,
  Input,
  PaymentsContainer,
  AddPaymentsText,
  PaymentChip,
  FormControl,
  CreateButton,
  ErrorText,
} from './styles';
import {
  digitsMask,
  CNPJMask,
  decimalMask,
  integerMask,
} from '~/functions/mask';
import { CreateMarketDto } from '~/core/types';
import { api } from '~/services/api';
import { errMsg } from '~/constants/errorMessages';
import Loading from '~/components/Loading';
import { useLoading } from '~/hooks/useLoading';
import produce from 'immer';
import { useProfileState } from '~/pages/Config/Profile';
import GoBackHeader from '~/components/GoBackHeader';
import { pick } from '~/functions/pick';

const payments = [
  'Dinheiro',
  'Pix',
  'Crédito Mastercard',
  'Débito Mastercard',
  'Crédito Visa',
  'Débito Visa',
  'Crédito Elo',
  'Débito Elo',
  'Crédito Hipercard',
  'Débito Hipercard',
];

const EditProfile = ({
  hasError,
  profile,
  setProfile,
}: ReturnType<typeof useProfileState>) => {
  const { alert } = useMyContext();
  const [isLoading, , withLoading] = useLoading();
  const [dto, setDto] = useState({
    ...({} as Partial<CreateMarketDto>),
    type: 'SUPERMARKET',
    payments_accepted: payments.slice(0, 8),
    pix_key_type: 'CNPJ',
    ...(profile &&
      pick(
        profile,
        'name',
        'document',
        'pix_key_type',
        'pix_key',
        'payments_accepted',
        'order_min',
        'delivery_fee',
        'min_time',
        'max_time',
        'markup',
      )),
  });
  const [inputError, setInputError] = useState(
    {} as Record<keyof CreateMarketDto, boolean>,
  );

  const pixKeyMask = ['CPF', 'CNPJ', 'PHONE'].includes(dto.pix_key_type)
    ? digitsMask
    : undefined;

  const props: [
    string,
    string,
    ((v?: string) => string)?,
    { prefix?: string; suffix?: string; type?: string }?,
  ][] = [
    ['name', 'Nome'],
    ['document', 'CNPJ', CNPJMask],
    [
      'order_min',
      'Valor mínimo do pedido',
      decimalMask,
      { prefix: 'R$', type: 'half' },
    ],
    [
      'delivery_fee',
      'Taxa de entrega',
      decimalMask,
      { prefix: 'R$', type: 'half' },
    ],
    ['markup', 'Markup', decimalMask, { suffix: '%', type: 'half1' }],
    [
      'min_time',
      'Tempo de entrega',
      integerMask,
      { prefix: 'Mínimo', suffix: 'minutos', type: 'half' },
    ],
    [
      'max_time',
      '',
      integerMask,
      { prefix: 'Máximo', suffix: 'minutos', type: 'half' },
    ],
    ['pix_key', 'Chave pix', pixKeyMask, { type: 'half2' }],
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
      await api.markets.update(validDto);
      setProfile((v) => v && { ...v, ...validDto });
    } catch (err) {
      alert(errMsg.server());
    }
  });

  if (isLoading) return <Loading />;

  const addPayment = (name: string) => {
    if (dto.payments_accepted.length >= 50)
      return alert('Máximo de 50 pagamentos');

    const add = (value: string) =>
      setDto(produce((dto) => void dto.payments_accepted.push(value)));

    name === 'Outro'
      ? alert('Nome do pagamento', '', {
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

  const inputs = props.map(
    ([prop, name, mask = (v) => v, { prefix, suffix, type } = {} as any]) => (
      <Input
        key={name}
        label={name}
        value={mask(dto[prop]) || ''}
        onChange={({ target: { value } }) => {
          setDto(
            produce((dto) => void (dto[prop] = mask(value.slice(0, 256)))),
          );
          setInputError(produce((dto) => void (dto[prop] = false)));
        }}
        error={inputError[prop]}
        className={type}
        inputProps={{
          sx: { textAlign: suffix ? 'end' : 'start' },
        }}
        InputProps={{
          startAdornment: prefix && (
            <InputAdornment position='start'>{prefix}</InputAdornment>
          ),
          endAdornment: suffix && (
            <InputAdornment position='end'>{suffix}</InputAdornment>
          ),
        }}
      />
    ),
  );

  const paymentsToAdd = payments
    .filter((v) => !dto.payments_accepted.includes(v))
    .concat('Outro');

  const leftColumn = (
    <Column>
      {inputs.slice(0, 2)}
      <Div>
        <FormControl>
          <InputLabel id='pix_key_type'>Tipo da chave pix</InputLabel>
          <Select
            labelId='pix_key_type'
            value={dto.pix_key_type}
            onChange={(e) =>
              setDto(
                produce((dto) => {
                  dto.pix_key_type = e.target.value;
                }),
              )
            }>
            <MenuItem value='CPF'>CPF</MenuItem>
            <MenuItem value='CNPJ'>CNPJ</MenuItem>
            <MenuItem value='EMAIL'>Email</MenuItem>
            <MenuItem value='PHONE'>Telefone</MenuItem>
            <MenuItem value='EVP'>Aleatória</MenuItem>
          </Select>
        </FormControl>
        {inputs.at(-1)}
      </Div>

      <Title2>Pagamentos aceitos</Title2>
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
      <PaymentsContainer className='pad'>
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
    </Column>
  );

  return (
    <>
      <GoBackHeader>Atualizar conta</GoBackHeader>
      <Container>
        <ColumnsContainer>
          {leftColumn}
          {rightColumn}
        </ColumnsContainer>
        <CreateButton onClick={createAccount}>Atualizar</CreateButton>
      </Container>
    </>
  );
};

export default EditProfile;
