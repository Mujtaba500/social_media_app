export const filterErrorMessage = (errorMessage: string) => {
  const customErrMessage = errorMessage
    .split("")
    .filter((char) => {
      let result = char.match(/^[a-z0-9A-Z ]+$/);
      return result;
    })
    .join("");
  return customErrMessage;
};
