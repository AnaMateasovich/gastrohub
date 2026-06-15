export type UserType = {
  id: string;
  name: string;
  lastname: string
  email: string;
  phone: string;
  address: string;
  role: "USER" | "ADMIN";
};
