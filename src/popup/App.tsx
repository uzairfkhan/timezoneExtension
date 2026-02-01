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
    // Load saved preference or default to 12h
    try {
      return (localStorage.getItem('timeFormat') as TimeFormat) || '12h';
    } catch {
      return '12h';
    }
  });

  // Save time format preference
  const handleFormatChange = (format: TimeFormat) => {
    setTimeFormat(format);
    try {
      localStorage.setItem('timeFormat', format);
    } catch {
      // Ignore storage errors
    }
  };

  // Check for pre-filled time from context menu
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const selectedText = params.get('text');
    if (selectedText) {
      setInputTime(selectedText);
    }
  }, []);

  // Convert whenever inputs change
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
    <div className="p-4 bg-gray-50 min-h-[400px]">
      <h1 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        Timezone Converter
      </h1>

      <div className="space-y-4">
        <TimeInput
          value={inputTime}
          onChange={setInputTime}
          placeholder="Enter time (e.g., 3:00 PM)"
        />

        <TimezoneSelect
          label="From"
          value={sourceTimezone}
          onChange={setSourceTimezone}
        />

        <div className="flex justify-center">
          <button
            onClick={handleSwap}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors"
            title="Swap timezones"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
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

        <ConvertedTime
          result={result}
          timeFormat={timeFormat}
          onFormatChange={handleFormatChange}
        />
      </div>

      <p className="text-xs text-gray-400 text-center mt-4">
        Tip: Include timezone in input (e.g., "3:00 PM EST")
      </p>
    </div>
  );
}
