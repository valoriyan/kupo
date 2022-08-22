export const formatStat = (stat: number | undefined) => {
  if (!stat) return 0;
  return stat >= 1000 ? (stat / 1000).toFixed(1) + "k" : stat;
};
