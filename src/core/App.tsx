import styled from "styled-components";
import Routes from "~/core/Routes";
import useMyContext from "~/core/context";
import Nav from "./Nav";
import SighIn from "~/pages/SignIn";
import dbSync from "./dbSync";
import Loading from "~/components/Loading";

const Container = styled.div`
  display: flex;
  height: -webkit-fill-available;
  background-color: var(--background);
`;

const Content = styled.div`
  flex: 1;
  height: -webkit-fill-available;
`;

const App = () => {
  const { isAuthed } = useMyContext();

  /* useEffect(() => {
    if (!isAuthed) return;

    const loop = dbSync();

    return () => clearInterval(loop);
  }, [isAuthed]); */

  if (isAuthed === undefined) return <Loading />;

  return isAuthed ? (
    <Container>
      <Nav />
      <Content>
        <Routes />
      </Content>
    </Container>
  ) : (
    <SighIn />
  );
};

export default App;
