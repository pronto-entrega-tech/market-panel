import { SetProductDto, ProductActivity } from '~/core/types';
import { moneyNumber } from '~/functions/money';
import { omit } from '~/functions/omit';
import { transformProduct } from '~/functions/transform';
import utils from './utils';

const { apiCall, authHeader } = utils;

const createProductBody = (product: SetProductDto) => {
  const { price, unit_weight, ...dto } = omit(product, 'city_slug', 'item_id');

  return {
    ...dto,
    market_price: moneyNumber(price),
    unit_weight: moneyNumber(unit_weight),
  };
};

export default {
  async create(product: SetProductDto) {
    await apiCall.post(
      `/items`,
      createProductBody(product),
      await authHeader(),
    );
  },

  async findMany(query?: string) {
    const { data } = await apiCall.get<[]>(`/items`, {
      params: { query },
      ...(await authHeader()),
    });
    return data.map(transformProduct);
  },

  async update(product: SetProductDto) {
    await apiCall.patch(
      `/items/${product.city_slug}/${product.item_id}`,
      createProductBody(product),
      await authHeader(),
    );
  },

  async findActivities(query?: string): Promise<ProductActivity[]> {
    const { data } = await apiCall.get('/items/activities', {
      params: { query },
      ...(await authHeader()),
    });
    return data;
  },
};
