# NepaliDatePicker Component Documentation

## Overview

The **NepaliDatePicker** is a React component designed to provide an interactive date picker supports both **Nepali** and **English** calendar systems. It allows users to select dates in Nepali (Bikram Sambat) or Gregorian (English) formats and provides a callback to handle date changes.

Key Features:

- Dual-language support: **Nepali** and **English**.
- Displays dates in both Nepali and Gregorian formats.
- Fully responsive and user-friendly UI.
- Calendar navigation for months and years.
- Easily integrates into your React project.

---

## Installation

Install the required dependencies and libraries for the component:

```bash
npm install nepali-date-converter
npm install @radix-ui/react-popover lucide-react
```

Ensure you have a compatible CSS framework or import styles for proper display of UI elements.

---

## Usage

### Basic Example

```tsx
import { NepaliDatePicker } from "./components/NepaliDatePicker";

function App() {
  const handleDateChange = (date: { english: string; nepali: string }) => {
    console.log("Selected Date (English):", date.english);
    console.log("Selected Date (Nepali):", date.nepali);
  };

  return (
    <div>
      <h1>Select a Date</h1>
      <NepaliDatePicker
        onDateChange={handleDateChange}
        defaultValue="2025-01-01"
        language="np" // or "en"
      />
    </div>
  );
}

export default App;
```

---

## Props Reference

### `NepaliDatePicker`

| Prop           | Type                                                  | Required | Default     | Description                                                                    |
| -------------- | ----------------------------------------------------- | -------- | ----------- | ------------------------------------------------------------------------------ |
| `onDateChange` | `(date: { english: string; nepali: string }) => void` | No       | `undefined` | The callback is triggered when the user selects a date. Returns both formats.  |
| `defaultValue` | `string`                                              | No       | `null`      | Initial date value in ISO format (e.g., `YYYY-MM-DD`).                         |
| `language`     | \`"np"                                                | "en"\`   | Yes         | Sets the calendar's display language. Use "np" for Nepali or "en" for English. |

---

## Features

### Dual-Language Support

- Display month names, day names, and numerals in **Nepali** or **English**.
- Toggle between Nepali (Bikram Sambat) and Gregorian calendars seamlessly.

### Navigation

- Navigate by month and year using **arrow buttons**.
- Leap year and month boundary checks ensure accurate date handling.

### Date Format Conversion

- Automatically converts between Nepali and Gregorian dates.
- Provide formatted date strings in **MM/DD/YYYY** (English) and **Nepali numeral** formats.

---

## Development Notes

### Dependencies

- **`nepali-date-converter`**: Used to handle date conversions between Nepali and Gregorian calendars.
- **`@radix-ui/react-popover`**: Manages the popover dropdown for the calendar UI.
- **`lucide-react`**: Provides the calendar icon.

### Style and Responsiveness

- The component uses a responsive and accessible design.
- Styling is implemented with utility classes (e.g., Tailwind CSS). Ensure the proper setup of Tailwind or adapt the styles for your project.

### Localization

- Customize day and month names through the `MONTH_NAMES` and `DAY_NAMES` constants.
- Use `toNepaliNumeral` Convert numbers to Nepali numerals when necessary.

---

## Known Limitations

- The component currently does not support custom themes or styling. Users may override the default styles via Tailwind classes or custom CSS.
- Events like key navigation for accessibility are not implemented but can be added in future versions.

---

## Changelog

**v1.0.0**

- Initial release.
- Added Nepali and English calendar support.
- Implemented basic date selection and formatting functionality.
- Included responsive popover for date picker UI.

---

## Contribution

We welcome contributions! If you'd like to improve the component, please follow these steps:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/new-feature`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Open a pull request.

---

## License

This component is licensed under the **MIT License**. See the LICENSE file for details.
