import { CheckAll as ConfirmAllIcon } from "mdi-material-ui";
import { Container, HeaderLine, Title, ConfirmAll } from "./styles";
import Loading from "~/components/Loading";
import StockEditItem from "./StockEditItem";
import { Central } from "~/components/Central/styles";
import { FixedSizeList } from "react-window";
import { useWindowSize } from "~/hooks/useWindowSize";
import { componentWidth } from "~/constants/componentWidths";
import { useStockEditContext } from "~/contexts/StockEditContext";

const ConfirmAllButton = () => {
  const { confirmAll } = useStockEditContext();

  return (
    <ConfirmAll endIcon={<ConfirmAllIcon />} onClick={confirmAll}>
      Confirmar todos
    </ConfirmAll>
  );
};

function StockEdit() {
  const { keys, isLoading } = useStockEditContext();
  const { height, width } = useWindowSize();

  if (isLoading) return <Loading />;
  if (!keys.length) return <Central>Nenhum produto adicionado ainda</Central>;

  return (
    <Container>
      <HeaderLine>
        <Title>{keys.length} produtos selecionados</Title>
        <ConfirmAllButton />
      </HeaderLine>
      <FixedSizeList
        height={height - 52.5}
        width={
          width -
          componentWidth.nav -
          componentWidth.stockSelect -
          componentWidth.stockHist
        }
        itemCount={keys.length}
        itemSize={189}
      >
        {({ index, style }) => {
          const key = keys[index]!;
          return (
            <div key={key} style={style}>
              <StockEditItem productKey={key} />
            </div>
          );
        }}
      </FixedSizeList>
    </Container>
  );
}

export default StockEdit;
