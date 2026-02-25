import { IDateFilter } from "./orders";

/**
 * Общие параметры для фильтруемых списков (документы, платежи и т.д.).
 */
export interface IFilterableListParams {
  page?: number;
  limit?: number;
  filter?: {
    updatedAt?: IDateFilter;
    date?: IDateFilter;
    createdAt?: IDateFilter;
    organizationId?: number[];
    type?: "all" | "incoming" | "outcoming";
  };
}
