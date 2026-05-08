export const getHash = (str: string) => {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  return Math.abs(hash);
};

export const userColors = [
  "#6BA368", // verde
  "#8FB996", // verde claro
  "#CFE0C3", // muy suave
  "#A3B18A", // oliva
  "#DAD7CD", // beige
  "#B7B7A4", // gris cálido
];
