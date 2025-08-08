/**
 * 合約編號生成工具
 * 格式：YYYYMMDDHHMM (年+月+日+時分)
 * 例如：202412011430 (2024年12月01日14時30分)
 */

/**
 * 生成合約編號
 *
 * @param date 可選的日期，默認使用當前時間
 * @returns 合約編號字符串
 */
export function generateContractNumber(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');

  return `${year}${month}${day}${hour}${minute}`;
}

/**
 * 驗證合約編號格式
 *
 * @param contractNumber 合約編號
 * @returns 是否為有效格式
 */
export function isValidContractNumber(contractNumber: string): boolean {
  // 檢查是否為12位數字
  const regex = /^\d{12}$/;
  if (!regex.test(contractNumber)) {
    return false;
  }

  // 檢查日期部分是否有效
  const year = parseInt(contractNumber.substring(0, 4));
  const month = parseInt(contractNumber.substring(4, 6));
  const day = parseInt(contractNumber.substring(6, 8));
  const hour = parseInt(contractNumber.substring(8, 10));
  const minute = parseInt(contractNumber.substring(10, 12));

  // 基本範圍檢查
  if (year < 2020 || year > 2030) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (hour < 0 || hour > 23) return false;
  if (minute < 0 || minute > 59) return false;

  return true;
}

/**
 * 解析合約編號為日期
 *
 * @param contractNumber 合約編號
 * @returns 日期對象
 */
export function parseContractNumberToDate(contractNumber: string): Date {
  const year = parseInt(contractNumber.substring(0, 4));
  const month = parseInt(contractNumber.substring(4, 6)) - 1; // 月份從0開始
  const day = parseInt(contractNumber.substring(6, 8));
  const hour = parseInt(contractNumber.substring(8, 10));
  const minute = parseInt(contractNumber.substring(10, 12));

  return new Date(year, month, day, hour, minute);
}

/**
 * 格式化合約編號顯示
 *
 * @param contractNumber 合約編號
 * @returns 格式化後的顯示字符串
 */
export function formatContractNumber(contractNumber: string): string {
  if (!isValidContractNumber(contractNumber)) {
    return contractNumber;
  }

  const year = contractNumber.substring(0, 4);
  const month = contractNumber.substring(4, 6);
  const day = contractNumber.substring(6, 8);
  const hour = contractNumber.substring(8, 10);
  const minute = contractNumber.substring(10, 12);

  return `${year}-${month}-${day} ${hour}:${minute}`;
}
