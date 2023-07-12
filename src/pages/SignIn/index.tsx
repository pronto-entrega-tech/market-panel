import { useState } from 'react';
import { Container, LogoIcon, Title, Subtitle, Input, Button } from './styles';
import useMyContext from '~/core/context';
import { api } from '~/services/api';
import Loading from '~/components/Loading';
import { is401 } from '~/functions/errors';
import SignUp from './SignUp';
import { errMsg } from '~/constants/errorMessages';

function SignIn() {
  const { setAccessToken, alert } = useMyContext();
  const [isLoading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [inputError, setInputError] = useState(false);
  const [key, setKey] = useState('');
  const [createToken, setCreateToken] = useState('');

  const stages = {
    email: {
      subtitle: 'Insira seu email para entrar',
      inputTitle: 'Email',
      buttonTitle: 'Entrar',
      async onClick() {
        if (!input) return setInputError(true);

        try {
          setLoading(true);
          const res = await api.auth.email(input);
          setKey(res.key);

          setInput('');
          setStage('otp');
        } catch {
          alert(errMsg.server());
        } finally {
          setLoading(false);
        }
      },
    },
    otp: {
      subtitle: 'Insira o código de verificação e entre',
      inputTitle: 'Código de Verificação',
      buttonTitle: 'Entrar',
      async onClick() {
        if (!input) return setInputError(true);
        try {
          setLoading(true);

          const res = await api.auth.validate(key, input);
          if (res.type !== 'ACCESS') return setCreateToken(res.token);

          setAccessToken(res.token);
        } catch (err) {
          alert(is401(err) ? 'Código inválido' : errMsg.server());
        } finally {
          setLoading(false);
        }
      },
    },
  };
  const [stage, setStage] = useState<keyof typeof stages>('email');
  const data = stages[stage];

  if (isLoading) return <Loading />;

  if (createToken) return <SignUp createToken={createToken} />;

  return (
    <Container>
      <LogoIcon />
      <Title>Panel de Controle</Title>
      <Subtitle>{data.subtitle}</Subtitle>
      <Input
        placeholder={data.inputTitle}
        value={input}
        error={inputError}
        onChange={(e) => {
          setInput(e.target.value);
          setInputError(false);
        }}
        onKeyPress={(e) => e.key === 'Enter' && data.onClick()}
        autoFocus
      />
      <Button onClick={data.onClick}>{data.buttonTitle}</Button>
    </Container>
  );
}

export default SignIn;
