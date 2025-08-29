import { BaseOrderParams } from "./BaseOrderParams";

export type UpdateOrderParams = BaseOrderParams & {
  idCommande: string;
  reference: string;
  date: string;
  onSuccess?: () => void;
  setLoading?: (value: boolean) => void;
};
