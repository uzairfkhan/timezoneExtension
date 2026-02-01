# Timezone Converter

A lightweight Chrome extension for quickly converting times between timezones.

## Features

- **Popup Converter**: Click the extension icon to open a clean interface for time conversion
- **Context Menu**: Select any time text on a webpage, right-click, and choose "Convert to my timezone"
- **Smart Parsing**: Recognizes various time formats:
  - Standard: `3:00 PM`, `3:00PM`, `3pm`, `15:00`
  - Short form: `8:00A`, `9:30A`, `4:00P`
  - With timezone: `3:00 PM EST`, `8:00A Pacific`, `10am Tokyo`
- **25+ Timezones**: Major cities worldwide with UTC offsets
- **One-Click Copy**: Copy converted time to clipboard instantly
- **Timezone Detection**: Automatically detects timezones from input text (PST, EST, Pacific, Eastern, etc.)

## Installation

### From Chrome Web Store
*(Coming soon)*

### Manual Installation (Developer Mode)

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the extension:
   ```bash
   npm run build
   ```
4. Open Chrome and navigate to `chrome://extensions`
5. Enable "Developer mode" (toggle in top right)
6. Click "Load unpacked"
7. Select the `dist` folder

## Usage

### Popup Converter
1. Click the extension icon in your browser toolbar
2. Enter a time (e.g., "3:00 PM" or "8:00A Pacific")
3. Select source and target timezones
4. View the converted time and click the copy button if needed

### Context Menu
1. Select any time text on a webpage (e.g., "Meeting at 2:30 PM EST")
2. Right-click the selection
3. Choose "Convert to my timezone"
4. A popup opens with the time pre-filled for conversion

## Supported Time Formats

| Format | Example |
|--------|---------|
| 12-hour | `3:00 PM`, `3:00PM`, `3pm` |
| 24-hour | `15:00`, `15:00:00` |
| Short AM/PM | `8:00A`, `9:30A`, `4:00P` |
| With timezone | `3:00 PM EST`, `8:00A Pacific` |

## Supported Timezone Names

- **Abbreviations**: EST, EDT, CST, CDT, MST, MDT, PST, PDT, GMT, UTC, BST, JST, etc.
- **Short forms**: PT, ET, CT, MT
- **Full names**: Pacific, Eastern, Central, Mountain, Alaska, Hawaii
- **City names**: London, Paris, Tokyo, Sydney, Singapore, Hong Kong, Dubai, etc.

## Privacy

This extension:
- Does **NOT** collect any user data
- Does **NOT** send data to external servers
- Does **NOT** use analytics or tracking
- Operates **100% locally** on your device

See [PRIVACY_POLICY.md](PRIVACY_POLICY.md) for details.

## Development

### Prerequisites
- Node.js 18+
- npm

### Scripts
```bash
npm install        # Install dependencies
npm run build      # Build for production
npm run dev        # Start development server
npm run build:icons # Generate placeholder icons
```

### Project Structure
```
src/
├── background/
│   └── service-worker.ts    # Context menu handling
├── popup/
│   ├── index.html           # Popup entry
│   ├── index.tsx            # App entry
│   ├── App.tsx              # Main component
│   ├── styles.css           # Tailwind styles
│   └── components/
│       ├── TimeInput.tsx    # Time input field
│       ├── TimezoneSelect.tsx # Timezone dropdown
│       └── ConvertedTime.tsx  # Result display
└── shared/
    ├── types.ts             # TypeScript types
    ├── constants.ts         # Timezone data
    └── timezone.ts          # Conversion logic
```

## Tech Stack

- **UI**: Preact + TypeScript
- **Styling**: Tailwind CSS
- **Timezone**: Luxon
- **Build**: Vite
- **Extension**: Manifest V3

## Custom Icons

**Option 1**: Place a single source image in the project root (recommended):
- `icon.png` - Will be automatically resized to all required sizes
- Also supports: `icon.svg`, `icon.jpg`, `icon.webp`

**Option 2**: Place pre-sized PNG files in `public/icons/`:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)
- `icon128.png` (128x128 pixels)

**Note**: ICO files are not supported. Convert to PNG using an online tool like [convertio.co](https://convertio.co/ico-png/).

If no icons are provided, placeholder icons will be generated during build.

## License

MIT License - feel free to use, modify, and distribute.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
