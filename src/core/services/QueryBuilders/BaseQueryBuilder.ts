export interface IBaseParams {
  page?: number;
  limit?: number;
  filter?: any;
}

export abstract class BaseQueryBuilder<
  TParams extends IBaseParams,
  TResponse,
> implements PromiseLike<TResponse>
{
  protected params: TParams;

  constructor(initialParams?: TParams) {
    this.params = (initialParams ? { ...initialParams } : {}) as TParams;
  }

  /**
   * Фильтр устанавливает номер страницы
   * @param {number}page
   */
  public page(page: number): this {
    this.params.page = page;
    return this;
  }

  /**
   * Фильтр устанавливает количество результатов на странице
   * @param {number}limit От 1 до 100
   * @default 50
   */
  public limit(limit: number): this {
    if (limit < 1 || limit > 100) {
      throw new Error("Limit must be between 1 and 100");
    }
    this.params.limit = limit;
    return this;
  }

  protected ensureFilterObject() {
    if (!this.params.filter) {
      this.params.filter = {};
    }
  }

  protected ensureDateFilter(field: string) {
    if (!this.params.filter![field]) {
      this.params.filter![field] = {};
    }
  }

  protected abstract fetch(): Promise<TResponse>;

  public then<TResult1 = TResponse, TResult2 = never>(
    onfulfilled?:
      | ((value: TResponse) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null,
  ): PromiseLike<TResult1 | TResult2> {
    return this.fetch().then(onfulfilled, onrejected);
  }

  public catch<TResult = never>(
    onrejected?:
      | ((reason: any) => TResult | PromiseLike<TResult>)
      | undefined
      | null,
  ): Promise<TResponse | TResult> {
    return this.fetch().catch(onrejected);
  }

  public finally(
    onfinally?: (() => void) | undefined | null,
  ): Promise<TResponse> {
    return this.fetch().finally(onfinally);
  }
}
