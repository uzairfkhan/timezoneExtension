import { useState, useEffect } from 'preact/hooks';
import { TimeInput } from './components/TimeInput';
import { TimezoneSelect } from './components/TimezoneSelect';
import { ConvertedTime } from './components/ConvertedTime';
import { convertTimeString, detectLocalTimezone } from '../shared/timezone';
import { ConversionResult, TimeFormat } from '../shared/types';

export function App() {
  const [inputTime, setInputTime] = useState('');
  const [sourceTimezone, setSourceTimezone] = useState('America/New_York');
  const [targetTimezone, setTargetTimezone] = useState(detectLocalTimezone());
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [timeFormat, setTimeFormat] = useState<TimeFormat>(() => {
    try {
      return (localStorage.getItem('timeFormat') as TimeFormat) || '12h';
    } catch {
      return '12h';
    }
  });

  const handleFormatChange = (format: TimeFormat) => {
    setTimeFormat(format);
    try {
      localStorage.setItem('timeFormat', format);
    } catch {
      // Ignore storage errors
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const selectedText = params.get('text');
    if (selectedText) {
      setInputTime(selectedText);
    }
  }, []);

  useEffect(() => {
    if (inputTime.trim()) {
      const conversionResult = convertTimeString(inputTime, sourceTimezone, targetTimezone);
      setResult(conversionResult);
    } else {
      setResult(null);
    }
  }, [inputTime, sourceTimezone, targetTimezone]);

  const handleSwap = () => {
    const temp = sourceTimezone;
    setSourceTimezone(targetTimezone);
    setTargetTimezone(temp);
  };

  return (
    <div className="bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center shadow-sm">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" strokeWidth="2" />
              <path strokeLinecap="round" strokeWidth="2" d="M12 7v5l3 3" />
            </svg>
          </div>
          <h1 className="text-base font-semibold text-gray-800 tracking-tight">
            Timezone Converter
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 pb-4 space-y-3">
        <TimeInput
          value={inputTime}
          onChange={setInputTime}
          placeholder="e.g., 3:00 PM or 8:00A Pacific"
        />

        <div className="space-y-2">
          <TimezoneSelect
            label="From"
            value={sourceTimezone}
            onChange={setSourceTimezone}
          />

          <div className="flex justify-center">
            <button
              onClick={handleSwap}
              className="btn-icon"
              title="Swap timezones"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </button>
          </div>

          <TimezoneSelect
            label="To"
            value={targetTimezone}
            onChange={setTargetTimezone}
          />
        </div>

        <ConvertedTime
          result={result}
          timeFormat={timeFormat}
          onFormatChange={handleFormatChange}
        />

        <p className="text-xs text-gray-400 text-center pt-1">
          Tip: Include timezone — "3:00 PM EST"
        </p>
      </div>
    </div>
  );
}
