export type RegisterType = {
  companyName: string;
  slug: string;
  ownerName: string;
  ownerEmail: string;
  ownerPassword: string;
  ownerPasswordConfirm: string;
  plan: "FREE" | "STARTER" | "PRO";
  acceptTerms: boolean;
};