import { IProduct, IUnit } from "./products";


/**
 * Базовый интерфейс документа.
 */
export interface IBaseDocument {
  id: number;
  number?: string;
  date: string;
  userId: number;
  totalSum: number;
  createdAt: string;
  updatedAt: string;
  nds?: number;
  payerTypeId: number;
  comment: string | null;
  responsibleId: number;
  token?: string;
  documentItems?: IDocumentItem[];
  organization: any; // уточнить
  contact: any; // уточнить
  counterparty: any;
  order: any;
}

/**
 * Счет (Invoice).
 * @see https://api.salesdrive.me/api/docs/#/document/invoice-list
 */
export interface IInvoice extends IBaseDocument {
  maxPaymentDate: string;
  organizationAccount: any;
  contract: any;
  payed: number;
}

/**
 * Расходная накладная (Sales Invoice).
 * @see https://api.salesdrive.me/api/docs/#/document/sales-invoice-list
 */
export interface ISalesInvoice extends IBaseDocument {
  addressDelivery: string;
  base: string;
  organizationAccount: any;
}

/**
 * Кассовый ордер (Cash Order).
 * @see https://api.salesdrive.me/api/docs/#/document/cash-order-list
 */
export interface ICashOrder extends IBaseDocument {
  type: "incoming" | "outcoming";
  contract: any;
  invoice: any;
}

/**
 * Приход товара (Arrival Product).
 * @see https://api.salesdrive.me/api/docs/#/document/arrival-product-list
 */
export interface IArrivalProduct extends IBaseDocument {
  totalCount: number;
  formId: number;
  stockId: number;
  sourceStockId: number;
  type: string;
  inventoryId: number;
}

/**
 * Акт выполненных работ (Act).
 * @see https://api.salesdrive.me/api/docs/#/document/act-list
 */
export interface IAct extends IBaseDocument {
  contract: any;
  invoice: any;
  organizationAccount: any;
}

/**
 * Договор (Contract).
 * @see https://api.salesdrive.me/api/docs/#/document/contract-list
 */
export interface IContract extends IBaseDocument {
  organizationAccount: any;
}

/**
 * Чек (Check).
 * @see https://api.salesdrive.me/api/docs/#/document/check-list
 */
export interface ICheck extends IBaseDocument {
  fiscalizationUserId: number;
  fiscalizationStatus: string;
  documentPaymentTypeId: number;
  type: number;
  fiscalCode: string;
  return: any;
  hasReturn: any;
  cashier: any;
  cashRegister: any;
  discount: number;
}

/**
 * Объединение всех типов документов.
 */
export type IDocument =
  | IInvoice
  | ISalesInvoice
  | ICashOrder
  | IArrivalProduct
  | IAct
  | IContract
  | ICheck;

/**
 * Параметры для получения списка документов.
 */
export type IDocumentListParams = import("./shared").IFilterableListParams;

/**
 * Ответ API со списком документов.
 */
export interface IDocumentListResponse<T = IDocument> {
  status: string;
  data: T[];
  pagination: {
    currentPage: number;
    pageCount: number;
    perPage: number;
  };
  totals: {
    count: number;
    sum: number;
    writeOffSum?: number;
  };
}

/**
 * Позиция в документе (товар/услуга).
 */
export interface IDocumentItem {
  description?: string;
  price: string;
  count: string;
  percentDiscount?: number;
  discount?: number;
  product: IProduct;
  unit?: IUnit;
}
