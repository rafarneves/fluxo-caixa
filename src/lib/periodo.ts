export type TipoPeriodo =
  | "hoje"
  | "semana"
  | "mes"
  | "30dias"
  | "ano"
  | "personalizado";

export type Periodo = {
  inicio: Date;
  fim: Date;
};

export function obterPeriodo(
  periodo: string
): Periodo {
  const hoje = new Date();

  let inicio = new Date(hoje);
  let fim = new Date(hoje);

  switch (periodo as TipoPeriodo) {
    case "hoje":
      inicio.setHours(0, 0, 0, 0);
      fim.setHours(23, 59, 59, 999);
      break;

    case "semana": {
      const diaSemana = hoje.getDay();
      const diferenca = diaSemana === 0 ? 6 : diaSemana - 1;

      inicio = new Date(hoje);
      inicio.setDate(hoje.getDate() - diferenca);
      inicio.setHours(0, 0, 0, 0);

      fim = new Date();
      fim.setHours(23, 59, 59, 999);

      break;
    }

    case "30dias":
      inicio = new Date(hoje);
      inicio.setDate(hoje.getDate() - 30);
      inicio.setHours(0, 0, 0, 0);

      fim = new Date();
      fim.setHours(23, 59, 59, 999);
      break;

    case "ano":
      inicio = new Date(
        hoje.getFullYear(),
        0,
        1
      );
      inicio.setHours(0, 0, 0, 0);

      fim = new Date();
      fim.setHours(23, 59, 59, 999);
      break;

    case "mes":
    default:
      inicio = new Date(
        hoje.getFullYear(),
        hoje.getMonth(),
        1
      );
      inicio.setHours(0, 0, 0, 0);

      fim = new Date();
      fim.setHours(23, 59, 59, 999);
      break;
  }

  return {
    inicio,
    fim,
  };
}