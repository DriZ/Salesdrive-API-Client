import { SalesDriveDate } from "../types";

export const formatSalesDriveDate = (
  dateString: SalesDriveDate,
  defaultTime: "00:00:00" | "23:59:59",
): string => {
  if (typeof dateString !== "string") {
    return dateString;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return `${dateString} ${defaultTime}`;
  }
  return dateString;
};
