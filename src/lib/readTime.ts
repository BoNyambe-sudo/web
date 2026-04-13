export const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]+>/g, ""); // Remove HTML tags
  const wordCount = text.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};