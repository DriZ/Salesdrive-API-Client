import { type AxiosInstance } from "axios";
import { ENDPOINTS } from "../constants";
import {
  ICurrency,
  IPaymentMethod,
  IDeliveryMethod,
  IStatus,
} from "../../types";

export class UtilityService {
  constructor(private readonly axiosInstance: AxiosInstance) {}

  /**
   * @return {Promise<ICurrency[]>} - Returns currencies
   */
  async getCurrencies(): Promise<ICurrency[]> {
    const response = await this.axiosInstance.get<ICurrency[]>(
      ENDPOINTS.CURRENCIES,
    );
    return response.data;
  }

  /**
   * @param data - Data for currencies
   * @return {Promise<ICurrency[]>} - Returns updated currencies
   */
  async updateCurrencies(data: Partial<ICurrency>[]): Promise<ICurrency[]> {
    const response = await this.axiosInstance.post<ICurrency[]>(
      ENDPOINTS.CURRENCIES,
      data,
    );
    return response.data;
  }

  /**
   * @return {Promise<IPaymentMethod[]>} - Returns payment methods
   */
  async getPaymentMethods(): Promise<IPaymentMethod[]> {
    const response = await this.axiosInstance.get<IPaymentMethod[]>(
      ENDPOINTS.PAYMENT_METHODS,
    );
    return response.data;
  }

  /**
   * @return {Promise<IDeliveryMethod[]>} - Returns delivery methods
   */
  async getDeliveryMethods(): Promise<IDeliveryMethod[]> {
    const response = await this.axiosInstance.get<IDeliveryMethod[]>(
      ENDPOINTS.DELIVERY_METHODS,
    );
    return response.data;
  }

  /**
   * @return {Promise<IStatus[]>} - Returns statuses
   */
  async getStatuses(): Promise<IStatus[]> {
    const response = await this.axiosInstance.get<IStatus[]>(
      ENDPOINTS.STATUSES,
    );
    return response.data;
  }
}
