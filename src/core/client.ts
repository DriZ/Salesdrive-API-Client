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
  ICategory,
  ICurrency,
  IGetOrdersParams,
  IOrder,
  IProductData,
  IProductOrCategoryResponse,
  TOrderCreateFields,
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
   * Создает новую заявку
   * @param {Partial<TOrderCreateFields>}data Объект полей заявки
   * @returns {Promise<number | null>} Вовзращает ID созданной заявки или null в случае неудачи
   */
  public async createOrder(data: Partial<TOrderCreateFields>): Promise<number | null> {
    return this.orders.create(data);
  }

  /**
   * Alias for `client.orders.findById()`
   * @param {number}id
   * @returns {Promise<IOrder | null>} Возвращает заявку или null, если такой заяки не найдено
   */
  public async findOrderById(id: number): Promise<IOrder | null> {
    return this.orders.findById(id);
  }

  /**
   * Обновляет поля заявки
   * Alias for `client.orders.update()`
   * @param {number | string}id ID заявки как number или внешний ID заявки как string
   * @param {TOrderUpdateData}fields объект полей, которые нужно обновить в заявке
   * @returns {Promise<boolean>} Результат обновления, true если заявка найдена и обновлена
   */
  public async updateOrder(id: number | string, fields: TOrderUpdateData): Promise<boolean> {
    return this.orders.update(id, fields);
  }

  /**
   * Alias for `client.orders.addNote()`
   * @param {number}orderId
   * @param {string}note
   * @returns {IAddNoteResponse}
   */
  public async addNoteToOrder(orderId: number, note: string): Promise<IAddNoteResponse> {
    return this.orders.addNote(orderId, note);
  }

  /**
   * Alias for `client.products.createProducts()`
   * @param {IProductData[]}products
   * @returns {IProductOrCategoryResponse}
   */
  public async createProducts(products: IProductData[]): Promise<IProductOrCategoryResponse> {
    return this.products.createProducts(products);
  }

  /**
   * Alias for `client.products.updateProducts()`
   * @param {Partial<IProductData>[]}products массив из объектов полей товаров
   * @param {keyof IProductData[]}dontUpdateFields массив полей товаров, которые не нужно обновлять
   * @returns {IProductOrCategoryResponse}
   */
  public async updateProducts(
    products: (Pick<IProductData, "id"> & Partial<IProductData>)[],
    dontUpdateFields?: (keyof IProductData)[],
  ): Promise<IProductOrCategoryResponse> {
    return this.products.updateProducts(products, dontUpdateFields);
  }

  /**
   * Alias for `client.products.deleteProducts()`
   * @param {string[]}productIds массив из ID товаров
   * @returns {IProductOrCategoryResponse}
   */
  public async deleteProducts(productIds: string[]): Promise<IProductOrCategoryResponse> {
    return this.products.deleteProducts(productIds);
  }

  /**
   * Alias for `client.products.createCategories()`
   * @param {Omit<ICategory, "id">[]}data
   * @returns {IProductOrCategoryResponse}
   */
  public async createCategories(
    data: Omit<ICategory, "id">[]
  ): Promise<IProductOrCategoryResponse> {
    return this.products.createCategories(data);
  }

  /**
   * Alias for `client.products.updateCategories()`
   * @param {Partial<Omit<ICategory, "id">>[]}data массив объектов полей категорий
   * @returns {IProductOrCategoryResponse}
   */
  public async updateCategories(
    data: (Pick<ICategory, "id"> & Partial<Omit<ICategory, "id">>)[]
  ): Promise<IProductOrCategoryResponse> {
    return this.products.updateCategories(data);
  }

  /**
   * Alias for `client.products.deleteCategories()`
   * @param {number[]}categoryIds массив из ID категорий
   * @returns {IProductOrCategoryResponse}
   */
  public async deleteCategories(
    categoryIds: number[]
  ): Promise<IProductOrCategoryResponse> {
    return this.products.deleteCategories(categoryIds);
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
