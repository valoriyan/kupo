export const isSuccessfulStatus = (status: number) => {
  return status >= 200 && status < 300;
};
