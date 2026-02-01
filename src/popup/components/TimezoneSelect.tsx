import { useState, useMemo } from 'preact/hooks';
import { COMMON_TIMEZONES } from '../../shared/constants';

interface TimezoneSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function TimezoneSelect({ label, value, onChange }: TimezoneSelectProps) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredTimezones = useMemo(() => {
    if (!search.trim()) return COMMON_TIMEZONES;
    const searchLower = search.toLowerCase();
    return COMMON_TIMEZONES.filter(
      (tz) =>
        tz.label.toLowerCase().includes(searchLower) ||
        tz.value.toLowerCase().includes(searchLower)
    );
  }, [search]);

  const selectedTimezone = COMMON_TIMEZONES.find((tz) => tz.value === value);
  const displayValue = selectedTimezone?.label || value;

  const handleSelect = (timezone: string) => {
    onChange(timezone);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <span className="block truncate text-gray-900">{displayValue}</span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pt-6">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              value={search}
              onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
              placeholder="Search timezones..."
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
          </div>
          <ul className="overflow-y-auto max-h-48">
            {filteredTimezones.map((tz) => (
              <li key={tz.value}>
                <button
                  type="button"
                  onClick={() => handleSelect(tz.value)}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-blue-50 ${
                    tz.value === value ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                  }`}
                >
                  <span className="block font-medium">{tz.label}</span>
                  <span className="block text-xs text-gray-500">{tz.offset}</span>
                </button>
              </li>
            ))}
            {filteredTimezones.length === 0 && (
              <li className="px-3 py-2 text-sm text-gray-500">No timezones found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
