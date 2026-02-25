import { IDocumentListResponse, ICashOrder, IDocumentListParams } from "../../../types";
import { DocumentService } from "../DocumentService";
import { TypedQueryBuilder } from "./TypedQueryBuilder";

export class CashOrdersListBuilder extends TypedQueryBuilder<IDocumentListResponse<ICashOrder>> {
  constructor(
    protected readonly documentService: DocumentService,
    protected readonly endpoint: string,
    initialParams?: IDocumentListParams,
  ) {
    super(initialParams);
  }

  protected fetch(): Promise<IDocumentListResponse<ICashOrder>> {
    return this.documentService.fetchDocuments(this.endpoint, this.params) as Promise<IDocumentListResponse<ICashOrder>>;
  }
}