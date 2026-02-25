import { type AxiosInstance } from "axios";

export class WebhookService {
  constructor(private readonly axiosInstance: AxiosInstance) {}

  /**
   * @param webhook - Webhook
   * @param data - Data for webhook
   * @return {Promise<any>} - Returns webhook
   */
  async postWebhook(webhook: string, data: any): Promise<any> {
    const response = await this.axiosInstance.post(`/${webhook}/`, data);
    return response.data;
  }
}
