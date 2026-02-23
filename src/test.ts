import { Client } from './core/client.js'

const apiKey = process.env.API_KEY;
const domain = process.env.DOMAIN;

async function main() {
	if (!apiKey || !domain) {
		throw new Error('API_KEY and DOMAIN environment variables are required');
	}

	const client = new Client(apiKey, domain);
	const orders = await client.getOrders().updatedAtFrom('2026-02-01').updatedAtTo('2026-02-28').page(1).limit(10).setStatusId(4622)
	console.log(orders.data.map(order => `Заказ ${order.id}, форма ${order.formId}, сумма ${order.paymentAmount}`))
}

main().catch(e => {
	console.error(e);
	process.exit(1);
});
