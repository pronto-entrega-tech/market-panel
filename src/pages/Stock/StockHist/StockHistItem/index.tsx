import { ProductActivity } from '~/core/types';
import { formatDateTime } from '~/functions/format';
import { moneyString } from '~/functions/money';
import { Container, Code, Description, Date, Edit } from './styles';

function StockHistItem({ activity }: { activity: ProductActivity }) {
  const alterationMsg = (() => {
    const { action, new_price, new_stock } = activity;
    const price = moneyString(new_price ?? '');

    if (action === 'CREATE') {
      const stock = new_stock ? ` e Estoque ${new_stock}` : '';

      return `Produto criado - Preço ${price}${stock}`;
    }

    if (action === 'UPDATE') {
      if (new_price && new_stock)
        return `Preço ${price} e estoque ${new_stock}`;
      if (new_price) return `Preço alterado para ${price}`;
      if (new_stock) return `Estoque alterado para ${new_stock}`;
    }

    if (action === 'DELETE') return 'Produto removido';

    return '';
  })();

  return (
    <Container>
      <Date>{formatDateTime(activity.occurred_at)}</Date>
      <Code>{activity.product_code}</Code>
      <Description>{activity.item_name}</Description>
      <Edit>{alterationMsg}</Edit>
    </Container>
  );
}

export default StockHistItem;
