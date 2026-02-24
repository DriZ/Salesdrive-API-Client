import { type AxiosInstance } from "axios";
import { ENDPOINTS } from "../constants";
export interface IManager {
  id: number;
  fName: string;
  lName: string;
  phone: string;
}

export class ManagerService {
  constructor(private readonly axiosInstance: AxiosInstance) {}

  /**
   * @param phoneNumber - Phone number
   * @return {Promise<any>} - Returns manager and contact data by phone number
   */
  async getManagerByPhoneNumber(phoneNumber: string): Promise<IManager> {
    const response = await this.axiosInstance.get(
      ENDPOINTS.MANAGER.GET_BY_PHONE,
      {
        params: {
          phone_number: phoneNumber,
        },
      },
    );
    return response.data;
  }
}
