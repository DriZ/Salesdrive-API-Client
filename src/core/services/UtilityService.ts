import { type AxiosInstance } from "axios";
import { ENDPOINTS } from "../constants";
import type {
  ICurrency,
  ICurrenciesResponse,
  IGetCurrenciesResponse,
  TPaymentMethodsResponse,
  TDeliveryMethodsResponse,
  TStatusesResponse,
} from "../../types";

export class UtilityService {
  constructor(private readonly axiosInstance: AxiosInstance) { }

  /**
   * @return {Promise<IGetCurrenciesResponse | ICurrenciesResponse>} - Returns currencies
   */
  async getCurrencies(): Promise<IGetCurrenciesResponse | ICurrenciesResponse> {
    const response = await this.axiosInstance.get<IGetCurrenciesResponse | ICurrenciesResponse>(
      ENDPOINTS.CURRENCIES,
    );
    return response.data;
  }

  /**
   * @param data - Data for currencies
   * @return {Promise<ICurrency[]>} - Returns updated currencies
   */
  async updateCurrencies(data: Partial<ICurrency>[]): Promise<ICurrenciesResponse> {
    const response = await this.axiosInstance.post<ICurrenciesResponse>(
      ENDPOINTS.CURRENCIES,
      data,
    );
    return response.data;
  }

  /**
   * @return {Promise<TPaymentMethodResponse>} - Returns payment methods or error message
   */
  async getPaymentMethods(): Promise<TPaymentMethodsResponse> {
    const response = await this.axiosInstance.get<TPaymentMethodsResponse>(
      ENDPOINTS.PAYMENT_METHODS,
    );
    return response.data;
  }

  /**
   * @return {Promise<TDeliveryMethodsResponse>} - Returns delivery methods or error message
   */
  async getDeliveryMethods(): Promise<TDeliveryMethodsResponse> {
    const response = await this.axiosInstance.get<TDeliveryMethodsResponse>(
      ENDPOINTS.DELIVERY_METHODS,
    );
    return response.data;
  }

  /**
   * @return {Promise<TStatusesResponse>} - Returns statuses
   */
  async getStatuses(): Promise<TStatusesResponse> {
    const response = await this.axiosInstance.get<TStatusesResponse>(
      ENDPOINTS.STATUSES,
    );
    return response.data;
  }
}
