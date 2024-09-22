import { Delete as DeleteIcon, Check as ConfirmIcon } from "mdi-material-ui";
import { moneyString } from "~/functions/money";
import { DiscountType } from "~/core/types";
import {
  Container,
  Code,
  Price,
  Quantity,
  UnitWeightLabel,
  UnitWeightInput,
  PriceLabel,
  PriceInput,
  QuantityLabel,
  QuantityInput,
  DiscountTypeLabel,
  DiscountTypeSelect,
  DiscountMaxLabel,
  DiscountMaxInput,
  Discount1Label,
  Discount1Input,
  Discount2Label,
  Discount2Input,
  Description,
  ConfirmButton,
  DeleteButton,
} from "./styles";
import { InputAdornment, MenuItem } from "@mui/material";
import { digitsMask, decimalMask } from "~/functions/mask";
import {
  StockState,
  useStockEditContext,
  useStockEditItemContext,
} from "~/contexts/StockEditContext";
import { omit } from "~/functions/omit";

const hasADefinedProp = (o: Record<string, unknown>) =>
  Object.values(o).reduce<boolean>((_, v) => !!v, false);

const getDiscountLabels = (v: DiscountType | ""): [string, string] =>
  ({
    DISCOUNT_VALUE: ["Valor promocional", ""],
    DISCOUNT_PERCENT: ["Porcentagem do desconto", ""],
    DISCOUNT_PERCENT_ON_SECOND: [
      "Porcentagem do desconto",
      "Quantidade mínima",
    ],
    ONE_FREE: ["Quantidade mínima", "Quantidade grátis"],
  })[v] ?? ["", ""];

function StockEditItem({ productKey }: { productKey: string }) {
  const { unselectStock, updateStock } = useStockEditContext();

  const { product, state, discountState, confirm } =
    useStockEditItemContext(productKey);

  const setState = (update: Partial<StockState["state"]>) =>
    updateStock(product.key, (v) => ({
      ...v,
      state: { ...state, ...update },
    }));

  const discount_type = state.discount_type ?? product.discount_type ?? "";
  const discount = discountState[discount_type];

  const setDiscountV = (k: keyof StockState["discountState"][""], v: string) =>
    updateStock(product.key, (stock) => {
      const newStock = { ...stock };
      newStock.discountState[discount_type][k].value = v;
      return newStock;
    });

  const discountLabels = getDiscountLabels(discount_type);
  const isValueDiscount = discount_type === "DISCOUNT_VALUE";
  const isPercentDiscount = discount_type.startsWith("DISCOUNT_PERCENT");
  const discount1Mask = isValueDiscount ? decimalMask : digitsMask;
  const discount1Format = (v: string) =>
    isValueDiscount ? moneyString(v, "") : v;

  const canConfirm =
    hasADefinedProp(omit(state, "discount_type")) ||
    (state.discount_type !== undefined &&
      state.discount_type !== product.discount_type);

  return (
    <Container>
      <Description>{product.description}</Description>
      {product.isCommodity && (
        <>
          <UnitWeightLabel>Peso unitário</UnitWeightLabel>
          <UnitWeightInput
            value={state.unit_weight}
            onChange={({ target: { value } }) =>
              setState({
                unit_weight: value && decimalMask(value, 3),
              })
            }
            placeholder={`${product.unit_weight ?? "0,000"}`}
            InputProps={{
              endAdornment: <InputAdornment position="end">Kg</InputAdornment>,
            }}
          />
        </>
      )}
      <Code>{product.code}</Code>
      <Price>{moneyString(product.price)}</Price>
      <Quantity>Qtd. {product.stock}</Quantity>
      <PriceLabel>Novo preço</PriceLabel>
      <PriceInput
        value={state.price}
        onChange={({ target: { value } }) =>
          setState({ price: value && decimalMask(value) })
        }
        placeholder={moneyString(product.price, "")}
        InputProps={{
          startAdornment: <InputAdornment position="start">R$</InputAdornment>,
        }}
      />
      <QuantityLabel>Adicionar</QuantityLabel>
      <QuantityInput
        value={state.stock}
        onChange={({ target: { value } }) =>
          setState({ stock: value && digitsMask(value) })
        }
        placeholder={`${product.stock}`}
      />
      <DiscountTypeLabel>Tipo de desconto</DiscountTypeLabel>
      <DiscountTypeSelect
        value={discount_type}
        onChange={({ target: { value } }) =>
          setState({ discount_type: value as any })
        }
      >
        <MenuItem value="">Nenhum</MenuItem>
        <MenuItem value="DISCOUNT_VALUE">Valor promocional</MenuItem>
        <MenuItem value="DISCOUNT_PERCENT">Porcentagem</MenuItem>
        <MenuItem value="DISCOUNT_PERCENT_ON_SECOND">
          Porcentagem no segundo
        </MenuItem>
        <MenuItem value="ONE_FREE">Pague x, Leve y</MenuItem>
      </DiscountTypeSelect>
      {discount_type && (
        <>
          <DiscountMaxLabel>Máximo por cliente</DiscountMaxLabel>
          <DiscountMaxInput
            value={state.discount_max_per_client ?? ""}
            onChange={({ target: { value } }) =>
              setState({
                discount_max_per_client: value ? +digitsMask(value) : undefined,
              })
            }
            placeholder={`${product.discount_max_per_client ?? "Ilimitada"}`}
          />
          <Discount1Label>{discountLabels[0]}</Discount1Label>
          <Discount1Input
            value={
              discount.v1.value ? discount1Mask(`${discount.v1.value}`) : ""
            }
            onChange={({ target: { value } }) =>
              setDiscountV("v1", value && discount1Mask(value))
            }
            placeholder={discount1Format(discount.v1.placeholder)}
            InputProps={{
              startAdornment: isValueDiscount ? (
                <InputAdornment position="start">R$</InputAdornment>
              ) : null,
              endAdornment: isPercentDiscount ? (
                <InputAdornment position="end">%</InputAdornment>
              ) : null,
            }}
          />
        </>
      )}
      {discountLabels[1] && (
        <>
          <Discount2Label>{discountLabels[1]}</Discount2Label>
          <Discount2Input
            value={discount.v2.value ?? ""}
            onChange={({ target: { value } }) =>
              setDiscountV("v2", value && digitsMask(value))
            }
            placeholder={discount.v2.placeholder}
          />
        </>
      )}
      <ConfirmButton
        disabled={!canConfirm}
        onClick={() => canConfirm && confirm()}
      >
        <ConfirmIcon />
      </ConfirmButton>
      <DeleteButton onClick={() => unselectStock(product.key)}>
        <DeleteIcon />
      </DeleteButton>
    </Container>
  );
}

export default StockEditItem;
