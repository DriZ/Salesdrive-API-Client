import { type AxiosInstance } from "axios";
import { ENDPOINTS } from "../constants";
import type {
  IAct,
  IArrivalProduct,
  ICheck,
  IContract,
  IDocumentListParams,
  IDocumentListResponse,
  IInvoice,
  ISalesInvoice,
} from "../../types";
import { formatSalesDriveDate } from "../utils";
import { CashOrdersListBuilder, DocumentQueryBuilder } from "./QueryBuilders";


export class DocumentService {
  constructor(private readonly axiosInstance: AxiosInstance) { }

  /**
   * @return {DocumentQueryBuilder} - Returns query builder for invoices list
   */
  public getInvoicesList(params?: IDocumentListParams): DocumentQueryBuilder<IDocumentListResponse<IInvoice>> {
    return new DocumentQueryBuilder<IDocumentListResponse<IInvoice>>(this, ENDPOINTS.DOCUMENTS.INVOICE, params);
  }

  /**
   * Executes the request to fetch documents.
   */
  public async fetchDocuments(
    endpoint: string,
    params?: IDocumentListParams,
  ): Promise<IDocumentListResponse<any>> {
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
            newFilterItem.from = formatSalesDriveDate(
              newFilterItem.from,
              "00:00:00",
            );
          }
          if (newFilterItem.to) {
            newFilterItem.to = formatSalesDriveDate(
              newFilterItem.to,
              "23:59:59",
            );
          }
          requestParams.filter[field] = newFilterItem;
        }
      }
    }

    const response = await this.axiosInstance.get<IDocumentListResponse<any>>(
      endpoint,
      { params: requestParams },
    );
    return response.data;
  }

  /**
   * @return {DocumentQueryBuilder} - Returns query builder for sales invoices list
   */
  public getSalesInvoicesList(params?: IDocumentListParams): DocumentQueryBuilder<IDocumentListResponse<ISalesInvoice>> {
    return new DocumentQueryBuilder<IDocumentListResponse<ISalesInvoice>>(this, ENDPOINTS.DOCUMENTS.SALES_INVOICE, params);
  }

  /**
   * @return {CashOrdersListBuilder} - Returns query builder for cash orders list
   */
  public getCashOrdersList(params?: IDocumentListParams): CashOrdersListBuilder {
    return new CashOrdersListBuilder(this, ENDPOINTS.DOCUMENTS.CASH_ORDER, params);
  }

  /**
   * @return {DocumentQueryBuilder} - Returns query builder for arrival products list
   */
  public getArrivalProductsList(params?: IDocumentListParams): DocumentQueryBuilder<IDocumentListResponse<IArrivalProduct>> {
    return new DocumentQueryBuilder<IDocumentListResponse<IArrivalProduct>>(this, ENDPOINTS.DOCUMENTS.ARRIVAL_PRODUCT, params);
  }

  /**
   * @return {DocumentQueryBuilder} - Returns query builder for acts list
   */
  public getActsList(params?: IDocumentListParams): DocumentQueryBuilder<IDocumentListResponse<IAct>> {
    return new DocumentQueryBuilder<IDocumentListResponse<IAct>>(this, ENDPOINTS.DOCUMENTS.ACT, params);
  }

  /**
   * @return {DocumentQueryBuilder} - Returns query builder for contracts list
   */
  public getContractsList(params?: IDocumentListParams): DocumentQueryBuilder<IDocumentListResponse<IContract>> {
    return new DocumentQueryBuilder<IDocumentListResponse<IContract>>(this, ENDPOINTS.DOCUMENTS.CONTRACT, params);
  }

  /**
   * @return {DocumentQueryBuilder} - Returns query builder for checks list
   */
  public getChecksList(params?: IDocumentListParams): DocumentQueryBuilder<IDocumentListResponse<ICheck>> {
    return new DocumentQueryBuilder<IDocumentListResponse<ICheck>>(this, ENDPOINTS.DOCUMENTS.CHECK, params);
  }
}
