import { ENDPOINTS } from '../constants';
import { OrderService } from '../services/OrderService';

describe('OrderService', () => {
  let service: OrderService;
  let mockAxios: any;

  beforeEach(() => {
    // Мокаем axios
    mockAxios = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
    };
    service = new OrderService(mockAxios);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getOrders (QueryBuilder)', () => {
    it('should build a simple query with limit and page', async () => {
      // Подготовка мока ответа
      const mockResponse = {
        data: [],
        meta: {},
        pagination: { currentPage: 2 },
        totals: { count: 0 },
      };
      mockAxios.get.mockResolvedValue({ data: mockResponse });

      // Выполнение цепочки методов
      const result = await service.find().limit(20).page(2);

      // Проверка: axios должен быть вызван с правильными параметрами
      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/order/list/'), // Проверяем, что URL содержит нужный путь
        expect.objectContaining({
          params: expect.objectContaining({
            limit: 20,
            page: 2,
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should apply status filter correctly', async () => {
      mockAxios.get.mockResolvedValue({ data: {} });

      await service.find().statusId(5);

      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({
            filter: expect.objectContaining({
              statusId: 5,
            }),
          }),
        })
      );
    });

    it('should apply date filters (updatedAtFrom)', async () => {
      mockAxios.get.mockResolvedValue({ data: {} });
      const date = '2023-01-01';

      await service.find().updatedAtFrom(date);

      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({
            filter: expect.objectContaining({
              updateAt: { from: '2023-01-01 00:00:00' },
            }),
          }),
        })
      );
    });

    it('should chain multiple methods correctly', async () => {
      mockAxios.get.mockResolvedValue({ data: {} });

      await service.find()
        .statusId('__NOTDELETED__')
        .limit(50)
        .orderTimeFrom('2023-10-01');

      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({
            limit: 50,
            filter: expect.objectContaining({
              statusId: '__NOTDELETED__',
              orderTime: { from: '2023-10-01 00:00:00' },
            }),
          }),
        })
      );
    });

    it("should apply id filters (idFrom, idTo)", async () => {
      mockAxios.get.mockResolvedValue({ data: {} });

      await service.find().idFrom(100).idTo(200);

      expect(mockAxios.get).toHaveBeenCalledWith(
        ENDPOINTS.ORDER.LIST,
        expect.objectContaining({
          params: expect.objectContaining({
            filter: expect.objectContaining({
              id: { from: 100, to: 200 },
            }),
          }),
        })
      );
    });

    it("should apply setStatusId filter", async () => {
      mockAxios.get.mockResolvedValue({ data: {} });

      await service.find().setStatusId([1, 2]);

      expect(mockAxios.get).toHaveBeenCalledWith(
        ENDPOINTS.ORDER.LIST,
        expect.objectContaining({
          params: expect.objectContaining({
            filter: expect.objectContaining({
              setStatusId: [1, 2],
            }),
          }),
        })
      );
    });

    it("should apply setStatusTime filters", async () => {
      mockAxios.get.mockResolvedValue({ data: {} });
      const date = "2023-01-01";

      await service.find().setStatusTimeFrom(date).setStatusTimeTo(date);

      expect(mockAxios.get).toHaveBeenCalledWith(
        ENDPOINTS.ORDER.LIST,
        expect.objectContaining({
          params: expect.objectContaining({
            filter: {
              setStatusTime: {
                from: `${date} 00:00:00`,
                to: `${date} 23:59:59`,
              },
            }
          }),
        })
      );
    });
  });

  describe('CRUD operations', () => {
    it('getOrder should fetch a single order by ID', async () => {
      const orderId = 123;
      const mockOrder = { id: orderId, paymentAmount: 100 };
      // Обычно API возвращает объект, обернутый в data
      mockAxios.get.mockResolvedValue({ data: { data: mockOrder } });

      await service.findById(orderId);

      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining(ENDPOINTS.ORDER.LIST),
        {
          params: {
            "filter[id]": orderId
          }
        }
      );
    });

    it('createOrder should post data', async () => {
      const newOrder = { paymentAmount: 200 };
      const createdOrder = { id: 1, ...newOrder };
      mockAxios.post.mockResolvedValue({ data: { data: createdOrder } });

      await service.create(newOrder);

      expect(mockAxios.post).toHaveBeenCalledWith(
        expect.stringContaining(ENDPOINTS.ORDER.CREATE),
        newOrder
      );
    });
  });
});
