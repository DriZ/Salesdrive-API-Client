import { IGetOrdersParams, IGetOrdersResponse, SalesDriveDate, TStatusIdFilter } from "../../../types";
import { OrderService } from "../OrderService";
import { BaseQueryBuilder } from "./BaseQueryBuilder";

export class OrderQueryBuilder extends BaseQueryBuilder<
  IGetOrdersParams,
  IGetOrdersResponse
> {
  constructor(
    private readonly orderService: OrderService,
    initialParams?: IGetOrdersParams,
  ) {
    super(initialParams);
  }

  protected fetch(): Promise<IGetOrdersResponse> {
    return this.orderService.fetchOrders(this.params);
  }

  /**
   * Фильтр устанавливает начальную дату изменения заявки
   * @param date дата (YYYY-MM-DD), дата со временем (YYYY-MM-DD HH:mm:ss) или объект `Date`
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
   * @param date дата (YYYY-MM-DD), дата со временем (YYYY-MM-DD HH:mm:ss) или объект `Date`
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
   * @param date дата (YYYY-MM-DD), дата со временем (YYYY-MM-DD HH:mm:ss) или объект `Date`
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
   * @param date дата (YYYY-MM-DD), дата со временем (YYYY-MM-DD HH:mm:ss) или объект `Date`
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
   * @param date дата (YYYY-MM-DD), дата со временем (YYYY-MM-DD HH:mm:ss) или объект `Date`
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
   * @param date Date() дата (YYYY-MM-DD), дата со временем (YYYY-MM-DD HH:mm:ss) или объект `Date`
   * @example setStatusTimeTo("2025-01-01 10:15:00")
   * @example setStatusTimeTo(new Date().setMonth(2))
   * @returns {OrderQueryBuilder}
   */
  public setStatusTimeTo(date: SalesDriveDate): this {
    this.ensureFilterObject();
    this.ensureDateFilter("setStatusTime");
    this.params.filter!.setStatusTime!.to = date;
    return this;
  }

  private ensureIdFilter() {
    if (!this.params.filter!.id) {
      this.params.filter!.id = {};
    }
  }
}