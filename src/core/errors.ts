import { type AxiosError } from 'axios';

// Этот интерфейс можно расширить, если API возвращает другие поля в теле ошибки
export interface ApiErrorData {
	message?: string;
	errors?: Record<string, string[]>;
}

/**
 * Кастомный класс ошибки для более удобной обработки ошибок от SalesDrive API.
 */
export class SalesDriveError extends Error {
	/** Исходная ошибка от Axios. */
	public readonly originalError: AxiosError<ApiErrorData>;
	/** HTTP статус-код ответа. */
	public readonly statusCode?: number;
	/** Детальные ошибки валидации от API. */
	public readonly apiErrors?: Record<string, string[]>;

	constructor(error: AxiosError<ApiErrorData>) {
		const apiMessage = error.response?.data?.message;
		const errorMessage = apiMessage || error.message;

		super(errorMessage);
		this.name = 'SalesDriveError';
		this.originalError = error;
		this.statusCode = error.response?.status;
		this.apiErrors = error.response?.data?.errors;
	}
}
