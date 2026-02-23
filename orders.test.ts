import { Client } from './src';

describe('SalesDrive API Integration Tests', () => {
	const apiKey = process.env.API_KEY;
	const domain = process.env.DOMAIN;

	// Пропускаем тесты, если нет ключей (например, в CI без секретов)
	if (!apiKey || !domain) {
		console.warn('Skipping integration tests because API_KEY or DOMAIN is missing.');
		return;
	}

	const client = new Client(apiKey, domain);

	describe('OrderService', () => {
		test('should fetch orders list successfully', async () => {
			const response = await client.orders.getOrders().limit(5);

			expect(response).toBeDefined();
			expect(response.status).toBe('success');
			expect(Array.isArray(response.data)).toBe(true);

			// Проверяем структуру первой заявки, если она есть
			if (response.data.length > 0) {
				const order = response.data[0];
				expect(order).toHaveProperty('id');
				expect(order).toHaveProperty('paymentAmount');
			}
		});
	});
});
