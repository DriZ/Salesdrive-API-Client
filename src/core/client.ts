import axios, { type AxiosInstance, type AxiosError } from "axios";
import axiosRetry from "axios-retry";
import { ApiErrorData, SalesDriveError } from "./errors";
import { OrderService } from "./services/OrderService";
import { UtilityService } from "./services/UtilityService";
import { ProductService } from "./services/ProductService";
import { DocumentService } from "./services/DocumentService";
import { PaymentService } from "./services/PaymentService";
import { ManagerService } from "./services/ManagerService";
import { WebhookService } from "./services/WebhookService";
import type { OrderQueryBuilder } from "./services/OrderService";
import type {
  IAddNoteResponse,
  ICurrency,
  IGetOrdersParams,
  IOrder,
  TOrderUpdateData,
} from "../types";

export class Client {
  private readonly axiosInstance: AxiosInstance;

  public readonly orders: OrderService;
  public readonly products: ProductService;
  public readonly documents: DocumentService;
  public readonly payments: PaymentService;
  public readonly managers: ManagerService;
  public readonly webhooks: WebhookService;
  public readonly utils: UtilityService;

  constructor(apiKey: string, domain: string) {
    this.axiosInstance = axios.create({
      baseURL: `https://${domain}.salesdrive.me/`,
      headers: {
        "X-Api-Key": apiKey,
        "Content-Type": "application/json",
      },
    });

    // Настройка автоматических повторных попыток
    axiosRetry(this.axiosInstance, {
      retries: 3, // Количество попыток
      retryDelay: axiosRetry.exponentialDelay, // Экспоненциальная задержка (1s, 2s, 4s...)
      retryCondition: (error) => {
        // Повторять при сетевых ошибках или 429 (Too Many Requests)
        return (
          axiosRetry.isNetworkOrIdempotentRequestError(error) ||
          error.response?.status === 429
        );
      },
    });

    // Глобальный перехватчик для улучшения читаемости ошибок
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiErrorData>) => {
        return Promise.reject(new SalesDriveError(error));
      },
    );

    // Инициализация сервисов
    this.orders = new OrderService(this.axiosInstance);
    this.products = new ProductService(this.axiosInstance);
    this.documents = new DocumentService(this.axiosInstance);
    this.payments = new PaymentService(this.axiosInstance);
    this.managers = new ManagerService(this.axiosInstance);
    this.webhooks = new WebhookService(this.axiosInstance);
    this.utils = new UtilityService(this.axiosInstance);
  }

  /**
   * Alias for `client.orders.find()`
   * @param {keyof IGetOrdersParams}params
   * @returns
   */
  public findOrders(params?: IGetOrdersParams): OrderQueryBuilder {
    return this.orders.find(params);
  }

  /**
   * Alias for `client.orders.create()`
   * @param {Partial<IOrder>}data
   * @returns
   */
  public async createOrder(data: Partial<IOrder>): Promise<IOrder> {
    return this.orders.create(data);
  }

  /**
   * Alias for `client.orders.findById()`
   * @param {number}id
   * @returns
   */
  public async findOrderById(id: number): Promise<IOrder> {
    return this.orders.findById(id);
  }

  /**
   * Alias for `client.orders.update()`
   * @param {number | string}id ID заявки как number или внешний ID заявки как string
   * @param {TOrderUpdateData}fields объект полей, которые нужно обновить в заявке
   * @returns {Promise<boolean>}Результат обновления, true если заявка найдена и обновлена
   */
  public async updateOrder(
    id: number | string,
    fields: TOrderUpdateData,
  ): Promise<boolean> {
    return this.orders.update(id, fields);
  }

  /**
   * Alias for `client.orders.addNote()`
   * @param {number}orderId
   * @param {string}note
   * @returns
   */
  public async addNoteToOrder(
    orderId: number,
    note: string,
  ): Promise<IAddNoteResponse> {
    return this.orders.addNote(orderId, note);
  }

  public async getCurrencies(): Promise<ICurrency[]> {
    return this.utils.getCurrencies();
  }

  public async updateCurrencies(data: Partial<ICurrency>[]): Promise<any> {
    return this.utils.updateCurrencies(data);
  }

  public async getPaymentMethods(): Promise<any> {
    return this.utils.getPaymentMethods();
  }

  public async getDeliveryMethods(): Promise<any> {
    return this.utils.getDeliveryMethods();
  }

  public async getStatuses(): Promise<any> {
    return this.utils.getStatuses();
  }
}
