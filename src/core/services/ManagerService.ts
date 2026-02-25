import { type AxiosInstance } from "axios";
import { ENDPOINTS } from "../constants";
import type { TGetManagerByPhoneResponse } from "../../types";


export class ManagerService {
  constructor(private readonly axiosInstance: AxiosInstance) {}

  /**
   * @param phoneNumber - Phone number
   * @return {Promise<any>} - Returns manager and contact data by phone number
   */
  async findByPhone(phoneNumber: string): Promise<TGetManagerByPhoneResponse> {
    const response = await this.axiosInstance.get<TGetManagerByPhoneResponse>(ENDPOINTS.MANAGER.GET_BY_PHONE+phoneNumber);
    return response.data;
  }
}
