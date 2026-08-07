export function formatMoneyCompact(value: number) {
  if (!value) {
    return "R$ 0";
  }

  const absolute = Math.abs(value);

  // MILHÃO
  if (absolute >= 1000000) {
    const numero = (value / 1000000).toFixed(1).replace(".", ",");

    return `R$ ${numero}M`;
  }

  // MIL
  if (absolute >= 1000) {
    const numero = (value / 1000).toFixed(1).replace(".", ",");

    return `R$ ${numero}K`;
  }

  return "R$ " + value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function formatMoney(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatPercent(value: number) {
  return value.toFixed(1).replace(".", ",") + "%";
}

export function formatDate(date: string) {
  if (!date) {
    return "-";
  }

  return new Date(date).toLocaleDateString("pt-BR");
}
