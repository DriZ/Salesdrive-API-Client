import { type AxiosInstance } from "axios";
import { ENDPOINTS } from "../constants";

export interface IPayment {
  id: number;
  amount: number;
  date: string;
}

export class PaymentService {
  constructor(private readonly axiosInstance: AxiosInstance) {}

  /**
   * @param data - Data for payment
   * @return {Promise<any>} - Returns created payment
   */
  async createPayment(data: any): Promise<any> {
    const response = await this.axiosInstance.post(
      ENDPOINTS.PAYMENT.CREATE,
      data,
    );
    return response.data;
  }

  /**
   * @return {Promise<any>} - Returns payments list
   */
  async getPaymentsList(): Promise<any> {
    const response = await this.axiosInstance.get(ENDPOINTS.PAYMENT.LIST);
    return response.data;
  }
}
