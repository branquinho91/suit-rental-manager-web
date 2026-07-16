export interface Address {
  addressStreet: string;
  addressNumber: string;
  addressComplement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Customer {
  id: number;
  name: string;
  cpf: string;
  email: string;
  phoneNumber: string;
  phoneNumber2?: string | null;
  address: Address;
}

export type CreateCustomerRequest = Omit<Customer, "id">;
export type UpdateCustomerRequest = Omit<Customer, "id">;
