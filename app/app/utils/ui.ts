export const formatAddress = (address: string) => {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

export const formatNumber = (number: number, denominator: number) => {
  return number / 10 ** denominator;
};
