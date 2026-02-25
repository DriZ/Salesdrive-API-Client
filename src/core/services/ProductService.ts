import { type AxiosInstance } from "axios";
import { ENDPOINTS } from "../constants";
import { ICategory, IProductData, IProductOrCategoryResponse } from "../../types";

export class ProductService {
  constructor(private readonly axiosInstance: AxiosInstance) { }

  /**
   * Creates one or more products.
   * @param products An array of product data objects to create.
   * @returns A promise that resolves with the API response.
   */
  async createProducts(products: IProductData[]): Promise<IProductOrCategoryResponse> {
    const payload = {
      action: "add",
      product: products,
    };
    const response = await this.axiosInstance.post<IProductOrCategoryResponse>(
      ENDPOINTS.PRODUCT.HANDLER,
      payload,
    );
    return response.data;
  }

  /**
   * Updates one or more products.
   * @param products An array of product objects to update. Each object must have an `id`.
   * @param dontUpdateFields A list of fields to exclude from the update, even if they are present in the product objects.
   * @returns A promise that resolves with the API response.
   */
  async updateProducts(
    products: (Pick<IProductData, "id"> & Partial<IProductData>)[],
    dontUpdateFields?: (keyof IProductData)[],
  ): Promise<IProductOrCategoryResponse> {
    const payload = {
      action: "update",
      product: products,
      dontUpdateFields: dontUpdateFields,
    };
    const response = await this.axiosInstance.post<IProductOrCategoryResponse>(
      ENDPOINTS.PRODUCT.HANDLER,
      payload,
    );
    return response.data;
  }

  /**
   * Deletes one or more products.
   * @param productIds An array of product IDs to delete.
   * @returns A promise that resolves with the API response.
   */
  async deleteProducts(productIds: string[]): Promise<IProductOrCategoryResponse> {
    const payload = {
      action: "delete",
      product: productIds.map((id) => ({ id })),
    };
    const response = await this.axiosInstance.post<IProductOrCategoryResponse>(
      ENDPOINTS.PRODUCT.HANDLER,
      payload,
    );
    return response.data;
  }

  /**
   * Creates one or more categories.
   * @param data Data for the categories. `name` is required.
   * @returns A promise that resolves with the API response.
   */
  async createCategories(data: Omit<ICategory, "id">[]): Promise<IProductOrCategoryResponse> {
    const payload = {
      action: "add",
      category: data,
    };
    const response = await this.axiosInstance.post<IProductOrCategoryResponse>(
      ENDPOINTS.CATEGORY.HANDLER,
      payload,
    );
    return response.data;
  }

  /**
   * Updates one or more categories.
   * @param data Data for the categories to update. Must include `id`.
   * @returns A promise that resolves with the API response.
   */
  async updateCategories(
    data: (Pick<ICategory, "id"> & Partial<Omit<ICategory, "id">>)[],
  ): Promise<IProductOrCategoryResponse> {
    const payload = {
      action: "update",
      category: data,
    };
    const response = await this.axiosInstance.post<IProductOrCategoryResponse>(
      ENDPOINTS.CATEGORY.HANDLER,
      payload,
    );
    return response.data;
  }

  /**
   * Deletes one or more categories.
   * @param categoryIds An array of category IDs to delete.
   * @returns A promise that resolves with the API response.
   */
  async deleteCategories(categoryIds: number[]): Promise<IProductOrCategoryResponse> {
    const payload = {
      action: "delete",
      category: categoryIds.map((id) => ({ id })),
    };
    const response = await this.axiosInstance.post<IProductOrCategoryResponse>(
      ENDPOINTS.CATEGORY.HANDLER,
      payload,
    );
    return response.data;
  }
}
