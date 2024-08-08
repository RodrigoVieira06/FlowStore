export const cnpjValidator = (): string | RegExp => {
  return /^(\d{3})\.?(\d{3})\.?(\d{3})\-?(\d{2}$)$|^(\d{2})\.?(\d{3})\.?(\d{3})\/?([0-1]{4})\-?(\d{2})$/;
}

export const cepValidator = (): string | RegExp => {
  return /^\d{8}$/;
}
