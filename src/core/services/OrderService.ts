import { AxiosInstance, AxiosError } from 'axios';
import { IGetOrdersResponse, IGetOrdersParams, TStatusIdFilter, IOrder, IDateFilter, SalesDriveDate, DatedOrderParamsFilter, IAddNoteResponse } from '../../types';
import { SalesDriveError, type ApiErrorData } from '../errors';
import { ENDPOINTS } from '../constants';

// Вспомогательная функция для форматирования даты, можно вынести в утилиты
const formatSalesDriveDate = (dateString: SalesDriveDate, defaultTime: '00:00:00' | '23:59:59'): string => {
	if (typeof dateString !== 'string') {
		return dateString; // Должно быть строкой по типу SalesDriveDate, но для безопасности
	}
	if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
		return `${dateString} ${defaultTime}`;
	}
	return dateString;
};

export class OrderQueryBuilder implements PromiseLike<IGetOrdersResponse> {
	private params: IGetOrdersParams = {};

	constructor(
		private readonly orderService: OrderService, // Теперь принимает OrderService
		initialParams?: IGetOrdersParams
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

	public count(count: number): this {
		this.params.limit = count;
		return this;
	}

	/**
	 * 
	 * @param date дата (YYYY-MM-DD) или дата со временем (YYYY-MM-DD HH:mm:ss)
	 * @returns 
	 */
	public updatedAtFrom(date: SalesDriveDate): this {
		this.ensureFilterObject();
		this.ensureDateFilter('updateAt');
		this.params.filter!.updateAt!.from = date;
		return this;
	}

	public updatedAtTo(date: SalesDriveDate): this {
		this.ensureFilterObject();
		this.ensureDateFilter('updateAt');
		this.params.filter!.updateAt!.to = date;
		return this;
	}

	public orderTimeFrom(date: SalesDriveDate): this {
		this.ensureFilterObject();
		this.ensureDateFilter('orderTime');
		this.params.filter!.orderTime!.from = date;
		return this;
	}

	public orderTimeTo(date: SalesDriveDate): this {
		this.ensureFilterObject();
		this.ensureDateFilter('orderTime');
		this.params.filter!.orderTime!.to = date;
		return this;
	}

	/**
	 * ID статуса в SalesDrive или __NOTELETED__ - все заявки, кроме удалённых или __ALL__ - все заявки
	 * @param {TStatusIdFilter | TStatusIdFilter[]} statusId 
	 * @returns 
	 */
	public status(statusId: TStatusIdFilter | TStatusIdFilter[]): this {
		this.ensureFilterObject();
		this.params.filter!.statusId = statusId;
		return this;
	}

	public idFrom(id: number): this {
		this.ensureFilterObject();
		this.ensureIdFilter();
		this.params.filter!.id!.from = id;
		return this;
	}

	public idTo(id: number): this {
		this.ensureFilterObject();
		this.ensureIdFilter();
		this.params.filter!.id!.to = id;
		return this;
	}

	public setStatusId(statusIds: number | number[]): this {
		this.ensureFilterObject();
		this.params.filter!.setStatusId = Array.isArray(statusIds) ? statusIds : [statusIds];
		return this;
	}

	public setStatusTimeFrom(date: SalesDriveDate): this {
		this.ensureFilterObject();
		this.ensureDateFilter('setStatusTime');
		this.params.filter!.setStatusTime!.from = date;
		return this;
	}

	public setStatusTimeTo(date: SalesDriveDate): this {
		this.ensureFilterObject();
		this.ensureDateFilter('setStatusTime');
		this.params.filter!.setStatusTime!.to = date;
		return this;
	}

	private ensureFilterObject() {
		if (!this.params.filter) {
			this.params.filter = {};
		}
	}

	private ensureDateFilter(field: 'updateAt' | 'orderTime' | 'setStatusTime') {
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
		onfulfilled?: ((value: IGetOrdersResponse) => TResult1 | PromiseLike<TResult1>) | undefined | null,
		onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
	): PromiseLike<TResult1 | TResult2> {
		return this.orderService.fetchOrders(this.params).then(onfulfilled, onrejected);
	}

	public catch<TResult = never>(
		onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
	): Promise<IGetOrdersResponse | TResult> {
		return this.orderService.fetchOrders(this.params).catch(onrejected);
	}

	public finally(onfinally?: (() => void) | undefined | null): Promise<IGetOrdersResponse> {
		return this.orderService.fetchOrders(this.params).finally(onfinally);
	}
}

export class OrderService {
	constructor(private readonly axiosInstance: AxiosInstance) { }

	public getOrders(params?: IGetOrdersParams): OrderQueryBuilder {
		return new OrderQueryBuilder(this, params);
	}

	public async fetchOrders(params?: IGetOrdersParams): Promise<IGetOrdersResponse> {
		const requestParams = params ? { ...params } : {};

		if (requestParams.filter) {
			requestParams.filter = { ...requestParams.filter };
			const dateFields: Array<keyof DatedOrderParamsFilter> = ['updateAt', 'orderTime', 'setStatusTime'];

			for (const field of dateFields) {
				const filterItem = requestParams.filter[field] as IDateFilter | undefined;
				if (filterItem) {
					const newFilterItem: IDateFilter = { ...filterItem };

					if (newFilterItem.from && typeof newFilterItem.from === 'string') {
						newFilterItem.from = formatSalesDriveDate(newFilterItem.from, '00:00:00');
					}
					if (newFilterItem.to && typeof newFilterItem.to === 'string') {
						newFilterItem.to = formatSalesDriveDate(newFilterItem.to, '23:59:59');
					}
					requestParams.filter[field] = newFilterItem;
				}
			}
		}

		const response = await this.axiosInstance.get<IGetOrdersResponse>(ENDPOINTS.ORDER.LIST, { params: requestParams });
		return response.data;
	}

	public async createOrder(data: Partial<IOrder>): Promise<IOrder> {
		const response = await this.axiosInstance.post<IOrder>(ENDPOINTS.ORDER.CREATE, data);
		return response.data;
	}

	public async getOrder(id: number): Promise<IOrder> {
		const response = await this.axiosInstance.get<IGetOrdersResponse>(ENDPOINTS.ORDER.LIST, {
			params: { 'filter[id]': id }, // API expects filter[id] for single ID
		});
		if (response.data.data && response.data.data.length > 0) {
			return response.data.data[0];
		}
		throw new SalesDriveError({
			message: `Order with ID ${id} not found.`,
			response: { status: 404, data: { message: `Order with ID ${id} not found.` } }
		} as AxiosError<ApiErrorData>);
	}

	public async updateOrder(data: Partial<IOrder>): Promise<IOrder> {
		const response = await this.axiosInstance.post<IOrder>(ENDPOINTS.ORDER.UPDATE, data);
		return response.data;
	}

	public async addNoteToOrder(orderId: number, note: string): Promise<IAddNoteResponse> {
		const response = await this.axiosInstance.post(ENDPOINTS.ORDER.NOTE, {
			orderId,
			note
		});
		return response.data;
	}
}
