import { AxiosInstance, AxiosError } from "axios";
import type {
  IGetOrdersResponse,
  IGetOrdersParams,
  IOrder,
  IDateFilter,
  TDatedOrderParamsFilter,
  IAddNoteResponse,
  IUpdateOrderResponse,
  TOrderUpdate,
  TOrderUpdateData,
  TOrderCreateFields,
  ICreateOrderResponse,
} from "../../types";
import { SalesDriveError, type ApiErrorData } from "../errors";
import { ENDPOINTS } from "../constants";
import { formatSalesDriveDate } from "../utils";
import { OrderQueryBuilder } from "./QueryBuilders";


export class OrderService {
  constructor(private readonly axiosInstance: AxiosInstance) { }

  public find(params?: IGetOrdersParams): OrderQueryBuilder {
    return new OrderQueryBuilder(this, params);
  }

  public async fetchOrders(params?: IGetOrdersParams): Promise<IGetOrdersResponse> {
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

    const response = await this.axiosInstance.get<IGetOrdersResponse>(
      ENDPOINTS.ORDER.LIST,
      { params: requestParams },
    );
    return response.data;
  }

  /**
   * Создает новую заявку
   * @param {Partial<TOrderCreateFields>}data Объект полей заявки
   * @returns {Promise<number | null>} Вовзращает ID созданной заявки или null в случае неудачи
   */
  public async create(data: Partial<TOrderCreateFields>): Promise<number | null> {
    const response = await this.axiosInstance.post<ICreateOrderResponse>(
      ENDPOINTS.ORDER.CREATE,
      data,
    );

    if (response.data?.error) {
      throw new SalesDriveError({
        message: response.data.error,
        response: { status: 400, data: { message: response.data.error } },
      } as AxiosError<ApiErrorData>);
    }
    return response.data.data?.orderId ?? null;
  }

  /**
   * Ищет заявку по её ID
   * @param {number}id
   * @returns {Promise<IOrder | null>} Возвращает заявку или null, если заявка не найдена
   */
  public async findById(id: number): Promise<IOrder | null> {
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
    return null;
  }

  /**
   * Обновляет поля заявки
   * @param {number | string}id ID заявки как number или внешний ID заявки как string
   * @param {TOrderUpdateData}fields объект полей, которые нужно обновить в заявке
   * @returns {Promise<boolean>} Результат обновления, true если заявка найдена и обновлена
   */
  public async update(id: number | string, fields: TOrderUpdateData): Promise<boolean> {
    const params: TOrderUpdate =
      typeof id === "number"
        ? { id: id, data: fields }
        : { externalId: id, data: fields };

    const response = await this.axiosInstance.post<IUpdateOrderResponse>(
      ENDPOINTS.ORDER.UPDATE,
      params,
    );

    if (response.data.message) return false;

    return response.data.success ?? false;
  }

  /**
   * Добавляет комментарий к заявке в блок "Коммуникации с клиентом"
   * @param orderId ID заявки
   * @param note Текст комментария
   * @returns
   */
  public async addNote(orderId: IOrder["id"], note: IOrder["comment"]): Promise<IAddNoteResponse> {
    const response = await this.axiosInstance.post<IAddNoteResponse>(ENDPOINTS.ORDER.NOTE, {
      orderId,
      note,
    });
    if (!response.data.success) throw new SalesDriveError({
      message: response.data.message,
      response: { status: 400, data: { message: response.data.message } },
    } as AxiosError<ApiErrorData>);
    return response.data;
  }
}
