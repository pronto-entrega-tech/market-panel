import { ArrowLeft as BackIcon } from 'mdi-material-ui';
import { ReactNode } from 'react';
import { useGoBack } from '~/hooks/useGoBack';
import { Header, Title, GoBackButton } from './styles';

const GoBackHeader = (p: { children: ReactNode }) => {
  const goBack = useGoBack();

  return (
    <Header>
      <GoBackButton onClick={goBack}>
        <BackIcon />
      </GoBackButton>
      <Title>{p.children}</Title>
    </Header>
  );
};

export default GoBackHeader;
