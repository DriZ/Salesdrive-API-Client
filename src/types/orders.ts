import { ICreateOrderProductFields, IProductUpdateFields } from ".";

/**
 * Представляет продукт в составе заявки.
 */
export interface IOrderProduct {
  productId: number;
  text: string; // Название товара
  documentName: string;
  sku: string;
  barcode: string;
  manufacturer: string;
  description: string;
  amount: number;
  price: number;
  discount: number;
  percentDiscount: number;
  commission: number;
  percentCommission: number;
  costPrice: number;
  preSale: number;
  stockId: number;
  uktzed: string;
}

/**
 * Данные доставки (например, Новая Почта).
 */
export interface IOrderDeliveryData {
  senderId: number;
  idEntity: number;
  provider: string;
  type: string;
  parentTrackingNumber: string | null;
  trackingNumber: string;
  trackingNumberRef: string;
  statusCode: number;
  deliveryDateAndTime: string;
  areaName: string;
  regionName: string;
  cityName: string;
  cityType: string;
  cityRef: string;
  settlementRef: string;
  branchNumber: number;
  branchRef: string;
  streetName: string;
  house: string;
  flat: string;
  address: string;
  payer: "Sender" | "Recipient";
  hasPostpay: number;
  postpaySum: number;
  postpayPayer: "Sender" | "Recipient";
  paymentMethod: string;
  cargoType: string;
  ukrposhtaType?: string;
}

/**
 * Представляет клиента, связанного с заявкой.
 */
export interface IOrderContact {
  id: number;
  formId: number;
  version: number;
  active: number;
  lName: string;
  fName: string;
  mName: string;
  phone: string[];
  email: string[];
  counterpartyId: number;
  company: string;
  comment: string;
  userId: number;
  telegram: string;
  instagramNick: string;
  dateOfBirth: string;
  createTime: string;
  leadsCount: number;
  leadsSalesCount: number;
  leadsSalesAmount: number;
}

/**
 * Представляет заявку (order) в SalesDrive.
 */
export interface IOrder {
  id: number;
  formId: number;
  version: number;
  organizationId: number;
  typeId: number;
  statusId: number;
  userId: number;
  externalId: string;
  token: string;
  orderTime: string; // "YYYY-MM-DD HH:mm:ss"
  updateAt: string; // "YYYY-MM-DD HH:mm:ss"
  paymentDate: string; // "YYYY-MM-DD"
  rejectionReason: string | null;
  comment: string;

  // Финансы
  paymentAmount: number;
  costPriceAmount: number;
  shipping_costs: number;
  commissionAmount: number;
  expensesAmount: number;
  profitAmount: number;
  payedAmount: number;
  restPay: number;
  discountAmount: number;

  // Доставка и оплата
  shipping_method: number;
  payment_method: string;
  shipping_address: string;
  ord_delivery_data: IOrderDeliveryData[];

  // Связанные сущности
  products: IOrderProduct[];
  primaryContact: IOrderContact;
  contacts: IOrderContact[];

  // Маркетинг / UTM
  sajt: number;
  utmPage: string;
  utmMedium: string;
  campaignId: number;
  utmSourceFull: string;
  utmSource: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;

  // Документы
  document_ord_check: number;

  // Пользовательские поля могут приходить динамически, но в примере их нет.
  // Оставляем возможность расширения
  [key: string]: any;
}

export type TOrderCreateFields = {
  getResultData: 0 | 1,
  lName: string,
  fName: string,
  mName: string,
  phone: string,
  email: string,
  company: string,
  dateOfBirth: string,
  products: ICreateOrderProductFields[],
  payment_method: string,
  shipping_method: string,
  shipping_address: string,
  comment: string,
  externalId: string,
  sajt: string,
  novaposhta: {
    ServiceType: string,
    payer: string,
    area: string,
    region: string,
    city: string,
    cityNameFormat: string,
    WarehouseNumber: string,
    Street: string,
    BuildingNumber: string,
    Flat: string,
    ttn: string
  },
  ukrposhta: {
    ServiceType: string,
    payer: string,
    type: string,
    city: string,
    WarehouseNumber: string,
    Street: string,
    BuildingNumber: string,
    Flat: string,
    ttn: string
  },
  meest: {
    ServiceType: string,
    payer: string,
    area: string,
    city: string,
    WarehouseNumber: string,
    ttn: string
  },
  rozetka_delivery: {
    WarehouseNumber: string,
    payer: string,
    ttn: string
  },
  con_comment: string,
  con_telegram: string,
  stockId: number,
  commission: number,
  costPrice: number,
  shipping_costs: number,
  organizationId: number,
  salesdrive_manager: number,
  utmSourceFull: string,
  utmSource: string,
  utmMedium: string,
  utmCampaign: string,
  utmContent: string,
  utnTerm: string,
  utmPage: string
  [key: string]: any;
}

/**
 * Представляет поля заявки, которые можно обновлять.
 */
export type TOrderUpdateFields = Partial<
  Pick<
    IOrder,
    | "statusId"
    | "paymentDate"
    | "rejectionReasonId"
    | "salesdrive_manager"
    | "comment"
    | "payment_method"
    | "shipping_method"
    | "shipping_address"
    | "sajt"
    | "lName"
    | "fName"
    | "mName"
    | "phone"
    | "email"
    | "company"
    | "dateOfBirth"
  >
>;

/**
 * Представляет поля заявки, которые можно обновлять.
 * Обновить можно ТТН только одной службы доставки или никакой
 */
export type TUpdatePostTTN =
  | {
    novaposhta: { ttn: string };
    ukrposhta?: never;
    meest?: never;
    rozetka_delivery?: never;
  }
  | {
    novaposhta?: never;
    ukrposhta: { ttn: string };
    meest?: never;
    rozetka_delivery?: never;
  }
  | {
    novaposhta?: never;
    ukrposhta?: never;
    meest: { ttn: string };
    rozetka_delivery?: never;
  }
  | {
    novaposhta?: never;
    ukrposhta?: never;
    meest?: never;
    rozetka_delivery: { ttn: string };
  }
  // Этот вариант соответствует случаю, когда ни один ttn не предоставлен
  | {
    novaposhta?: never;
    ukrposhta?: never;
    meest?: never;
    rozetka_delivery?: never;
  };

/**
 * Представляет поля заявки, которые можно обновлять.
 */
export type TOrderUpdateData = TOrderUpdateFields &
  TUpdatePostTTN & {
    products?: IProductUpdateFields[];
    productsMode?: "replace" | "append";
  };

/**
 * Представляет данные для обновления заявки.
 */
export type TOrderUpdate = (
  | {
    id: number;
    externalId?: never;
  }
  | {
    id?: never;
    externalId: string;
  }
) & {
  data: TOrderUpdateData;
};

/**
 * Представляет ответ после обновления заявки.
 */
export interface IUpdateOrderResponse {
  success?: boolean;
  status?: string;
  message?: string;
}

/**
 * Представляет ответ после создания заявки.
 */
export interface ICreateOrderResponse {
  error?: string;
  success?: boolean;
  data?: {
    orderId: number;
    userId: number;
  }
}

/**
 * Представляет структуру ответа для списка заявок.
 */
export interface IGetOrdersResponse {
  readonly status: string;
  data: IOrder[];
  readonly meta: {
    fields: Record<string, any>;
  };
  readonly pagination: {
    currentPage: number;
    pageCount: number;
    perPage: number;
  };
  readonly totals: {
    count: number;
    paymentAmount: number;
    commission: number;
    expenses: number;
  };
  readonly message?: string;
}

/**
 * Представляет структуру ответа для добавления заметки.
 */
export interface IAddNoteResponse {
  success: boolean;
  message?: string;
  data?: {
    noteId: number;
  };
}

/**
 * Фильтр по айди статуса или Не удаленные (по умолчанию) или Все
 */
export type TStatusIdFilter = number | "__NOTDELETED__" | "__ALL__";

/**
 * Строка даты в формате YYYY-MM-DD.
 */
export type DateYMD =
  `${number}${number}${number}${number}-${number}${number}-${number}${number}`;

/**
 * Строка даты и времени в формате YYYY-MM-DD HH:mm:ss.
 */
export type DateTimeYMDHMS =
  `${DateYMD} ${number}${number}:${number}${number}:${number}${number}`;

/**
 * Тип для полей фильтрации по дате.
 * Позволяет передавать дату (YYYY-MM-DD) или дату со временем (YYYY-MM-DD HH:mm:ss).
 * Использование (string & {}) сохраняет автодополнение для литералов, но разрешает любые строки.
 */
export type SalesDriveDate = Date | DateYMD | DateTimeYMDHMS | `${number}-${string}-${string} ${string}:${string}:${string}` | (string & object);
export type FormatedSalesDriveDate = DateYMD | DateTimeYMDHMS | `${number}-${string}-${string} ${string}:${string}:${string}`;

/**
 * Представляет диапазон дат для фильтрации.
 */
export interface IDateFilter {
  from?: SalesDriveDate;
  to?: SalesDriveDate;
}

/**
 * Utility-тип для получения ключей из T, значение которых соответствует типу V.
 */
export type TKeysMatching<T, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];

/**
 * Параметры для фильтрации и пагинации списка заявок.
 * @see https://api.salesdrive.me/api/docs/#/order/order-list
 */
export interface IGetOrdersParams {
  page?: number;
  limit?: number;
  filter?: OrderParamsFilter;
}

/**
 * Базовый тип для параметров фильтрации заявок.
 */
export interface OrderParamsFilter {
  statusId?: TStatusIdFilter | TStatusIdFilter[];
  id?: {
    from?: number;
    to?: number;
  };
  setStatusId?: number[];
  updateAt?: IDateFilter;
  orderTime?: IDateFilter;
  setStatusTime?: IDateFilter;
}

/**
 * Выборка из параметров фильтрации заявок, где есть фильтры дат
 */
export type TDatedOrderParamsFilter = Required<
  Pick<OrderParamsFilter, "updateAt" | "orderTime" | "setStatusTime">
>;
