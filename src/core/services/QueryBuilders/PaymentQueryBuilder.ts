import {
  IPaymentListParams,
  IPaymentListResponse,
} from "../../../types";
import { PaymentService } from "../PaymentService";
import { TypedQueryBuilder } from "./TypedQueryBuilder";

export class PaymentQueryBuilder extends TypedQueryBuilder<
  IPaymentListResponse
> {
  constructor(
    protected readonly paymentService: PaymentService,
    initialParams?: IPaymentListParams,
  ) {
    super(initialParams);
  }

  protected fetch(): Promise<IPaymentListResponse> {
    return this.paymentService.fetchPayments(this.params);
  }
}
