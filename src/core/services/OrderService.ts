import { AxiosInstance, AxiosError } from "axios";
import {
  IGetOrdersResponse,
  IGetOrdersParams,
  TStatusIdFilter,
  IOrder,
  IDateFilter,
  SalesDriveDate,
  TDatedOrderParamsFilter,
  IAddNoteResponse,
  IUpdateOrderResponse,
  TOrderUpdate,
  TOrderUpdateData,
} from "../../types";
import { SalesDriveError, type ApiErrorData } from "../errors";
import { ENDPOINTS } from "../constants";
import { formatSalesDriveDate } from "../utils";

export class OrderQueryBuilder implements PromiseLike<IGetOrdersResponse> {
  private params: IGetOrdersParams = {};

  constructor(
    private readonly orderService: OrderService, // Теперь принимает OrderService
    initialParams?: IGetOrdersParams,
  ) {
    if (initialParams) {
      this.params = { ...initialParams };
    }
  }

  /**
   * Фильтр устанавливает номер страницы
   * alias for page
   * @param {number}page
   * @returns {OrderQueryBuilder}
   */
  public page(page: number): this {
    this.params.page = page;
    return this;
  }

  /**
   * Фильтр устанавливает количество результатов на странице
   * alias for count
   * @param {number}limit От 1 до 100
   * @default 50
   * @returns {OrderQueryBuilder}
   */
  public limit(limit: number): this {
    if (limit < 1 || limit > 100) {
      throw new Error("Limit must be between 1 and 100");
    }
    this.params.limit = limit;
    return this;
  }

  /**
   * Фильтр устанавливает количество результатов на странице
   * alias fot limit
   * @param {number}count От 1 до 100
   * @default 50
   * @returns {OrderQueryBuilder}
   */
  public count(count: number): this {
    if (count < 1 || count > 100) {
      throw new Error("Count must be between 1 and 100");
    }
    this.params.limit = count;
    return this;
  }

  /**
   * Фильтр устанавливает начальную дату изменения заявки
   * @param date дата (YYYY-MM-DD) или дата со временем (YYYY-MM-DD HH:mm:ss)
   * @returns {OrderQueryBuilder}
   */
  public updatedAtFrom(date: SalesDriveDate): this {
    this.ensureFilterObject();
    this.ensureDateFilter("updateAt");
    this.params.filter!.updateAt!.from = date;
    return this;
  }

  /**
   * Фильтр устанавливает конечную дату изменения заявки
   * @param date дата (YYYY-MM-DD) или дата со временем (YYYY-MM-DD HH:mm:ss)
   * @returns {OrderQueryBuilder}
   */
  public updatedAtTo(date: SalesDriveDate): this {
    this.ensureFilterObject();
    this.ensureDateFilter("updateAt");
    this.params.filter!.updateAt!.to = date;
    return this;
  }

  /**
   * Фильтр устанавливает начальную дату создания заявки
   * @param date дата (YYYY-MM-DD) или дата со временем (YYYY-MM-DD HH:mm:ss)
   * @returns {OrderQueryBuilder}
   */
  public orderTimeFrom(date: SalesDriveDate): this {
    this.ensureFilterObject();
    this.ensureDateFilter("orderTime");
    this.params.filter!.orderTime!.from = date;
    return this;
  }

  /**
   * Фильтр устанавливает конечную дату создания заявки
   * @param date дата (YYYY-MM-DD) или дата со временем (YYYY-MM-DD HH:mm:ss)
   * @returns {OrderQueryBuilder}
   */
  public orderTimeTo(date: SalesDriveDate): this {
    this.ensureFilterObject();
    this.ensureDateFilter("orderTime");
    this.params.filter!.orderTime!.to = date;
    return this;
  }

  /**
   * ID статуса в SalesDrive или __NOTELETED__ - все заявки, кроме удалённых или __ALL__ - все заявки
   * @param {TStatusIdFilter | TStatusIdFilter[]} statusId
   * @returns {OrderQueryBuilder}
   */
  public statusId(statusId: TStatusIdFilter | TStatusIdFilter[]): this {
    this.ensureFilterObject();
    this.params.filter!.statusId = statusId;
    return this;
  }

  /**
   * Фильтр устанавливает начальный номер заявки
   * @param {number} id
   * @returns {OrderQueryBuilder}
   */
  public idFrom(id: number): this {
    this.ensureFilterObject();
    this.ensureIdFilter();
    this.params.filter!.id!.from = id;
    return this;
  }

  /**
   * Фильтр устанавливает конечный номер заявки
   * @param {number} id
   * @returns {OrderQueryBuilder}
   */
  public idTo(id: number): this {
    this.ensureFilterObject();
    this.ensureIdFilter();
    this.params.filter!.id!.to = id;
    return this;
  }

  /**
   * Фильтр устанавливает ID статуса в SalesDrive или массив из ID статусов
   * @param statusIds
   * @returns {OrderQueryBuilder}
   */
  public setStatusId(statusIds: number | number[]): this {
    this.ensureFilterObject();
    this.params.filter!.setStatusId = Array.isArray(statusIds)
      ? statusIds
      : [statusIds];
    return this;
  }

  /**
   * Фильтр устанавливает начальную дату изменения статуса заявки
   * @param date дата (YYYY-MM-DD) или дата со временем (YYYY-MM-DD HH:mm:ss)
   * @example setStatusTimeFrom("2025-01-01 10:15:00")
   * @returns {OrderQueryBuilder}
   */
  public setStatusTimeFrom(date: SalesDriveDate): this {
    this.ensureFilterObject();
    this.ensureDateFilter("setStatusTime");
    this.params.filter!.setStatusTime!.from = date;
    return this;
  }

  /**
   * Фильтр устанавливает конечную дату изменения статуса заявки
   * @param date дата (YYYY-MM-DD) или дата со временем (YYYY-MM-DD HH:mm:ss)
   * @example setStatusTimeTo("2025-01-01 10:15:00")
   * @returns {OrderQueryBuilder}
   */
  public setStatusTimeTo(date: SalesDriveDate): this {
    this.ensureFilterObject();
    this.ensureDateFilter("setStatusTime");
    this.params.filter!.setStatusTime!.to = date;
    return this;
  }

  private ensureFilterObject() {
    if (!this.params.filter) {
      this.params.filter = {};
    }
  }

  private ensureDateFilter(field: "updateAt" | "orderTime" | "setStatusTime") {
    if (!this.params.filter![field]) {
      this.params.filter![field] = {};
    }
  }

  private ensureIdFilter() {
    if (!this.params.filter!.id) {
      this.params.filter!.id = {};
    }
  }

  public then<TResult1 = IGetOrdersResponse, TResult2 = never>(
    onfulfilled?:
      | ((value: IGetOrdersResponse) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null,
  ): PromiseLike<TResult1 | TResult2> {
    return this.orderService
      .fetchOrders(this.params)
      .then(onfulfilled, onrejected);
  }

  public catch<TResult = never>(
    onrejected?:
      | ((reason: any) => TResult | PromiseLike<TResult>)
      | undefined
      | null,
  ): Promise<IGetOrdersResponse | TResult> {
    return this.orderService.fetchOrders(this.params).catch(onrejected);
  }

  /**
   * @returns {Promise<IGetOrdersResponse>}
   */
  public finally(
    onfinally?: (() => void) | undefined | null,
  ): Promise<IGetOrdersResponse> {
    return this.orderService.fetchOrders(this.params).finally(onfinally);
  }
}

export class OrderService {
  constructor(private readonly axiosInstance: AxiosInstance) {}

  public find(params?: IGetOrdersParams): OrderQueryBuilder {
    return new OrderQueryBuilder(this, params);
  }

  public async fetchOrders(
    params?: IGetOrdersParams,
  ): Promise<IGetOrdersResponse> {
    const requestParams = params ? { ...params } : {};

    if (requestParams.filter) {
      requestParams.filter = { ...requestParams.filter };
      const dateFields: Array<keyof TDatedOrderParamsFilter> = [
        "updateAt",
        "orderTime",
        "setStatusTime",
      ];

      for (const field of dateFields) {
        const filterItem = requestParams.filter[field] as
          | IDateFilter
          | undefined;
        if (filterItem) {
          const newFilterItem: IDateFilter = { ...filterItem };

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

    const response = await this.axiosInstance.get<IGetOrdersResponse>(
      ENDPOINTS.ORDER.LIST,
      { params: requestParams },
    );
    return response.data;
  }

  public async create(data: Partial<IOrder>): Promise<IOrder> {
    const response = await this.axiosInstance.post<IOrder>(
      ENDPOINTS.ORDER.CREATE,
      data,
    );
    return response.data;
  }

  public async findById(id: number): Promise<IOrder> {
    const response = await this.axiosInstance.get<IGetOrdersResponse>(
      ENDPOINTS.ORDER.LIST,
      {
        params: { "filter[id]": id }, // API expects filter[id] for single ID
      },
    );
    if (response.data.message === "api key is invalid") {
      throw new SalesDriveError({
        message: response.data.message,
        response: { status: 401, data: { message: response.data.message } },
      } as AxiosError<ApiErrorData>);
    }
    if (response.data.data && response.data.data.length > 0) {
      return response.data.data[0];
    }
    throw new SalesDriveError({
      message: `Order with ID ${id} not found.`,
      response: {
        status: 404,
        data: { message: `Order with ID ${id} not found.` },
      },
    } as AxiosError<ApiErrorData>);
  }

  /**
   * Обновляет поля заявки
   * @param {number | string}id ID заявки как number или внешний ID заявки как string
   * @param {TOrderUpdateData}fields объект полей, которые нужно обновить в заявке
   * @returns {Promise<boolean>}Результат обновления, true если заявка найдена и обновлена
   */
  public async update(
    id: number | string,
    fields: TOrderUpdateData,
  ): Promise<boolean> {
    const params: TOrderUpdate =
      typeof id === "number"
        ? { id: id, data: fields }
        : { externalId: id, data: fields };

    const response = await this.axiosInstance.post<IUpdateOrderResponse>(
      ENDPOINTS.ORDER.UPDATE,
      params,
    );

    return response.data.success;
  }

  /**
   * Добавляет комментарий к заявке в блок "Коммуникации с клиентом"
   * @param orderId ID заявки
   * @param note Текст комментария
   * @returns
   */
  public async addNote(
    orderId: IOrder["id"],
    note: IOrder["comment"],
  ): Promise<IAddNoteResponse> {
    const response = await this.axiosInstance.post(ENDPOINTS.ORDER.NOTE, {
      orderId,
      note,
    });
    return response.data;
  }
}
