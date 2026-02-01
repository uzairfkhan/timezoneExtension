import { useState } from 'preact/hooks';
import { ConversionResult, TimeFormat } from '../../shared/types';

interface ConvertedTimeProps {
  result: ConversionResult | null;
  timeFormat: TimeFormat;
  onFormatChange: (format: TimeFormat) => void;
}

export function ConvertedTime({ result, timeFormat, onFormatChange }: ConvertedTimeProps) {
  const [copied, setCopied] = useState(false);

  const convertedTime = timeFormat === '12h' ? result?.convertedTime12 : result?.convertedTime24;
  const formattedOutput = timeFormat === '12h' ? result?.formattedOutput12 : result?.formattedOutput24;

  const handleCopy = async () => {
    if (formattedOutput) {
      try {
        await navigator.clipboard.writeText(formattedOutput);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const toggleFormat = () => {
    onFormatChange(timeFormat === '12h' ? '24h' : '12h');
  };

  if (!result) {
    return (
      <div className="mt-4 p-4 bg-gray-100 rounded-lg text-center text-gray-500">
        Enter a time to convert
      </div>
    );
  }

  if (!result.success) {
    return (
      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-600">{result.error}</p>
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-2xl font-bold text-green-800">
            {convertedTime}
          </p>
          <p className="text-sm text-green-600 mt-1 truncate">{formattedOutput}</p>
        </div>
        <div className="flex items-center gap-1">
          {/* Format Toggle */}
          <button
            onClick={toggleFormat}
            className="px-2 py-1 text-xs font-medium text-green-600 hover:text-green-800 hover:bg-green-100 rounded transition-colors"
            title={`Switch to ${timeFormat === '12h' ? '24-hour' : '12-hour'} format`}
          >
            {timeFormat === '12h' ? '24h' : '12h'}
          </button>
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-colors"
            title="Copy to clipboard"
          >
            {copied ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
