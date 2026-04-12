export const formatDate = (someDate: string | Date) => {
  const date = new Date(someDate);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
