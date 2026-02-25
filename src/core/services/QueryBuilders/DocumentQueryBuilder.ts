import { IDocumentListResponse } from "../../../types";
import { DocumentService } from "../DocumentService";
import { DateOrgFilterQueryBuilder } from "./DateOrgFilterQueryBuilder";

export class DocumentQueryBuilder<
  TResponse = IDocumentListResponse,
> extends DateOrgFilterQueryBuilder<TResponse> {
  constructor(
    protected readonly documentService: DocumentService,
    protected readonly endpoint: string,
    initialParams?: any,
  ) {
    super(initialParams);
  }

  protected fetch(): Promise<TResponse> {
    return this.documentService.fetchDocuments(this.endpoint, this.params) as Promise<TResponse>;
  }
}