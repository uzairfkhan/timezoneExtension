# Timezone Conversion Browser Extension

## 1. Problem Summary

People working across timezones constantly encounter times written in *someone else’s local context* (e.g., “3 PM EST”, “14:00 UTC”, or even just “3 PM”). This forces them to:
- Leave their current app or tab
- Manually search or calculate time differences
- Re-translate times again when proposing alternatives

This friction is small but **repeated dozens of times per week**, especially for:
- Remote teams
- Freelancers & consultants
- Recruiters & candidates
- Distributed engineering/product teams

Existing solutions (Google search, world clocks, calendars) are **context-switch heavy** and not embedded in the user’s workflow.

---

## 2. Product Overview

A lightweight **browser extension** that helps users **understand, convert, and manipulate times directly on any webpage**.

### Core Value Proposition
- Convert detected times into the user’s local timezone
- Reduce context switching
- Allow users to quickly propose alternative meeting times
- Stay assistive, not intrusive

The extension lives in the browser toolbar (popup) and optionally augments pages with subtle inline indicators.

---

## 3. Key Features (High-Level)

- Detect common time + timezone patterns on webpages
- Convert detected times to the user’s local timezone
- Popup-based UI for manual conversion and adjustments
- Ability to suggest alternative times ("What if we meet at…")
- Copy-friendly, human-readable output

**Design principle:** never silently assume intent; always allow user confirmation.

---

## 4. Phases of Development

### Phase 1 – MVP (Practical & Safe)

Focus: **Utility without guessing**

Features:
- Manual input or text selection-based time conversion
- Extension popup for:
  - Original time + timezone
  - Converted local time
  - Editable time controls (slider / input)
- Copy-paste friendly suggestions

Outcome:
- Reliable
- Low risk of incorrect assumptions
- Immediately useful

---

### Phase 2 – Assisted Detection (Opt-In)

Focus: **Smart hints, not automation**

Features:
- Detect common formats:
  - `10 AM PST`
  - `14:00 UTC`
  - `3pm CET`
- Highlight detected times subtly
- Show a tooltip or icon prompting conversion
- User confirmation before any action

Outcome:
- Faster workflow
- Maintains user trust

---

### Phase 3 – Power User & Integrations

Focus: **Workflow acceleration**

Features:
- Remember frequently used timezones
- Quick “suggest 3 options” button
- App-specific enhancements (Slack, Gmail, Notion, Jira)
- Keyboard shortcuts

Outcome:
- Stickiness
- Daily-use productivity tool

---

## 5. Technical Stack (Recommended)

### Core Technologies
- **TypeScript** – safety and maintainability
- **WebExtensions API (Manifest V3)** – cross-browser compatibility

### UI Layer
- **React** or **Preact** (popup & options pages)
- **Tailwind CSS** or CSS Modules for styling

### Time & Timezone Handling
- **Luxon** (preferred) or `date-fns + date-fns-tz`
- Built-in `Intl` APIs for local timezone detection

### Tooling
- **Vite** – fast builds and clean configuration

---

## 6. High-Level Architecture

```
/src
  /background   → timezone logic, storage, heavy computation
  /content      → time detection, inline UI hooks
  /popup        → user interaction & manipulation
  /options      → preferences and settings
  /shared       → parsing logic, utilities, types
```

Messaging between layers is handled via typed message contracts using the WebExtensions messaging API.

---

## 7. Design & Product Principles

- Assist, don’t guess
- Never auto-convert without user awareness
- Prioritize clarity over cleverness
- Optimize for trust and correctness

---

## 8. Intended Audience

- Remote professionals
- Freelancers & consultants
- Recruiters & candidates
- Anyone regularly coordinating across timezones

---

## 9. Scope Reality Check

This product is:
- ✔ Highly feasible
- ✔ Technically straightforward
- ✔ UX-driven

It is not:
- A fully autonomous NLP inference system
- A replacement for calendars

Success depends more on **UX discipline** than advanced ML.

