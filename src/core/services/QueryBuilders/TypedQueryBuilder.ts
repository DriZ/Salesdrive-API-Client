import { DateOrgFilterQueryBuilder } from "./DateOrgFilterQueryBuilder";

export abstract class TypedQueryBuilder<
  TResponse,
> extends DateOrgFilterQueryBuilder<TResponse> {
  /**
   * Фильтрует по типу
   * @param type "all" - все, "incoming" - входящие, "outcoming" - исходящие
   * @returns {this}
   */
  public type(type: "all" | "incoming" | "outcoming"): this {
    this.ensureFilterObject();
    this.params.filter!.type = type;
    return this;
  }
}
