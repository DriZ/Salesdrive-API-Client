import {
  IGetOrdersParams,
  IGetOrdersResponse,
  SalesDriveDate,
  TStatusIdFilter,
  TTypeIdFilter,
} from "../../../types";
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
   * Sets the start date for order update time filter.
   * @param date A date (YYYY-MM-DD), a date with time (YYYY-MM-DD HH:mm:ss), or a `Date` object.
   * @returns {this}
   */
  public updatedAtFrom(date: SalesDriveDate): this {
    this.ensureFilterObject();
    this.ensureDateFilter("updateAt");
    this.params.filter!.updateAt!.from = date;
    return this;
  }

  /**
   * Sets the end date for order update time filter.
   * @param date A date (YYYY-MM-DD), a date with time (YYYY-MM-DD HH:mm:ss), or a `Date` object.
   * @returns {this}
   */
  public updatedAtTo(date: SalesDriveDate): this {
    this.ensureFilterObject();
    this.ensureDateFilter("updateAt");
    this.params.filter!.updateAt!.to = date;
    return this;
  }

  /**
   * Sets the start date for order creation time filter.
   * @param date A date (YYYY-MM-DD), a date with time (YYYY-MM-DD HH:mm:ss), or a `Date` object.
   * @returns {this}
   */
  public orderTimeFrom(date: SalesDriveDate): this {
    this.ensureFilterObject();
    this.ensureDateFilter("orderTime");
    this.params.filter!.orderTime!.from = date;
    return this;
  }

  /**
   * Sets the end date for order creation time filter.
   * @param date A date (YYYY-MM-DD), a date with time (YYYY-MM-DD HH:mm:ss), or a `Date` object.
   * @returns {this}
   */
  public orderTimeTo(date: SalesDriveDate): this {
    this.ensureFilterObject();
    this.ensureDateFilter("orderTime");
    this.params.filter!.orderTime!.to = date;
    return this;
  }

  /**
   * Status ID in SalesDrive, `__NOTDELETED__` for all non-deleted orders, or `__ALL__` for all orders.
   * @param {TStatusIdFilter | TStatusIdFilter[]} statusId
   * @returns {this}
   */
  public statusId(statusId: TStatusIdFilter | TStatusIdFilter[]): this {
    this.ensureFilterObject();
    this.params.filter!.statusId = Array.isArray(statusId)
      ? statusId
      : [statusId];
    return this;
  }

  /**
   * Order type in SalesDrive.
   * @param {TTypeIdFilter | TTypeIdFilter[]} typeId
   * @returns {this}
   */
  public typeId(typeId: TTypeIdFilter | TTypeIdFilter[]): this {
    this.ensureFilterObject();
    this.params.filter!.typeId = Array.isArray(typeId) ? typeId : [typeId];
    return this;
  }

  /**
   * Sets the order's manager ID for filtering.
   * @param {number | number[]} userId
   * @returns {this}
   */
  public userId(userId: number | number[]): this {
    this.ensureFilterObject();
    this.params.filter!.userId = Array.isArray(userId) ? userId : [userId];
    return this;
  }

  /**
   * Filters by organization ID(s).
   * @param {number | number[]} ids
   * @returns {this}
   */
  public organizationId(ids: number | number[]): this {
    this.ensureFilterObject();
    this.params.filter!.organizationId = Array.isArray(ids) ? ids : [ids];
    return this;
  }

  /**
   * Sets the starting order ID for filtering.
   * @param {number} id
   * @returns {this}
   */
  public idFrom(id: number): this {
    this.ensureFilterObject();
    this.ensureIdFilter();
    this.params.filter!.id!.from = id;
    return this;
  }

  /**
   * Sets the ending order ID for filtering.
   * @param {number} id
   * @returns {this}
   */
  public idTo(id: number): this {
    this.ensureFilterObject();
    this.ensureIdFilter();
    this.params.filter!.id!.to = id;
    return this;
  }

  /**
   * Sets the status ID in SalesDrive or an array of status IDs for filtering.
   * @param {number | number[]} statusIds
   * @returns {this}
   */
  public setStatusId(statusIds: number | number[]): this {
    this.ensureFilterObject();
    this.params.filter!.setStatusId = Array.isArray(statusIds)
      ? statusIds
      : [statusIds];
    return this;
  }

  /**
   * Sets the start date for order status change time filter.
   * @param date A date (YYYY-MM-DD), a date with time (YYYY-MM-DD HH:mm:ss), or a `Date` object.
   * @example setStatusTimeFrom("2025-01-01 10:15:00")
   * @returns {this}
   */
  public setStatusTimeFrom(date: SalesDriveDate): this {
    this.ensureFilterObject();
    this.ensureDateFilter("setStatusTime");
    this.params.filter!.setStatusTime!.from = date;
    return this;
  }

  /**
   * Sets the end date for order status change time filter.
   * @param date A date (YYYY-MM-DD), a date with time (YYYY-MM-DD HH:mm:ss), or a `Date` object.
   * @example setStatusTimeTo("2025-01-01 10:15:00")
   * @example setStatusTimeTo(new Date().setMonth(2))
   * @returns {this}
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
