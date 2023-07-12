import { ReactNode } from 'react';
import { Container, Title, SubTitle, TryAgainButton } from './styles';

type ErrorType = 'internet' | 'server';

const errorMsg = {
  internet: 'Erro na conexão com a internet',
  server: 'Erro ao tentar se conectar com o servidor',
};

const MyErrors = (p: {
  type: ErrorType;
  onTryAgain?: () => void;
  children?: ReactNode;
}) => (
  <Container>
    <Title>{errorMsg[p.type]}</Title>
    <SubTitle>Tente novamente mais tarde</SubTitle>
    {p.onTryAgain && (
      <TryAgainButton onClick={p.onTryAgain}>Tentar novamente</TryAgainButton>
    )}
    {p.children}
  </Container>
);

export default MyErrors;
