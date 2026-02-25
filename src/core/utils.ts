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
  return date as FormatedSalesDriveDate;
};
