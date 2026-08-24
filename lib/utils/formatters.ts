export type DateInput = string | number | Date;

interface DateFormattingOptions {
  locale?: string;
  timeZone?: string;
  options?: Intl.DateTimeFormatOptions;
}

interface CurrencyFormattingOptions {
  locale?: string;
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

interface PercentageFormattingOptions {
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

function toDate(value: DateInput): Date {
  return value instanceof Date ? value : new Date(value);
}

export function formatDate(
  value: DateInput,
  config: DateFormattingOptions = {},
): string {
  const {
    locale = 'en-US',
    timeZone = 'UTC',
    options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    },
  } = config;

  return new Intl.DateTimeFormat(locale, {
    timeZone,
    ...options,
  }).format(toDate(value));
}

export function formatDateTime(
  value: DateInput,
  config: DateFormattingOptions = {},
): string {
  const {
    locale = 'en-US',
    timeZone = 'UTC',
    options = {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    },
  } = config;

  return new Intl.DateTimeFormat(locale, {
    timeZone,
    ...options,
  }).format(toDate(value));
}

export function formatCurrency(
  value: number,
  config: CurrencyFormattingOptions = {},
): string {
  const {
    locale = 'en-AE',
    currency = 'AED',
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
  } = config;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}

export function formatPercentage(
  value: number,
  config: PercentageFormattingOptions = {},
): string {
  const {
    locale = 'en-US',
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
  } = config;

  return `${new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value)}%`;
}
