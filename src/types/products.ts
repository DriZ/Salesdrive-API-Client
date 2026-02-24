import { IOrderProduct } from ".";

/**
 * Представляет продукт в SalesDrive.
 */
export interface IProduct {
  id: number;
  formId: number;
  name: string;
  nameTranslate: string;
  parameter: string;
  manufacturer: string;
  sku: string;
  barcode: string;
  documentName: string;
}

/**
 * Представляет доступные поля для обновления продукта в составе заявки.
 */
export type IProductUpdateFields = Pick<
  IOrderProduct,
  | "productId"
  | "text"
  | "costPrice"
  | "amount"
  | "description"
  | "discount"
  | "sku"
  | "commission"
  | "stockId"
>;

/**
 * Представляет категорию в SalesDrive.
 */
export interface ICategory {
  id: number;
  name: string;
}

/**
 * Представляет единицу измерения в SalesDrive.
 */
export interface IUnit {
  id: number;
  title: string;
}
