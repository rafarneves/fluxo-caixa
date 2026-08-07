export function formatCompact(value: number) {
  if (value >= 1000000) {
    return "R$ " + (value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1).replace(".", ",") + "M";
  }

  if (value >= 1000) {
    return "R$ " + (value / 1000).toFixed(value % 1000 === 0 ? 0 : 1).replace(".", ",") + "K";
  }

  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}
