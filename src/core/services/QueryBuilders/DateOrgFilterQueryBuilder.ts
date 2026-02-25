import { IFilterableListParams, SalesDriveDate } from "../../../types";
import { BaseQueryBuilder } from "./BaseQueryBuilder";

export abstract class DateOrgFilterQueryBuilder<
  TResponse,
> extends BaseQueryBuilder<IFilterableListParams, TResponse> {
  /**
   * Фильтрует по начальной дате изменения
   * @param date дата (YYYY-MM-DD), дата со временем (YYYY-MM-DD HH:mm:ss) или объект `Date`
   * @returns {this}
   */
  public updatedAtFrom(date: SalesDriveDate): this {
    this.ensureFilterObject();
    this.ensureDateFilter("updatedAt");
    this.params.filter!.updatedAt!.from = date;
    return this;
  }

  /**
   * Фильтрует по конечной дате изменения
   * @param date дата (YYYY-MM-DD), дата со временем (YYYY-MM-DD HH:mm:ss) или объект `Date`
   * @returns {this}
   */
  public updatedAtTo(date: SalesDriveDate): this {
    this.ensureFilterObject();
    this.ensureDateFilter("updatedAt");
    this.params.filter!.updatedAt!.to = date;
    return this;
  }

  /**
   * Фильтрует по начальной дате
   * @param date дата (YYYY-MM-DD), дата со временем (YYYY-MM-DD HH:mm:ss) или объект `Date`
   * @returns {this}
   */
  public dateFrom(date: SalesDriveDate): this {
    this.ensureFilterObject();
    this.ensureDateFilter("date");
    this.params.filter!.date!.from = date;
    return this;
  }

  /**
   * Фильтрует по конечной дате
   * @param date дата (YYYY-MM-DD), дата со временем (YYYY-MM-DD HH:mm:ss) или объект `Date`
   * @returns {this}
   */
  public dateTo(date: SalesDriveDate): this {
    this.ensureFilterObject();
    this.ensureDateFilter("date");
    this.params.filter!.date!.to = date;
    return this;
  }

  /**
   * Фильтрует по начальной дате создания
   * @param date дата (YYYY-MM-DD), дата со временем (YYYY-MM-DD HH:mm:ss) или объект `Date`
   * @returns {this}
   */
  public createdAtFrom(date: SalesDriveDate): this {
    this.ensureFilterObject();
    this.ensureDateFilter("createdAt");
    this.params.filter!.createdAt!.from = date;
    return this;
  }

  /**
   * Фильтрует по конечной дате создания
   * @param date дата (YYYY-MM-DD), дата со временем (YYYY-MM-DD HH:mm:ss) или объект `Date`
   * @returns {this}
   */
  public createdAtTo(date: SalesDriveDate): this {
    this.ensureFilterObject();
    this.ensureDateFilter("createdAt");
    this.params.filter!.createdAt!.to = date;
    return this;
  }

  /**
   * Фильтрует по ID организации
   * @param {number | number[]}ids
   * @returns {this}
   */
  public organizationId(ids: number | number[]): this {
    this.ensureFilterObject();
    this.params.filter!.organizationId = Array.isArray(ids) ? ids : [ids];
    return this;
  }
}
