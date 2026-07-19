export const formatDate = (someDate: string | Date) => {
  const date = new Date(someDate);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatDateShort = (someDate: string | Date) => {
  const date = new Date(someDate);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
