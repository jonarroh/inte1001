// signOut, useSession

export interface Direccion {
  id: number;
  calle: string;
  numeroExterior: number;
  estatus: "Activo";
  colonia: string;
  ciudad: string;
  estado: string;
  pais: string;
  codigoPostal: string;
  userId: number;
}

export interface CreditCard {
  id: number;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolderName: string;
  estatus: "Activo";
  userId: number;
}

export interface User {
  id: number;
  name: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  token: string;
  direcciones?: Direccion[];
  creditCards?: CreditCard[];
}


const signOut = async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
}

const useSession = () => {
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');
  if (!token || !userString) return { token: null, user: null };

  const user = JSON.parse(userString) as User;

  return { token, user  };
}

export { signOut, useSession };