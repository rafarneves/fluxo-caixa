export function formatMoneyCompact(
    value: number
  ) {
  
    if (!value) {
      return "R$ 0";
    }
  
  
    // Milhões
    // Ex: R$ 2M | R$ 2,5M
    if (value >= 1000000) {
  
      return (
        "R$ " +
        (value / 1000000)
          .toFixed(1)
          .replace(".0", "")
          .replace(".", ",")
        +
        "M"
      );
  
    }
  
  
  
    // Milhares
    // Ex: R$ 2K | R$ 2,5K | R$ 250K
    if (value >= 1000) {
  
      return (
        "R$ " +
        (value / 1000)
          .toFixed(1)
          .replace(".0", "")
          .replace(".", ",")
        +
        "K"
      );
  
    }
  
  
  
    // Valores menores que mil
    return (
      "R$ " +
      value
        .toFixed(0)
        .replace(
          /\B(?=(\d{3})+(?!\d))/g,
          "."
        )
    );
  
  }
  
  
  
  
  
  export function formatMoney(
    value: number
  ) {
  
    return value.toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    );
  
  }
  
  
  
  
  
  export function formatPercent(
    value: number
  ) {
  
    return (
      value
        .toFixed(1)
        .replace(".", ",")
      +
      "%"
    );
  
  }
  
  
  
  
  
  export function formatDate(
    date: string
  ) {
  
    if (!date) {
      return "-";
    }
  
  
    return new Date(date)
      .toLocaleDateString(
        "pt-BR"
      );
  
  }