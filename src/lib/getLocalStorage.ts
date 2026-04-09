export const getLocalStorageItem = (name: string): string => {
  const item = localStorage.getItem(name);
  if (!item) return "";
  return item;
};
