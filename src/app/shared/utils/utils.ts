export const isInteger = (str: string): boolean => {
  const num = parseInt(str, 10);
  return !isNaN(num) && num.toString() === str;
}
