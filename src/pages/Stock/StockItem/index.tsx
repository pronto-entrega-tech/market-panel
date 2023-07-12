import { Plus as AddIcon } from 'mdi-material-ui';
import { moneyString } from '~/functions/money';
import { ProductType } from '~/core/types';
import { Container, Code, Price, Quantity, Description, Add } from './styles';

function StockItem({
  product,
  onAdd: add,
  disabled,
}: {
  product: ProductType;
  onAdd: () => void;
  disabled: boolean;
}) {
  return (
    <Container>
      <Code>{product.code}</Code>
      <Price>{moneyString(product.price)}</Price>
      <Quantity>Qtd. {product.stock}</Quantity>
      <Description>{product.description}</Description>
      <Add disabled={disabled} onClick={add}>
        <AddIcon />
      </Add>
    </Container>
  );
}

export default StockItem;
