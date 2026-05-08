export type UserType = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: "USER" | "ADMIN";
};
