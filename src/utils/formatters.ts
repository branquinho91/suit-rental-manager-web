export function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function formatCpf(cpf: string) {
  const digits = cpf.replace(/\D/g, "");

  if (digits.length !== 11) return cpf;

  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 11) {
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  if (digits.length === 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }

  return phone;
}

export function formatZipCode(zipCode: string) {
  const digits = zipCode.replace(/\D/g, "");

  if (digits.length !== 8) return zipCode;

  return digits.replace(/(\d{5})(\d{3})/, "$1-$2");
}

export function formatCurrency(value: number) {
  const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return currencyFormatter.format(value);
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(`${date}T00:00:00`));
}
