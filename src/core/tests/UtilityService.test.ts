import { UtilityService } from "../services/UtilityService";
import { ENDPOINTS } from "../constants";

describe("UtilityService", () => {
  let service: UtilityService;
  let mockAxios: any;

  beforeEach(() => {
    mockAxios = {
      get: jest.fn(),
      post: jest.fn(),
    };
    service = new UtilityService(mockAxios);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getCurrencies", () => {
    it("should fetch currencies successfully", async () => {
      const mockResponseData = {
        baseCurrency: "UAH",
        currencies: [
          { code: "UAH", rate: 1, abbreviation: "грн" },
          { code: "USD", rate: 38.5, abbreviation: "$" },
        ],
      };
      mockAxios.get.mockResolvedValue({ data: mockResponseData });

      const result = await service.getCurrencies();

      expect(mockAxios.get).toHaveBeenCalledWith(ENDPOINTS.CURRENCIES);
      expect(result).toEqual(mockResponseData);
    });

    it("should throw error when fetching currencies fails", async () => {
      const errorMessage = "Failed to fetch currencies";
      mockAxios.get.mockResolvedValue({
        data: { status: "error", message: errorMessage },
      });

      await expect(service.getCurrencies()).rejects.toThrow(errorMessage);
    });
  });

  describe("updateCurrencies", () => {
    it("should update currencies successfully", async () => {
      const updateData = [{ code: "USD", rate: 39.0 }];
      const responseData = { status: "success", message: "Currencies updated" };
      mockAxios.post.mockResolvedValue({ data: responseData });

      const result = await service.updateCurrencies(updateData);

      expect(mockAxios.post).toHaveBeenCalledWith(
        ENDPOINTS.CURRENCIES,
        updateData,
      );
      expect(result).toEqual(responseData);
    });
  });

  describe("getPaymentMethods", () => {
    it("should fetch payment methods successfully", async () => {
      const mockMethods = [{ id: 1, name: "Cash", parameter: "cash" }];
      mockAxios.get.mockResolvedValue({
        data: { success: true, data: mockMethods },
      });

      const result = await service.getPaymentMethods();

      expect(mockAxios.get).toHaveBeenCalledWith(ENDPOINTS.PAYMENT_METHODS);
      expect(result).toEqual(mockMethods);
    });

    it("should throw error when fetching payment methods fails", async () => {
      const errorMessage = "Failed to fetch payment methods";
      mockAxios.get.mockResolvedValue({
        data: { status: "error", message: errorMessage },
      });

      await expect(service.getPaymentMethods()).rejects.toThrow(errorMessage);
    });
  });

  describe("getDeliveryMethods", () => {
    it("should fetch delivery methods successfully", async () => {
      const mockMethods = [{ id: 1, name: "Nova Poshta", parameter: "np" }];
      mockAxios.get.mockResolvedValue({
        data: { success: true, data: mockMethods },
      });

      const result = await service.getDeliveryMethods();

      expect(mockAxios.get).toHaveBeenCalledWith(ENDPOINTS.DELIVERY_METHODS);
      expect(result).toEqual(mockMethods);
    });

    it("should throw error when fetching delivery methods fails", async () => {
      const errorMessage = "Failed to fetch delivery methods";
      mockAxios.get.mockResolvedValue({
        data: { status: "error", message: errorMessage },
      });

      await expect(service.getDeliveryMethods()).rejects.toThrow(errorMessage);
    });
  });

  describe("getStatuses", () => {
    it("should fetch statuses successfully", async () => {
      const mockStatuses = [{ id: 1, name: "New", type: 1 }];
      mockAxios.get.mockResolvedValue({
        data: { success: true, data: mockStatuses },
      });

      const result = await service.getStatuses();

      expect(mockAxios.get).toHaveBeenCalledWith(ENDPOINTS.STATUSES);
      expect(result).toEqual(mockStatuses);
    });

    it("should throw error when fetching statuses fails", async () => {
      const errorMessage = "Failed to fetch statuses";
      mockAxios.get.mockResolvedValue({
        data: { status: "error", message: errorMessage },
      });

      await expect(service.getStatuses()).rejects.toThrow(errorMessage);
    });
  });
});
