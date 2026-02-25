/**
 * Представляет валюту в SalesDrive.
 */
export interface ICurrency {
  code: string;
  rate: number;
}

/**
 * Успешный ответ получения валют
 * @see https://api.salesdrive.me/api/docs/#/currency/currency-list
 */
export interface IGetCurrenciesResponse {
  baseCurrency?: string;
  currencies?: (ICurrency & {
    abbreviation?: string;
  })[];
}

/**
 * Ответ обновления валют
 * @see https://api.salesdrive.me/api/docs/#/currency/currency-update
 */
export interface ICurrenciesResponse {
  status: "error" | "success";
  message?: string;
}

/**
 * Представляет способ оплаты в SalesDrive.
 */
export interface IPaymentMethods {
  id: number;
  name: string;
  parameter: string;
}

/**
 * Ошибка ответа способов оплаты
 * @see https://api.salesdrive.me/api/docs/#/order-field/payment-method-list
 */
export interface IPaymentMethodsErrorResponse {
  status: string;
  message?: string;
}

/**
 * Успешный ответ способов оплаты
 * @see https://api.salesdrive.me/api/docs/#/order-field/payment-method-list
 */
export interface IPaymentMethodsResponse {
  success: boolean;
  data: IPaymentMethods[];
}

/**
 * Тип ответа для методов оплаты (успех или ошибка).
 */
export type TPaymentMethodsResponse = IPaymentMethodsResponse | IPaymentMethodsErrorResponse;


/**
 * Представляет способ доставки в SalesDrive.
 */
export interface IDeliveryMethod {
  id: number;
  name: string;
  parameter: string;
}

/**
 * Успешный ответ способов доставки
 * @see https://api.salesdrive.me/api/docs/#/order-field/delivery-method-list
 */
export interface IDeliveryMethodsResponse {
  success: boolean;
  data: IDeliveryMethod[];
}

/**
 * Ошибка ответа способов доставки
 * @see https://api.salesdrive.me/api/docs/#/order-field/delivery-method-list
 */
export interface IDeliveryMethodsErrorResponse {
  status: string;
  message?: string;
}

/**
 * Тип ответа для методов доставки (успех или ошибка).
 */
export type TDeliveryMethodsResponse = IDeliveryMethodsResponse | IDeliveryMethodsErrorResponse;


/**
 * Представляет статус заявки в SalesDrive.
 */
export interface IStatus {
  id: number;
  name: string;
  type: 1 | 2 | 3 | 4;
}

/**
 * Успешный ответ статусов
 * @see https://api.salesdrive.me/api/docs/#/order-field/status-list
 */
export interface IStatusesResponse {
  success: boolean;
  data: IStatus[];
}

/**
 * Ошибка ответа статусов
 * @see https://api.salesdrive.me/api/docs/#/order-field/status-list
 */
export interface IStatusesErrorResponse {
  status: string;
  message?: string;
}

/**
 * Тип ответа для статусов (успех или ошибка).
 */
export type TStatusesResponse = IStatusesResponse | IStatusesErrorResponse;