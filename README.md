# SalesDrive API Client

[![npm version](https://badge.fury.io/js/salesdrive-api-client.svg)](https://badge.fury.io/js/salesdrive-api-client)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/DriZ/Salesdrive-API-Client/publish.yml?branch=main)](https://github.com/DriZ/Salesdrive-API-Client/actions/workflows/publish.yml)
[![codecov](https://codecov.io/github/DriZ/Salesdrive-API-Client/graph/badge.svg?token=O3ZNTIYZ1Y)](https://codecov.io/github/DriZ/Salesdrive-API-Client)

A modern, typed, and easy-to-use TypeScript client for the [SalesDrive API](https://api.salesdrive.me/api/docs/).

This library simplifies interaction with the SalesDrive CRM by providing a fully-typed, Promise-based client with a fluent query builder for fetching data, and convenient services for managing orders, products, documents, and more.

## Features

- **Fully Typed**: Written in TypeScript for a great developer experience with autocompletion and type safety.
- **Modern API**: Uses `async/await` and a clean, service-oriented architecture.
- **Fluent Query Builder**: Easily construct complex queries for fetching orders, documents, and more.
- **Comprehensive Services**: Covers major parts of the SalesDrive API:
  - `orders`: Create, find, and update orders.
  - `products`: Manage products and categories.
  - `documents`: Fetch various document types (invoices, acts, etc.).
  - `payments`: Create payments and fetch payment lists.
  - `utils`: Get auxiliary data like statuses, currencies, and delivery methods.
  - `managers`: Find managers.
  - `webhooks`: Send data to webhooks.
- **Robust Error Handling**: Throws custom `SalesDriveError` for easier debugging and handling of API errors.
- **Automatic Retries**: Built-in support for retrying failed requests due to network issues or rate limiting (429).

## Installation

```bash
npm install salesdrive-api-client
```

## Usage

First, you need to get your API Key and domain from your SalesDrive account.

```typescript
import { Client, SalesDriveError } from "salesdrive-api-client";

const apiKey = "YOUR_API_KEY";
const domain = "YOUR_DOMAIN"; // e.g., mycompany

const client = new Client(apiKey, domain);

// Optional: Register a global error handler
client.catch((error) => {
  console.error("Global API Error:", error.message);
});

async function getRecentOrders() {
  try {
    const response = await client.findOrders() // or client.orders.find()
      .status("__NOTDELETED__") // Get all non-deleted orders
      .updatedAtFrom("2026-02-01")
      .limit(25)
      .page(1);

    console.log(`Found ${response.totals.count} total orders.`);

    for (const order of response.data) {
      console.log(
        `- Order #${order.id}, Status: ${order.statusId}, Amount: ${order.paymentAmount}`,
      );
    }
  } catch (error) {
    if (error instanceof SalesDriveError) {
      console.error("API Error:", error.message);
      console.error("Status Code:", error.statusCode);
      if (error.apiErrors) {
        console.error("Validation Errors:", error.apiErrors);
      }
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
}

getRecentOrders();
```

## API Documentation

Detailed documentation for all classes, methods, and types is available on [GitHub Pages](https://driz.github.io/Salesdrive-API-Client/).

## License

This project is licensed under the MIT License.
