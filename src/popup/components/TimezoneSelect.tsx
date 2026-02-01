import { useState, useMemo, useRef, useEffect } from 'preact/hooks';
import { COMMON_TIMEZONES } from '../../shared/constants';

interface TimezoneSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function TimezoneSelect({ label, value, onChange }: TimezoneSelectProps) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="select-elegant relative pr-10"
      >
        <span className="block truncate">{displayValue}</span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-3">
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="dropdown-elegant">
          <div className="p-2 border-b border-gray-100">
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
              placeholder="Search timezones..."
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 focus:bg-white transition-all"
            />
          </div>
          <ul className="overflow-y-auto max-h-48 py-1">
            {filteredTimezones.map((tz) => (
              <li key={tz.value}>
                <button
                  type="button"
                  onClick={() => handleSelect(tz.value)}
                  className={`w-full px-4 py-2.5 text-left transition-colors ${
                    tz.value === value
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="block text-sm font-medium">{tz.label}</span>
                  <span className="block text-xs text-gray-400 mt-0.5">{tz.offset}</span>
                </button>
              </li>
            ))}
            {filteredTimezones.length === 0 && (
              <li className="px-4 py-3 text-sm text-gray-400 text-center">No timezones found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
