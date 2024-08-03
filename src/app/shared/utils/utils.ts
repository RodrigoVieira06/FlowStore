export const isInteger = (str: string): boolean => {
  const num = parseInt(str, 10);
  return !isNaN(num) && num.toString() === str;
}

export const formatCnpj = (cnpj: string): string => {
  if (!cnpj) return '';

  cnpj = cnpj.replace(/\D/g, '');

  if (cnpj.length !== 14) return cnpj;

  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    '$1.$2.$3/$4-$5');
}
