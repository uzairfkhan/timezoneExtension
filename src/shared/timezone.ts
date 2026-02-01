import { DateTime } from 'luxon';
import { ConversionResult } from './types';
import { TIMEZONE_ABBREVIATIONS, TIME_FORMATS } from './constants';

/**
 * Detects the user's local timezone using the browser API
 */
export function detectLocalTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Normalizes time string by expanding A/P to AM/PM
 */
function normalizeTimeString(input: string): string {
  // Replace standalone A/P with AM/PM (but not when part of a word)
  // Handles: 8:00A, 8:00 A, 8:00a, 8A, etc.
  return input
    .replace(/(\d)\s*A(?!\w)/gi, '$1 AM')
    .replace(/(\d)\s*P(?!\w)/gi, '$1 PM');
}

/**
 * Extracts timezone from the end of a string
 * Returns the timezone IANA name and the remaining time string
 */
function extractTimezone(input: string): { timeString: string; timezone: string | null } {
  const normalized = input.trim();

  // Sort timezone keys by length (longest first) to match "Pacific Time" before "Pacific"
  const sortedKeys = Object.keys(TIMEZONE_ABBREVIATIONS).sort((a, b) => b.length - a.length);

  for (const key of sortedKeys) {
    // Check if input ends with this timezone (case-insensitive)
    const regex = new RegExp(`\\s+${key.replace(/\s+/g, '\\s+')}$`, 'i');
    if (regex.test(normalized)) {
      const timeString = normalized.replace(regex, '').trim();
      return { timeString, timezone: TIMEZONE_ABBREVIATIONS[key] };
    }
  }

  return { timeString: normalized, timezone: null };
}

/**
 * Parses a time input string and returns a DateTime object
 * Supports various formats: "3:00 PM", "15:00", "3pm", "8:00A Pacific", etc.
 */
export function parseTimeInput(
  input: string,
  defaultTimezone: string = detectLocalTimezone()
): { dateTime: DateTime | null; detectedTimezone: string | null } {
  // First, extract timezone from the end
  const { timeString: withoutTz, timezone: detectedTimezone } = extractTimezone(input);

  // Normalize A/P to AM/PM
  const normalizedTime = normalizeTimeString(withoutTz);

  const timezone = detectedTimezone || defaultTimezone;

  // Try various time formats
  const formats = [
    'h:mm a',      // 3:00 PM
    'h:mma',       // 3:00PM
    'hh:mm a',     // 03:00 PM
    'hh:mma',      // 03:00PM
    'H:mm',        // 15:00
    'HH:mm',       // 15:00
    'h a',         // 3 PM
    'ha',          // 3PM
    'h:mm:ss a',   // 3:00:00 PM
    'HH:mm:ss',    // 15:00:00
  ];

  for (const format of formats) {
    const parsed = DateTime.fromFormat(normalizedTime, format, { zone: timezone });
    if (parsed.isValid) {
      return { dateTime: parsed, detectedTimezone };
    }
  }

  // Try ISO format
  const isoDate = DateTime.fromISO(normalizedTime, { zone: timezone });
  if (isoDate.isValid) {
    return { dateTime: isoDate, detectedTimezone };
  }

  return { dateTime: null, detectedTimezone: null };
}

/**
 * Converts a DateTime from one timezone to another
 */
export function convertTime(
  time: DateTime,
  fromZone: string,
  toZone: string
): DateTime {
  return time.setZone(fromZone).setZone(toZone);
}

/**
 * Formats a DateTime using the specified format
 */
export function formatTime(
  time: DateTime,
  format: keyof typeof TIME_FORMATS | string = 'long'
): string {
  const formatString = TIME_FORMATS[format as keyof typeof TIME_FORMATS] || format;
  return time.toFormat(formatString);
}

/**
 * Detects if the input is a time range and splits it
 * Supports: "to", "-", "–", "—", "until", "till"
 */
function parseTimeRange(input: string): { isRange: boolean; start: string; end: string; timezone: string | null } {
  // First extract timezone from the end
  const { timeString, timezone } = extractTimezone(input);

  // Range separators (order matters - check longer ones first)
  const separators = [' until ', ' till ', ' to ', ' – ', ' — ', ' - ', '–', '—', '-'];

  for (const sep of separators) {
    const parts = timeString.split(new RegExp(sep, 'i'));
    if (parts.length === 2) {
      let start = parts[0].trim();
      let end = parts[1].trim();

      // If end time doesn't have AM/PM but start does, inherit it
      // e.g., "9:00 AM to 11:30" -> "9:00 AM" and "11:30 AM"
      const ampmMatch = start.match(/(AM|PM|A|P)$/i);
      if (ampmMatch && !/(AM|PM|A|P)$/i.test(end)) {
        end = end + ' ' + ampmMatch[1];
      }

      return { isRange: true, start, end, timezone };
    }
  }

  return { isRange: false, start: timeString, end: '', timezone };
}

/**
 * Main conversion function that handles the full conversion flow
 * Returns both 12h and 24h formats for flexibility
 * Supports single times and time ranges
 */
export function convertTimeString(
  inputTime: string,
  sourceTimezone: string,
  targetTimezone: string
): ConversionResult {
  try {
    // Check if it's a time range
    const rangeInfo = parseTimeRange(inputTime);

    if (rangeInfo.isRange) {
      // Parse both times
      const startInput = rangeInfo.timezone
        ? `${rangeInfo.start} ${Object.keys(TIMEZONE_ABBREVIATIONS).find(k => TIMEZONE_ABBREVIATIONS[k] === rangeInfo.timezone) || ''}`
        : rangeInfo.start;
      const endInput = rangeInfo.timezone
        ? `${rangeInfo.end} ${Object.keys(TIMEZONE_ABBREVIATIONS).find(k => TIMEZONE_ABBREVIATIONS[k] === rangeInfo.timezone) || ''}`
        : rangeInfo.end;

      const { dateTime: startDateTime, detectedTimezone: startTz } = parseTimeInput(startInput, sourceTimezone);
      const { dateTime: endDateTime } = parseTimeInput(endInput, sourceTimezone);

      if (!startDateTime || !endDateTime) {
        return {
          success: false,
          error: 'Could not parse time range. Try "9:00 AM to 11:30 AM Pacific"',
        };
      }

      const actualSource = rangeInfo.timezone || startTz || sourceTimezone;
      const startConverted = startDateTime.setZone(actualSource).setZone(targetTimezone);
      const endConverted = endDateTime.setZone(actualSource).setZone(targetTimezone);

      if (!startConverted.isValid || !endConverted.isValid) {
        return {
          success: false,
          error: 'Invalid timezone conversion',
        };
      }

      const tzAbbrev = startConverted.toFormat('ZZZZ');

      return {
        success: true,
        isRange: true,
        startTime12: startConverted.toFormat('h:mm a'),
        startTime24: startConverted.toFormat('HH:mm'),
        endTime12: endConverted.toFormat('h:mm a'),
        endTime24: endConverted.toFormat('HH:mm'),
        rangeOutput12: `${startConverted.toFormat('h:mm a')} to ${endConverted.toFormat('h:mm a')} ${tzAbbrev}`,
        rangeOutput24: `${startConverted.toFormat('HH:mm')} to ${endConverted.toFormat('HH:mm')} ${tzAbbrev}`,
      };
    }

    // Single time parsing
    const { dateTime, detectedTimezone } = parseTimeInput(inputTime, sourceTimezone);

    if (!dateTime) {
      return {
        success: false,
        error: 'Could not parse time input. Try formats like "3:00 PM", "15:00", or "3pm"',
      };
    }

    // Use detected timezone if found, otherwise use provided source
    const actualSource = detectedTimezone || sourceTimezone;
    const sourceTime = dateTime.setZone(actualSource);
    const converted = sourceTime.setZone(targetTimezone);

    if (!converted.isValid) {
      return {
        success: false,
        error: 'Invalid timezone conversion',
      };
    }

    return {
      success: true,
      isRange: false,
      convertedTime12: converted.toFormat('h:mm a'),
      convertedTime24: converted.toFormat('HH:mm'),
      formattedOutput12: converted.toFormat('h:mm a ZZZZ'),
      formattedOutput24: converted.toFormat('HH:mm ZZZZ'),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Gets a friendly timezone name for display
 */
export function getTimezoneDisplayName(timezone: string): string {
  try {
    const now = DateTime.now().setZone(timezone);
    return now.toFormat('ZZZZ');
  } catch {
    return timezone;
  }
}
