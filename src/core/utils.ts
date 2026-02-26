import { FormatedSalesDriveDate, SalesDriveDate } from "../types";

const pad = (num: number) => num.toString().padStart(2, "0");

const dateToYMDHMS = (date: Date): FormatedSalesDriveDate => {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds(),
  )}` as FormatedSalesDriveDate;
};

export const formatSalesDriveDate = (
  date: SalesDriveDate,
  defaultTime: "00:00:00" | "23:59:59"
): FormatedSalesDriveDate => {
  if (date instanceof Date) {
    return dateToYMDHMS(date);
  }
  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return `${date} ${defaultTime}` as FormatedSalesDriveDate;
  }
  if (typeof date === "number") {
    const d = new Date(date);
    const year = d.getFullYear();
    if (year < 2000 || year > 2100) {
      throw new Error(`The provided timestamp ${date} results in a date outside the reasonable range (year 2000-2100): ${d.toISOString()}. If this is intentional, please use a string or Date object format.`);
    }
    return dateToYMDHMS(d);
  }
  return date as FormatedSalesDriveDate;
};
