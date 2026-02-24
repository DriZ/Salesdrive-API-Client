import { OrderService } from "../src/core/services/OrderService";
import { ENDPOINTS } from "../src/core/constants";
import { mock } from "node:test";

describe("OrderService", () => {
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

    describe("find (QueryBuilder)", () => {
        it("should build a simple query with limit and page", async () => {
            // Подготовка мока ответа
            const mockResponse = {
                data: [],
                meta: {},
                pagination: { currentPage: 2 },
                totals: { count: 0 },
            };
            mockAxios.get.mockResolvedValue({ data: mockResponse });

            // Выполнение цепочки методов
            const result = await service.find().count(20).page(2);

            // Проверка: axios должен быть вызван с правильными параметрами
            expect(mockAxios.get).toHaveBeenCalledWith(
                ENDPOINTS.ORDER.LIST,
                expect.objectContaining({
                    params: expect.objectContaining({
                        limit: 20,
                        page: 2,
                    }),
                }),
            );
            expect(result).toEqual(mockResponse);
        });

        it("should build a query with status filter", async () => {
            const mockResponse = {
                data: [
                    { id: 1, statusId: 123 },
                ],
            };
            mockAxios.get.mockResolvedValue({ data: mockResponse });

            await service.find().statusId(123);
            expect(mockAxios.get).toHaveBeenCalledWith(
                ENDPOINTS.ORDER.LIST,
                expect.objectContaining({
                    params: expect.objectContaining({
                        filter: expect.objectContaining({
                            statusId: 123,
                        }),
                    }),
                }),
            );
        });

        it("should apply status filter correctly", async () => {
            mockAxios.get.mockResolvedValue({ data: {} });

            await service.find().statusId(5);

            expect(mockAxios.get).toHaveBeenCalledWith(
                ENDPOINTS.ORDER.LIST,
                expect.objectContaining({
                    params: expect.objectContaining({
                        filter: expect.objectContaining({
                            statusId: 5,
                        }),
                    }),
                }),
            );
        });

        it("should apply date filters (updatedAtFrom)", async () => {
            mockAxios.get.mockResolvedValue({ data: {} });
            const date = "2023-01-01";

            await service.find().updatedAtFrom(date).updatedAtTo(date);

            expect(mockAxios.get).toHaveBeenCalledWith(
                ENDPOINTS.ORDER.LIST,
                expect.objectContaining({
                    params: expect.objectContaining({
                        filter: expect.objectContaining({
                            updateAt: { 
                                from: `${date} 00:00:00`,
                                to: `${date} 23:59:59`,
                            } // Сервис добавляет время
                        }),
                    }),
                }),
            );
        });

        it("should chain multiple methods correctly", async () => {
            mockAxios.get.mockResolvedValue({ data: {} });

            await service
                .find()
                .statusId("__NOTDELETED__")
                .limit(50)
                .orderTimeFrom("2023-10-01");

            expect(mockAxios.get).toHaveBeenCalledWith(
                ENDPOINTS.ORDER.LIST,
                expect.objectContaining({
                    params: expect.objectContaining({
                        limit: 50,
                        filter: expect.objectContaining({
                            statusId: "__NOTDELETED__",
                            orderTime: { from: "2023-10-01 00:00:00" },
                        }),
                    }),
                }),
            );
        });

        it("Should apply date filters (orderTimeFrom)", async () => {
            mockAxios.get.mockResolvedValue({ data: {} });
            const date = "2023-01-01";

            await service.find().orderTimeFrom(date).orderTimeTo(date);

            expect(mockAxios.get).toHaveBeenCalledWith(
                ENDPOINTS.ORDER.LIST,
                expect.objectContaining({
                    params: expect.objectContaining({
                        filter: expect.objectContaining({
                            orderTime: {
                                from: `${date} 00:00:00`,
                                to: `${date} 23:59:59`,
                            },
                        }),
                    }),
                })
            );
        });
    });

    describe("CRUD operations", () => {
        it("getOrder should fetch a single order by ID", async () => {
            const orderId = 123;
            const mockOrder = { id: orderId, paymentAmount: 100 };
            // Обычно API возвращает объект, обернутый в data
            mockAxios.get.mockResolvedValue({ data: { data: mockOrder } });

            await service.findById(orderId);

            expect(mockAxios.get).toHaveBeenCalledWith(
                ENDPOINTS.ORDER.LIST,
                expect.objectContaining({
                    params: { "filter[id]": orderId },
                })
            );
        });

        it("createOrder should post data", async () => {
            const newOrder = { paymentAmount: 200 };
            const createdOrder = { id: 1, ...newOrder };
            mockAxios.post.mockResolvedValue({ data: { data: createdOrder } });

            await service.create(newOrder);

            expect(mockAxios.post).toHaveBeenCalledWith(
                ENDPOINTS.ORDER.CREATE,
                newOrder,
            );
        });
    });

    describe("update", () => {
        it("should update order by numeric ID", async () => {
            mockAxios.post.mockResolvedValue({ data: { success: true } });
            const updateData = { comment: "New comment" };

            const result = await service.update(123, updateData);

            expect(mockAxios.post).toHaveBeenCalledWith(
                ENDPOINTS.ORDER.UPDATE,
                {
                    id: 123,
                    data: updateData,
                }
            );
            expect(result).toBe(true);
        });

        it("should update order by external ID (string)", async () => {
            mockAxios.post.mockResolvedValue({ data: { success: true } });
            const updateData = { statusId: 2 };

            const result = await service.update("ext-123", updateData);

            expect(mockAxios.post).toHaveBeenCalledWith(
                ENDPOINTS.ORDER.UPDATE,
                {
                    externalId: "ext-123",
                    data: updateData,
                }
            );
            expect(result).toBe(true);
        });
    });

    describe("addNote", () => {
        it("should add note to order", async () => {
            const mockResponse = { success: true, data: { noteId: 1 } };
            mockAxios.post.mockResolvedValue({ data: mockResponse });

            const result = await service.addNote(123, "Test note");

            expect(mockAxios.post).toHaveBeenCalledWith(
                ENDPOINTS.ORDER.NOTE,
                {
                    orderId: 123,
                    note: "Test note",
                }
            );
            expect(result).toEqual(mockResponse);
        });
    });
});
