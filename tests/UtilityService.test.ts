import { UtilityService } from "../src/core/services/UtilityService";
import { ENDPOINTS } from "../src/core/constants";

describe("UtilityService", () => {
  let service: UtilityService;
  let mockAxios: any;

  beforeEach(() => {
    // Создаем простой мок для axios
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
      const mockData = [
        { id: 1, name: "UAH", code: "UAH", rate: 1, isBase: true },
      ];
      mockAxios.get.mockResolvedValue({ data: mockData });

      const result = await service.getCurrencies();

      expect(mockAxios.get).toHaveBeenCalledWith(ENDPOINTS.CURRENCIES);
      expect(result).toEqual(mockData);
    });
  });

  describe("updateCurrencies", () => {
    it("should update currencies successfully", async () => {
      const updateData = [{ id: 1, rate: 1.5 }];
      const responseData = [{ id: 1, rate: 1.5, code: "UAH" }];
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
      const mockData = [{ id: 1, name: "Cash", active: true }];
      mockAxios.get.mockResolvedValue({ data: mockData });

      const result = await service.getPaymentMethods();

      expect(mockAxios.get).toHaveBeenCalledWith(ENDPOINTS.PAYMENT_METHODS);
      expect(result).toEqual(mockData);
    });
  });

  describe("getDeliveryMethods", () => {
    it("should fetch delivery methods successfully", async () => {
      const mockData = [{ id: 1, name: "Nova Poshta", active: true }];
      mockAxios.get.mockResolvedValue({ data: mockData });

      const result = await service.getDeliveryMethods();

      expect(mockAxios.get).toHaveBeenCalledWith(ENDPOINTS.DELIVERY_METHODS);
      expect(result).toEqual(mockData);
    });
  });

  describe("getStatuses", () => {
    it("should fetch statuses successfully", async () => {
      const mockData = [{ id: 1, name: "New", color: "#fff" }];
      mockAxios.get.mockResolvedValue({ data: mockData });

      const result = await service.getStatuses();

      expect(mockAxios.get).toHaveBeenCalledWith(ENDPOINTS.STATUSES);
      expect(result).toEqual(mockData);
    });
  });
});
