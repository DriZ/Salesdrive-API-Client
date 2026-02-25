/**
 * Менеджер.
 */
export interface IManager {
  id: number;
  fName: string;
  lName: string;
  phone: string;
}

/**
 * Клиент (контактное лицо).
 */
export interface IClient {
  id: number;
  fName: string;
  lName: string;
  mName: string;
  company: string;
}

/**
 * Успешный ответ поиска менеджера по телефону.
 * @see https://api.salesdrive.me/api/docs/#/call/call-manager
 */
export interface IGetManagerByPhoneResponse {
  status: "success";
  manager: IManager;
  client: IClient;
}

/**
 * Ошибка поиска менеджера по телефону.
 * @see https://api.salesdrive.me/api/docs/#/call/call-manager
 */
export interface IGetManagerByPhoneErrorResponse {
  status: "error";
  message?: string;
}

/**
 * Тип ответа поиска менеджера (успех или ошибка).
 */
export type TGetManagerByPhoneResponse = IGetManagerByPhoneResponse | IGetManagerByPhoneErrorResponse;