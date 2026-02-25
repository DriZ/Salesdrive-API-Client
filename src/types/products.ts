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

export interface ICreateOrderProductFields {
  id: string,
  name: string,
  costPerItem: number,
  amount: number,
  description: string,
  discount: string,
  sku: string,
  commission: string
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

export interface IProductDiscount {
  value: string;
  date_start: string;
  date_end: string;
}

export interface IProductSetItem {
  id: string;
  quantity: number;
}

export interface IProductImage {
  fullsize: string;
}

export interface IProductParam {
  name: string;
  type: "select" | string;
  value: string;
}

export interface IProductAdditionalPrice {
  priceType: string;
  priceValue: number;
  priceCurrency: string;
  priceDiscount: string;
}

/**
 * Represents the data for creating or updating a product.
 * The `id` field is used to identify the product for updates, or can be an external ID for creation.
 */
export interface IProductData {
  id: string;
  name?: string;
  nameTranslate?: string;
  nameForDocuments?: string;
  description?: string;
  descriptionTranslate?: string;
  costPerItem?: number;
  sku?: string;
  manufacturer?: string;
  currency?: string;
  discount?: IProductDiscount;
  weight?: number;
  volume?: number;
  length?: number;
  width?: number;
  height?: number;
  barcode?: string;
  stockBalance?: number;
  stockBalanceByStock?: Record<string, number>;
  expenses?: number;
  currencyExpenses?: string;
  category?: ICategory;
  url?: string;
  note?: string;
  supplier?: string;
  keywords?: string;
  parentProductId?: string | null;
  set?: IProductSetItem[];
  images?: IProductImage[];
  params?: IProductParam[];
  paramsMode?: "add" | "replace";
  additionalPrices?: IProductAdditionalPrice[];
  label?: string[];
  labelMode?: "replace" | "add";
}

export interface IProductOrCategoryResponse {
  status: "success" | "error";
  message?: string;
  errorMessage?: string;
}

/**
 * Представляет категорию в SalesDrive.
 */
export interface ICategory {
  id: number;
  name: string;
  parentId: number;
}

/**
 * Представляет единицу измерения в SalesDrive.
 */
export interface IUnit {
  id: number;
  title: string;
}
