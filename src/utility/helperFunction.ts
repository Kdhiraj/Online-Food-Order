export const generateRandomId = () => {
  return `${Math.floor(Math.random() * 89999) + 1000}`;
};
