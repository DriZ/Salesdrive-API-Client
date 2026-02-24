import { type AxiosInstance } from "axios";
import { ENDPOINTS } from "../constants";
import {
  IDocument,
  IGetInvoicesListParams,
  IGetInvoicesListResponse,
  SalesDriveDate,
} from "../../types";
import { formatSalesDriveDate } from "../utils";

export class InvoicesListBuilder implements PromiseLike<IGetInvoicesListResponse> {
  private params: IGetInvoicesListParams = {};

  constructor(
    private readonly documentService: DocumentService,
    initialParams?: IGetInvoicesListParams,
  ) {
    if (initialParams) {
      this.params = { ...initialParams };
    }
  }

  public page(page: number): this {
    this.params.page = page;
    return this;
  }

  public limit(limit: number): this {
    this.params.limit = limit;
    return this;
  }

  public updatedAtFrom(date: SalesDriveDate): this {
    this.ensureFilterObject();
    this.ensureDateFilter("updatedAt");
    this.params.filter!.updatedAt!.from = date;
    return this;
  }

  public updatedAtTo(date: SalesDriveDate): this {
    this.ensureFilterObject();
    this.ensureDateFilter("updatedAt");
    this.params.filter!.updatedAt!.to = date;
    return this;
  }

  public dateFrom(date: SalesDriveDate): this {
    this.ensureFilterObject();
    this.ensureDateFilter("date");
    this.params.filter!.date!.from = date;
    return this;
  }

  public dateTo(date: SalesDriveDate): this {
    this.ensureFilterObject();
    this.ensureDateFilter("date");
    this.params.filter!.date!.to = date;
    return this;
  }

  public createdAtFrom(date: SalesDriveDate): this {
    this.ensureFilterObject();
    this.ensureDateFilter("createdAt");
    this.params.filter!.createdAt!.from = date;
    return this;
  }

  public createdAtTo(date: SalesDriveDate): this {
    this.ensureFilterObject();
    this.ensureDateFilter("createdAt");
    this.params.filter!.createdAt!.to = date;
    return this;
  }

  public organizationId(ids: number | number[]): this {
    this.ensureFilterObject();
    this.params.filter!.organizationId = Array.isArray(ids) ? ids : [ids];
    return this;
  }

  private ensureFilterObject() {
    if (!this.params.filter) {
      this.params.filter = {};
    }
  }

  private ensureDateFilter(field: "updatedAt" | "date" | "createdAt") {
    if (!this.params.filter![field]) {
      this.params.filter![field] = {};
    }
  }

  public then<TResult1 = IGetInvoicesListResponse, TResult2 = never>(
    onfulfilled?:
      | ((value: IGetInvoicesListResponse) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null,
  ): PromiseLike<TResult1 | TResult2> {
    return this.documentService
      .fetchInvoices(this.params)
      .then(onfulfilled, onrejected);
  }

  public catch<TResult = never>(
    onrejected?:
      | ((reason: any) => TResult | PromiseLike<TResult>)
      | undefined
      | null,
  ): Promise<IGetInvoicesListResponse | TResult> {
    return this.documentService.fetchInvoices(this.params).catch(onrejected);
  }

  public finally(
    onfinally?: (() => void) | undefined | null,
  ): Promise<IGetInvoicesListResponse> {
    return this.documentService.fetchInvoices(this.params).finally(onfinally);
  }
}

export class DocumentService {
  constructor(private readonly axiosInstance: AxiosInstance) {}

  /**
   * @return {InvoicesListBuilder} - Returns query builder for invoices list
   */
  getInvoicesList(params?: IGetInvoicesListParams): InvoicesListBuilder {
    return new InvoicesListBuilder(this, params);
  }

  /**
   * Executes the request to fetch invoices.
   */
  async fetchInvoices(
    params?: IGetInvoicesListParams,
  ): Promise<IGetInvoicesListResponse> {
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
          if (newFilterItem.from && typeof newFilterItem.from === "string") {
            newFilterItem.from = formatSalesDriveDate(
              newFilterItem.from,
              "00:00:00",
            ) as SalesDriveDate;
          }
          if (newFilterItem.to && typeof newFilterItem.to === "string") {
            newFilterItem.to = formatSalesDriveDate(
              newFilterItem.to,
              "23:59:59",
            ) as SalesDriveDate;
          }
          requestParams.filter[field] = newFilterItem;
        }
      }
    }

    const response = await this.axiosInstance.get<IGetInvoicesListResponse>(
      ENDPOINTS.DOCUMENTS.INVOICE,
      { params: requestParams },
    );
    return response.data;
  }

  /**
   * @return {Promise<any>} - Returns sales invoices list
   */
  async getSalesInvoicesList(): Promise<IDocument[]> {
    const response = await this.axiosInstance.get(
      ENDPOINTS.DOCUMENTS.SALES_INVOICE,
    );
    return response.data;
  }

  /**
   * @return {Promise<any>} - Returns cash orders list
   */
  async getCashOrdersList(): Promise<IDocument[]> {
    const response = await this.axiosInstance.get(
      ENDPOINTS.DOCUMENTS.CASH_ORDER,
    );
    return response.data;
  }

  /**
   * @return {Promise<any>} - Returns arrival products list
   */
  async getArrivalProductsList(): Promise<IDocument[]> {
    const response = await this.axiosInstance.get(
      ENDPOINTS.DOCUMENTS.ARRIVAL_PRODUCT,
    );
    return response.data;
  }

  /**
   * @return {Promise<any>} - Returns acts list
   */
  async getActsList(): Promise<IDocument[]> {
    const response = await this.axiosInstance.get(ENDPOINTS.DOCUMENTS.ACT);
    return response.data;
  }

  /**
   * @return {Promise<any>} - Returns contracts list
   */
  async getContractsList(): Promise<IDocument[]> {
    const response = await this.axiosInstance.get(ENDPOINTS.DOCUMENTS.CONTRACT);
    return response.data;
  }

  /**
   * @return {Promise<any>} - Returns checks list
   */
  async getChecksList(): Promise<IDocument[]> {
    const response = await this.axiosInstance.get(ENDPOINTS.DOCUMENTS.CHECK);
    return response.data;
  }
}
