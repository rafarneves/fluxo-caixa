export function formatCurrencyCompact(value: number) {
  if (value >= 1000000) {
    return `R$ ${(value / 1000000).toFixed(1)}M`;
  }

  if (value >= 1000) {
    return `R$ ${(value / 1000).toFixed(1)}k`;
  }

  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
