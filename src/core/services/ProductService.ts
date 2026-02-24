import { type AxiosInstance } from "axios";
import { ENDPOINTS } from "../constants";

export interface IProduct {
  id: number;
  name: string;
  price: number;
}

export interface ICategory {
  id: number;
  name: string;
}

export class ProductService {
  constructor(private readonly axiosInstance: AxiosInstance) {}

  /**
   * @param data - Data for product
   * @return {Promise<IProduct>} - Returns created product
   */
  async createProduct(data: any): Promise<any> {
    const response = await this.axiosInstance.post(
      ENDPOINTS.PRODUCT.HANDLER,
      data,
    );
    return response.data;
  }

  /**
   * @param data - Data for category
   * @return {Promise<ICategory>} - Returns created category
   */
  async createCategory(data: any): Promise<any> {
    const response = await this.axiosInstance.post(
      ENDPOINTS.CATEGORY.HANDLER,
      data,
    );
    return response.data;
  }
}
