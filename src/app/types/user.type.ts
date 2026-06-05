export type UserType = {
  id: number;
  name: string;
  lastname: string
  email: string;
  phone: string;
  address: string;
  role: "USER" | "ADMIN";
};
