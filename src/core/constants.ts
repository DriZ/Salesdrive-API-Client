export const ENDPOINTS = {
  ORDER: {
    LIST: "/api/order/list/",
    CREATE: "/handler/",
    UPDATE: "/api/order/update/",
    NOTE: "/api/order/note/",
  },
  PRODUCT: {
    HANDLER: "/product-handler/",
  },
  CATEGORY: {
    HANDLER: "/category-handler/",
  },
  CURRENCIES: "/api/currencies/",
  PAYMENT_METHODS: "/api/payment-methods/",
  DELIVERY_METHODS: "/api/delivery-methods/",
  STATUSES: "/api/statuses/",
  PAYMENT: {
    CREATE: "/api/payment/",
    LIST: "/api/payment/list/",
  },
  MANAGER: {
    GET_BY_PHONE: "/api/get_manager_by_phone_number/?phone=",
  },
  DOCUMENTS: {
    INVOICE: "/api/invoice/list/",
    SALES_INVOICE: "/api/sales-invoice/list/",
    CASH_ORDER: "/api/cash-order/list/",
    ARRIVAL_PRODUCT: "/api/arrival-product/list/",
    ACT: "/api/act/list/",
    CONTRACT: "/api/contract/list/",
    CHECK: "/api/check/list/",
  },
} as const;
export type ENDPOINTS = typeof ENDPOINTS;