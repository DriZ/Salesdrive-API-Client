/**
 * Детализация платежа (разбивка суммы по документам или заявкам).
 */
export interface IPaymentBreakdown {
  sum: number;
  invoice?: {
    id: number;
    number: string;
    date: string;
  };
  order?: {
    id: number;
    formId: number;
  };
}

/**
 * Представляет платеж в SalesDrive.
 * @see https://api.salesdrive.me/api/docs/#/document/payment-list
 */
export interface IPayment {
  id: number;
  date: string;
  userId: number;
  comment: string;
  sum: number;
  purpose: string | null;
  nds: number;
  payerTypeId: number;
  createdAt: string;
  updatedAt: string;
  responsibleId: number;
  type: "incoming" | "outcoming";
  integrationTypeId: number | null;
  organizationAccount: any;
  organization: any;
  paymentBreakdown: IPaymentBreakdown[];
  contact: any;
  counterparty: any;
}

/**
 * Параметры для получения списка платежей.
 * @see https://api.salesdrive.me/api/docs/#/document/payment-list
 */
export type IPaymentListParams = import("./shared").IFilterableListParams;

/**
 * Ответ API со списком платежей.
 * @see https://api.salesdrive.me/api/docs/#/document/payment-list
 */
export interface IPaymentListResponse {
  status: string;
  data: IPayment[];
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

/**
 * Успешный ответ создания платежа.
 * @see https://api.salesdrive.me/api/docs/#/payment/payment-create
 */
export interface ICreatePaymentResponse {
  success: boolean;
  data: {
    paymentId: number;
  };
}

/**
 * Ошибка при создании платежа.
 * @see https://api.salesdrive.me/api/docs/#/payment/payment-create
 */
export interface ICreatePaymentErrorResponse {
  status: string;
  message: string;
}

/**
 * Тип ответа создания платежа (успех или ошибка).
 */
export type TCreatePaymentResponse = ICreatePaymentResponse | ICreatePaymentErrorResponse;

/**
 * Параметры для создания нового платежа.
 * @see https://api.salesdrive.me/api/docs/#/payment/payment-create
 */
export interface ICreatePaymentParams {
  organizationId: number;
  datetime?: string;
  timezone?: string;
  accountNumber: string;
  sum: number;
  description?: string;
  counterpartyName?: string;
  counterpartyCode?: string;
  counterpartyAccountNumber?: string;
  counterpartyBankName?: string;
  uniqueId?: string;
  orderId: number;
  orderExternalId?: number;
  formId: number;
  autoAttachToOrderType?: "lastname_and_sum" | "sum";
  payerLastName?: string;
}