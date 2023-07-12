import { formatOrderId } from '~/functions/format';

export const notifyMsg = {
  orderCompleted: (id: string) => `Pedido ${formatOrderId(id)} concluído`,
  orderCanceled: (id: string) => `Pedido ${formatOrderId(id)} cancelado`,
  msgReceded: (id: string) =>
    `Mensagem recebida no pedido ${formatOrderId(id)}`,
};
