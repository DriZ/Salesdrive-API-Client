import axios from "axios";
import axiosRetry from "axios-retry";
import { Client } from "../client";

// Mock axios and axios-retry to isolate the Client logic
// We use a factory to explicitly define the mock structure for both default and named exports
jest.mock("axios", () => {
  const mockCreate = jest.fn();
  const mockIsAxiosError = jest.fn((payload) => !!payload?.isAxiosError);

  // The default export in axios is a function that also has static methods like create, isAxiosError
  const mockAxios: any = jest.fn();
  mockAxios.create = mockCreate;
  mockAxios.isAxiosError = mockIsAxiosError;

  return {
    __esModule: true,
    default: mockAxios,
    isAxiosError: mockIsAxiosError,
    AxiosError: jest.fn(),
  };
});
jest.mock("axios-retry", () => {
  const mockFn = jest.fn();
  (mockFn as any).isNetworkOrIdempotentRequestError = jest.fn();
  (mockFn as any).exponentialDelay = jest.fn();
  return mockFn;
});
const mockedAxios = axios as jest.Mocked<typeof axios>;


describe("Client", () => {
  const apiKey = "test-api-key";
  const domain = "test-domain";

  // Create a reusable mock for the axios instance
  const mockAxiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
    interceptors: {
      response: {
        // We capture the 'use' function to access the registered interceptors
        use: jest.fn(),
      },
    },
  };

  beforeEach(() => {
    // Clear all mocks before each test to ensure isolation
    jest.clearAllMocks();

    // Whenever axios.create is called, return our controlled mock instance
    (axios.create as jest.Mock).mockReturnValue(mockAxiosInstance as any);
    // Mock axios.isAxiosError to return true when the payload has isAxiosError property
    (mockedAxios.isAxiosError as unknown as jest.Mock) = jest.fn((payload) => {
      return !!payload?.isAxiosError;
    });
  });

  describe("Retry Logic", () => {
    it("should initialize axios-retry with correct configuration", () => {
      new Client(apiKey, domain);

      expect(axiosRetry).toHaveBeenCalledTimes(1);
      const config = (axiosRetry as unknown as jest.Mock).mock.calls[0][1];

      expect(config).toMatchObject({
        retries: 3,
        retryDelay: expect.any(Function),
        retryCondition: expect.any(Function),
      });
    });

    it("should retry when status is 429", () => {
      new Client(apiKey, domain);
      const config = (axiosRetry as unknown as jest.Mock).mock.calls[0][1];
      const retryCondition = config.retryCondition;

      // Mock isNetworkOrIdempotentRequestError to return false
      (axiosRetry.isNetworkOrIdempotentRequestError as jest.Mock).mockReturnValue(false);

      const error429 = { response: { status: 429 } };
      expect(retryCondition(error429)).toBe(true);
    });

    it("should retry when isNetworkOrIdempotentRequestError returns true", () => {
      new Client(apiKey, domain);
      const config = (axiosRetry as unknown as jest.Mock).mock.calls[0][1];
      const retryCondition = config.retryCondition;

      (axiosRetry.isNetworkOrIdempotentRequestError as jest.Mock).mockReturnValue(true);

      // Status doesn't matter if isNetwork... returns true
      const errorOther = { response: { status: 500 } };
      expect(retryCondition(errorOther)).toBe(true);
    });
  });

  describe("Order Operations", () => {
    it("should apply date filters (updatedAtFrom)", async () => {
      const client = new Client(apiKey, domain);

      (mockAxiosInstance.get as jest.Mock).mockResolvedValue({
        data: { data: [], totals: { count: 0 } },
      });

      await client
        .findOrders()
        .updatedAtFrom("2023-01-01");

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        "/api/order/list/",
        expect.objectContaining({
          params: expect.objectContaining({
            filter: expect.objectContaining({
              updateAt: { from: "2023-01-01 00:00:00" },
            }),
          }),
        }),
      );
    });

    it("createOrder should post data", async () => {
      const client = new Client(apiKey, domain);
      const mockResponse = { success: true, data: { orderId: 123 } };
      (mockAxiosInstance.post as jest.Mock).mockResolvedValue({
        data: mockResponse,
      });

      const orderData = { fName: "John", lName: "Doe" };
      const result = await client.createOrder(orderData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        "/handler/",
        expect.objectContaining(orderData),
      );
      expect(result).toBe(123);
    });

    it("findOrderById should fetch a single order by ID", async () => {
      const client = new Client(apiKey, domain);
      const mockOrder = { id: 123, fName: "John" };
      (mockAxiosInstance.get as jest.Mock).mockResolvedValue({
        data: { data: [mockOrder] },
      });

      const result = await client.findOrderById(123);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        "/api/order/list/",
        {
          params: {
            "filter[id]": mockOrder.id,
          }
        }
      );
      expect(result).toEqual(mockOrder);
    });
  });
});
