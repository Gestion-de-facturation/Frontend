import { BaseOrderParams } from "./BaseOrderParams";

export type UpdateOrderParams = BaseOrderParams & {
  idCommande: string;
  date: string;
};
