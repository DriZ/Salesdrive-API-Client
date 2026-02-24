import { IDateFilter } from "./orders";
import { IProduct, IUnit } from "./products";

export interface IDocument {
  id: number;
  number: string;
  date: string;
  payerTypeId: number;
  maxPaymentDate: string;
  userId: number;
  totalSum: number;
  createdAt: string;
  updatedAt: string;
  nds: number;
  comment: string;
  responsibleId: number;
  token: string;
  documentItems: any[]; // уточнить
  organizationAccount: any; // уточнить
  organization: any; // уточнить
  contact: any; // уточнить
  counterparty: any;
  contract: any;
  order: any;
  payed: number;
}

export interface IGetInvoicesListParams {
  page?: number;
  limit?: number;
  filter?: {
    updatedAt?: IDateFilter;
    date?: IDateFilter;
    createdAt?: IDateFilter;
    organizationId?: number[];
  };
}

export interface IGetInvoicesListResponse {
  status: string;
  data: IDocument[];
  pagination: {
    currentPage: number;
    pageCount: number;
    perPage: number;
  };
  totals: {
    count: number;
    sum: number;
  };
}

export interface IDocumentItem {
  description: string;
  price: string;
  count: string;
  percentDiscount: number;
  discount: number;
  product: IProduct;
  unit: IUnit;
}
