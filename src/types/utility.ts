/**
 * Представляет валюту в SalesDrive.
 */
export interface ICurrency {
  id: number;
  name: string;
  shortName: string;
  code: string;
  rate: number;
  isBase: boolean;
}

/**
 * Представляет способ оплаты в SalesDrive.
 */
export interface IPaymentMethod {
  id: number;
  name: string;
  active: boolean;
}

/**
 * Представляет способ доставки в SalesDrive.
 */
export interface IDeliveryMethod {
  id: number;
  name: string;
  active: boolean;
}

/**
 * Представляет статус заявки в SalesDrive.
 */
export interface IStatus {
  id: number;
  name: string;
  color: string;
  isSystem: boolean;
  isFinish: boolean;
  isFail: boolean;
}
