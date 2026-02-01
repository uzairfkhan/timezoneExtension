export interface TimezoneOption {
  value: string;
  label: string;
  offset: string;
}

export type TimeFormat = '12h' | '24h';

export interface ConversionResult {
  success: boolean;
  isRange?: boolean;
  // Single time
  convertedTime12?: string;
  convertedTime24?: string;
  formattedOutput12?: string;
  formattedOutput24?: string;
  // Range (start)
  startTime12?: string;
  startTime24?: string;
  // Range (end)
  endTime12?: string;
  endTime24?: string;
  // Range formatted
  rangeOutput12?: string;
  rangeOutput24?: string;
  error?: string;
}

export interface ConversionRequest {
  inputTime: string;
  sourceTimezone: string;
  targetTimezone: string;
}

export interface MessagePayload {
  type: 'CONVERT_SELECTION' | 'GET_SELECTION' | 'SELECTION_RESULT';
  text?: string;
}
