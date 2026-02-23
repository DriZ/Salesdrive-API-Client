import axios, { type AxiosInstance, type AxiosError } from 'axios';
import axiosRetry from 'axios-retry';
import { ApiErrorData, SalesDriveError } from './errors';
import { OrderService, type OrderQueryBuilder } from './services/OrderService';
import { IGetOrdersParams, IOrder } from '../types';
import { ENDPOINTS } from './constants';


export class Client {
	private readonly axiosInstance: AxiosInstance;

	public readonly orders: OrderService; // Новый сервис для работы с заявками

	constructor(apiKey: string, domain: string) {
		this.axiosInstance = axios.create({
			baseURL: `https://${domain}.salesdrive.me/`,
			headers: {
				'X-Api-Key': apiKey,
				'Content-Type': 'application/json',
			},
		});

		// Настройка автоматических повторных попыток
		axiosRetry(this.axiosInstance, {
			retries: 3, // Количество попыток
			retryDelay: axiosRetry.exponentialDelay, // Экспоненциальная задержка (1s, 2s, 4s...)
			retryCondition: (error) => {
				// Повторять при сетевых ошибках или 429 (Too Many Requests)
				return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status === 429;
			},
		});

		// Глобальный перехватчик для улучшения читаемости ошибок
		this.axiosInstance.interceptors.response.use(
			(response) => response,
			(error: AxiosError<ApiErrorData>) => {
				return Promise.reject(new SalesDriveError(error));
			}
		);

		// Инициализация сервисов
		this.orders = new OrderService(this.axiosInstance);
	}

	/**
	 * alias fot this.orders.get()
	 * @param {keyof IGetOrdersParams}params 
	 * @returns 
	 */
	getOrders(params?: IGetOrdersParams): OrderQueryBuilder {
		return this.orders.get(params);
	}

	// Методы ниже теперь делегируются в OrderService

	async createOrder(data: Partial<IOrder>): Promise<IOrder> {
		return this.orders.createOrder(data);
	}

	async getOrder(id: number): Promise<IOrder> {
		return this.orders.getOrder(id);
	}

	async updateOrder(data: Partial<IOrder>): Promise<IOrder> {
		return this.orders.updateOrder(data);
	}

	async addNoteToOrder(orderId: number, note: string): Promise<any> {
		return this.orders.addNoteToOrder(orderId, note);
	}

	/**
	 * @param data - Data for product
	 * @return {Promise<any>} - Returns created product
	 */
	async createProduct(data: any): Promise<any> {
		const response = await this.axiosInstance.post(ENDPOINTS.PRODUCT.HANDLER, data);
		return response.data;
	}

	/**
	 * @param data - Data for category
	 * @return {Promise<any>} - Returns created category
	 */
	async createCategory(data: any): Promise<any> {
		const response = await this.axiosInstance.post(ENDPOINTS.CATEGORY.HANDLER, data);
		return response.data;
	}

	/**
	 * @return {Promise<any>} - Returns currencies
	 */
	async getCurrencies(): Promise<any> {
		const response = await this.axiosInstance.get(ENDPOINTS.CURRENCIES);
		return response.data;
	}

	/**
	 * @param data - Data for currencies
	 * @return {Promise<any>} - Returns updated currencies
	 */
	async updateCurrencies(data: any): Promise<any> {
		const response = await this.axiosInstance.post(ENDPOINTS.CURRENCIES, data);
		return response.data;
	}

	/**
	 * @return {Promise<any>} - Returns payment methods
	 */
	async getPaymentMethods(): Promise<any> {
		const response = await this.axiosInstance.get(ENDPOINTS.PAYMENT_METHODS);
		return response.data;
	}

	/**
	 * @return {Promise<any>} - Returns delivery methods
	 */
	async getDeliveryMethods(): Promise<any> {
		const response = await this.axiosInstance.get(ENDPOINTS.DELIVERY_METHODS);
		return response.data;
	}

	/**
	 * @return {Promise<any>} - Returns statuses
	 */
	async getStatuses(): Promise<any> {
		const response = await this.axiosInstance.get(ENDPOINTS.STATUSES);
		return response.data;
	}

	/**
	 * @param data - Data for payment
	 * @return {Promise<any>} - Returns created payment
	 */
	async createPayment(data: any): Promise<any> {
		const response = await this.axiosInstance.post(ENDPOINTS.PAYMENT.CREATE, data);
		return response.data;
	}

	/**
	 * @param phoneNumber - Phone number
	 * @return {Promise<any>} - Returns manager and contact data by phone number
	 */
	async getManagerByPhoneNumber(phoneNumber: string): Promise<any> {
		const response = await this.axiosInstance.get(ENDPOINTS.MANAGER.GET_BY_PHONE, {
			params: {
				phone_number: phoneNumber,
			},
		});
		return response.data;
	}

	/**
	 * @return {Promise<any>} - Returns payments list
	 */
	async getPaymentsList(): Promise<any> {
		const response = await this.axiosInstance.get(ENDPOINTS.PAYMENT.LIST);
		return response.data;
	}

	/**
	 * @return {Promise<any>} - Returns invoices list
	 */
	async getInvoicesList(): Promise<any> {
		const response = await this.axiosInstance.get(ENDPOINTS.DOCUMENTS.INVOICE);
		return response.data;
	}

	/**
	 * @return {Promise<any>} - Returns sales invoices list
	 */
	async getSalesInvoicesList(): Promise<any> {
		const response = await this.axiosInstance.get(ENDPOINTS.DOCUMENTS.SALES_INVOICE);
		return response.data;
	}

	/**
	 * @return {Promise<any>} - Returns cash orders list
	 */
	async getCashOrdersList(): Promise<any> {
		const response = await this.axiosInstance.get(ENDPOINTS.DOCUMENTS.CASH_ORDER);
		return response.data;
	}

	/**
	 * @return {Promise<any>} - Returns arrival products list
	 */
	async getArrivalProductsList(): Promise<any> {
		const response = await this.axiosInstance.get(ENDPOINTS.DOCUMENTS.ARRIVAL_PRODUCT);
		return response.data;
	}

	/**
	 * @return {Promise<any>} - Returns acts list
	 */
	async getActsList(): Promise<any> {
		const response = await this.axiosInstance.get(ENDPOINTS.DOCUMENTS.ACT);
		return response.data;
	}

	/**
	 * @return {Promise<any>} - Returns contracts list
	 */
	async getContractsList(): Promise<any> {
		const response = await this.axiosInstance.get(ENDPOINTS.DOCUMENTS.CONTRACT);
		return response.data;
	}

	/**
	 * @return {Promise<any>} - Returns checks list
	 */
	async getChecksList(): Promise<any> {
		const response = await this.axiosInstance.get(ENDPOINTS.DOCUMENTS.CHECK);
		return response.data;
	}

	/**
	 * @param webhook - Webhook
	 * @param data - Data for webhook
	 * @return {Promise<any>} - Returns webhook
	 */
	async postWebhook(webhook: string, data: any): Promise<any> {
		const response = await this.axiosInstance.post(`/${webhook}/`, data);
		return response.data;
	}
}
