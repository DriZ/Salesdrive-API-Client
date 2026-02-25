import { type AxiosInstance } from "axios";
import { ENDPOINTS } from "../constants";
import { ICreatePaymentParams, IPaymentListParams, IPaymentListResponse, TCreatePaymentResponse } from "../../types";
import { PaymentQueryBuilder } from "./QueryBuilders";
import { formatSalesDriveDate } from "../utils";

export class PaymentService {
  constructor(private readonly axiosInstance: AxiosInstance) { }

  /**
   * @param data - Data for payment
   * @return {Promise<any>} - Returns created payment
   */
  async createPayment(data: ICreatePaymentParams): Promise<TCreatePaymentResponse> {
    const response = await this.axiosInstance.post<TCreatePaymentResponse>(
      ENDPOINTS.PAYMENT.CREATE,
      data,
    );
    return response.data;
  }

  /**
   * @return {PaymentQueryBuilder} - Returns query builder for payments list
   */
  getPaymentsList(params?: IPaymentListParams): PaymentQueryBuilder {
    return new PaymentQueryBuilder(this, params);
  }

  /**
   * Executes the request to fetch payments.
   */
  async fetchPayments(
    params?: IPaymentListParams,
  ): Promise<IPaymentListResponse> {
    const requestParams = params ? { ...params } : {};

    if (requestParams.filter) {
      requestParams.filter = { ...requestParams.filter };
      const dateFields: Array<"updatedAt" | "date" | "createdAt"> = [
        "updatedAt",
        "date",
        "createdAt",
      ];

      for (const field of dateFields) {
        const filterItem = requestParams.filter[field];
        if (filterItem) {
          const newFilterItem = { ...filterItem };
          if (newFilterItem.from) {
            newFilterItem.from = formatSalesDriveDate(newFilterItem.from, "00:00:00");
          }
          if (newFilterItem.to) {
            newFilterItem.to = formatSalesDriveDate(newFilterItem.to, "23:59:59");
          }
          requestParams.filter[field] = newFilterItem;
        }
      }
    }
    const response = await this.axiosInstance.get<IPaymentListResponse>(ENDPOINTS.PAYMENT.LIST, { params: requestParams });
    return response.data;
  }
}
