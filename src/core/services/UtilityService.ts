import { type AxiosInstance } from "axios";
import { ENDPOINTS } from "../constants";
import type {
  ICurrency,
  IUpdateCurrenciesResponse,
  IGetCurrenciesResponse,
  TPaymentMethodsResponse,
  TDeliveryMethodsResponse,
  TStatusesResponse,
  IStatus,
  IDeliveryMethod,
  IPaymentMethods,
  TGetCurrenciesResponse,
} from "../../types";

export class UtilityService {
  constructor(private readonly axiosInstance: AxiosInstance) { }

  /**
   * @return {Promise<IGetCurrenciesResponse>} - Returns currencies
   * @throws {IGetCurrenciesErrorResponse}
   */
  async getCurrencies(): Promise<IGetCurrenciesResponse> {
    const response = await this.axiosInstance.get<TGetCurrenciesResponse>(
      ENDPOINTS.CURRENCIES
    );
    if ("currencies" in response.data) {
      return response.data;
    }
    throw new Error(response.data.message);
  }

  /**
   * @param {Partial<ICurrency>[]}data - Data for currencies
   * @return {Promise<ICurrency[]>} - Returns updated currencies
   */
  async updateCurrencies(
    data: Partial<ICurrency>[],
  ): Promise<IUpdateCurrenciesResponse> {
    const response = await this.axiosInstance.post<IUpdateCurrenciesResponse>(
      ENDPOINTS.CURRENCIES,
      data,
    );
    return response.data;
  }

  /**
   * @return {Promise<IPaymentMethods[]>} - Returns payment methods or error message
   * @throws {IPaymentMethodsErrorResponse}
   */
  async getPaymentMethods(): Promise<IPaymentMethods[]> {
    const response = await this.axiosInstance.get<TPaymentMethodsResponse>(
      ENDPOINTS.PAYMENT_METHODS,
    );
    if ("data" in response.data) {
      return response.data.data;
    }
    throw new Error(response.data.message);
  }

  /**
   * @return {Promise<IDeliveryMethod[]>} - Returns delivery methods or error message
   * @throws {IDeliveryMethodsErrorResponse}
   */
  async getDeliveryMethods(): Promise<IDeliveryMethod[]> {
    const response = await this.axiosInstance.get<TDeliveryMethodsResponse>(
      ENDPOINTS.DELIVERY_METHODS,
    );
    if ("data" in response.data) {
      return response.data.data;
    }
    throw new Error(response.data.message);
  }

  /**
   * @return {Promise<IStatus[]>} - Returns statuses
   * @throws {IStatusesErrorResponse}
   */
  async getStatuses(): Promise<IStatus[]> {
    const response = await this.axiosInstance.get<TStatusesResponse>(
      ENDPOINTS.STATUSES,
    );
    if ("data" in response.data) {
      return response.data.data;
    }
    throw new Error(response.data.message);
  }
}
