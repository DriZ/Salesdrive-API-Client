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
import type { OrderQueryBuilder } from "./services/QueryBuilders/OrderQueryBuilder";
import type {
  IAct,
  IAddNoteResponse,
  IArrivalProduct,
  ICategory,
  ICheck,
  IContract,
  ICreatePaymentParams,
  ICurrenciesResponse,
  ICurrency,
  IDeliveryMethodsErrorResponse,
  IDeliveryMethodsResponse,
  IDocumentListResponse,
  IFilterableListParams,
  IGetCurrenciesResponse,
  IGetOrdersParams,
  IInvoice,
  IOrder,
  IPaymentListParams,
  IPaymentListResponse,
  IPaymentMethodsErrorResponse,
  IPaymentMethodsResponse,
  IProductData,
  IProductOrCategoryResponse,
  ISalesInvoice,
  IStatusesErrorResponse,
  IStatusesResponse,
  TCreatePaymentResponse,
  TGetManagerByPhoneResponse,
  TOrderCreateFields,
  TOrderUpdateData,
} from "../types";
import { CashOrdersListBuilder, DocumentQueryBuilder } from "./services/QueryBuilders";

export class Client {
  private readonly axiosInstance: AxiosInstance;
  private globalErrorHandler?: (error: SalesDriveError) => void;

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

    axiosRetry(this.axiosInstance, {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => {
        return (
          axiosRetry.isNetworkOrIdempotentRequestError(error) ||
          error.response?.status === 429
        );
      },
    });

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiErrorData>) => {
        const sdkError = new SalesDriveError(error);
        if (this.globalErrorHandler) {
          this.globalErrorHandler(sdkError);
        }
        return Promise.reject(sdkError);
      },
    );

    this.orders = new OrderService(this.axiosInstance);
    this.products = new ProductService(this.axiosInstance);
    this.documents = new DocumentService(this.axiosInstance);
    this.payments = new PaymentService(this.axiosInstance);
    this.managers = new ManagerService(this.axiosInstance);
    this.webhooks = new WebhookService(this.axiosInstance);
    this.utils = new UtilityService(this.axiosInstance);
  }

  /**
   * Registers a global error handler for API requests.
   * @param handler Function to handle errors
   */
  public catch(handler: (error: SalesDriveError) => void): this {
    this.globalErrorHandler = handler;
    return this;
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

  /**
   * Alias for `client.utils.getCurrencies()`
   * @returns {Promise<IGetCurrenciesResponse | ICurrenciesResponse>}
   */
  public async getCurrencies(): Promise<IGetCurrenciesResponse | ICurrenciesResponse> {
    return this.utils.getCurrencies();
  }

  /**
   * Alias for `client.utils.updateCurrencies()`
   * @param {Partial<ICurrency>[]}data массив объектов полей валют
   * @returns {Promise<any>}
   */
  public async updateCurrencies(data: Partial<ICurrency>[]): Promise<any> {
    return this.utils.updateCurrencies(data);
  }

  /**
   * Alias for `client.utils.getPaymentMethods()`
   * @returns {IPaymentMethodsResponse | IPaymentMethodsErrorResponse}
   */
  public async getPaymentMethods(): Promise<IPaymentMethodsResponse | IPaymentMethodsErrorResponse> {
    return this.utils.getPaymentMethods();
  }

  /**
   * Alias for `client.utils.getDeliveryMethods()`
   * @returns {IDeliveryMethodsResponse | IDeliveryMethodsErrorResponse}
   */
  public async getDeliveryMethods(): Promise<IDeliveryMethodsResponse | IDeliveryMethodsErrorResponse> {
    return this.utils.getDeliveryMethods();
  }

  /**
   * Alias for `client.utils.getStatuses()`
   * @returns {IStatusesResponse | IStatusesErrorResponse}
   */
  public async getStatuses(): Promise<IStatusesResponse | IStatusesErrorResponse> {
    return this.utils.getStatuses();
  }

  /**
   * Alias for `client.managers.findByPhone()`
   * @param {string}phoneNumber
   * @returns {TGetManagerByPhoneResponse}
   */
  public async getManagerByPhoneNumber(phoneNumber: string): Promise<TGetManagerByPhoneResponse> {
    return this.managers.findByPhone(phoneNumber);
  }

  /**
   * Alias for `client.webhooks.create()`
   * @param {IPaymentListParams}params
   * @returns {IPaymentListResponse}
   */
  public async getPaymentsList(params?: IPaymentListParams): Promise<IPaymentListResponse> {
    return this.payments.getPaymentsList(params);
  }

  /**
   * Alias for `client.payments.createPayment()`
   * @param {ICreatePaymentParams}data
   * @returns {TCreatePaymentResponse}
   */
  public async createPayment(data: ICreatePaymentParams): Promise<TCreatePaymentResponse> {
    return this.payments.createPayment(data);
  }

  /**
   * Alias for `client.documents.getInvoicesList()`
   * @param {IFilterableListParams}params
   * @returns {DocumentQueryBuilder<IDocumentListResponse<IInvoice>>}
   */
  public async getInvoicesList(params?: IFilterableListParams): Promise<DocumentQueryBuilder<IDocumentListResponse<IInvoice>>> {
    return this.documents.getInvoicesList(params);
  }

  /**
   * Alias for `client.documents.getSalesInvoicesList
   * @param {IFilterableListParams}params
   * @returns {DocumentQueryBuilder<IDocumentListResponse<ISalesInvoice>>}
   */
  public async getSalesInvoiceList(params?: IFilterableListParams): Promise<DocumentQueryBuilder<IDocumentListResponse<ISalesInvoice>>> {
    return this.documents.getSalesInvoicesList(params);
  }

  /**
   * Alias for `client.documents.getCashOrdersList()`
   * @param {IFilterableListParams}params
   * @returns {CashOrdersListBuilder}
   */
  public async getCashOrderList(params?: IFilterableListParams): Promise<CashOrdersListBuilder> {
    return this.documents.getCashOrdersList(params);
  }

  /**
   * Alias for `client.documents.getArrivalProductsList()`
   * @param {IFilterableListParams}params
   * @returns {DocumentQueryBuilder<IDocumentListResponse<IArrivalProduct>>}
   */
  public async getArrivalProductsList(params?: IFilterableListParams): Promise<DocumentQueryBuilder<IDocumentListResponse<IArrivalProduct>>> {
    return this.documents.getArrivalProductsList(params);
  }

  /**
   * Alias for `client.documents.getActsList()`
   * @param {IFilterableListParams}params 
   * @returns {DocumentQueryBuilder<IDocumentListResponse<IAct>>}
   */
  public async getActsList(params?: IFilterableListParams): Promise<DocumentQueryBuilder<IDocumentListResponse<IAct>>> {
    return this.documents.getActsList(params);
  }

  /**
   * Alias for `client.documents.getContractsList()`
   * @param {IFilterableListParams}params
   * @returns {DocumentQueryBuilder<IDocumentListResponse<IContract>>}
   */
  public async getContractsList(params?: IFilterableListParams): Promise<DocumentQueryBuilder<IDocumentListResponse<IContract>>> {
    return this.documents.getContractsList(params);
  }

  /**
   * Alias for `client.documents.getChecksList()`
   * @param {IFilterableListParams}params 
   * @returns {DocumentQueryBuilder<IDocumentListResponse<ICheck>>}
   */
  public async getChecksList(params?: IFilterableListParams): Promise<DocumentQueryBuilder<IDocumentListResponse<ICheck>>> {
    return this.documents.getChecksList(params);
  }
}
