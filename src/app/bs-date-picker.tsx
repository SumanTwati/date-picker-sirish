/**
 * NepaliDatePicker Component
 * --------------------------
 * A date picker component supporting both Nepali and Gregorian calendar systems.
 * It allows users to select a date in either Nepali or English formats, toggling
 * between the two based on the provided `language` prop. The selected date is
 * formatted accordingly and can be passed to a parent component via the `onDateChange` callback.
 *
 * Props:
 * ------
 * - `onDateChange` (optional): Callback triggered when a date is selected,
 *    providing the selected date in both English and Nepali formats.
 * - `defaultValue` (optional): Initial date value as a string. If `language` is
 *    "np", it expects the Nepali date string; otherwise, a Gregorian date string.
 * - `language`: Determines the calendar language, either "np" for Nepali or "en" for English.
 *
 * State:
 * ------
 * - `selectedDate`: The currently selected date object (either NepaliDate or JavaScript Date).
 * - `currentMonth`: Stores the current month as both NepaliDate and JavaScript Date objects.
 * - `isOpen`: Tracks the open/close state of the date picker popover.
 *
 * Utility Functions:
 * ------------------
 * - `formatDate`: Formats a date object to a string in the specified language.
 * - `handleDateSelect`: Handles day selection, updating the selected date and invoking `onDateChange`.
 * - `handleMonthChange`: Adjusts the current month by the given increment.
 * - `toNepaliNumeral`: Converts numeric values into Nepali numerals.
 * - `getGregorianMonthRange`, `getGregorianYearRange`: Derives Gregorian month/year ranges
 *    corresponding to a Nepali month.
 * - `getNepaliMonthRange`, `getNepaliYearRange`: Derives Nepali month/year ranges
 *    corresponding to a Gregorian month.
 *
 * Calendar Display:
 * -----------------
 * - The popover displays a header with navigation controls to change months and years.
 * - The days grid includes day names and date numbers for the selected language.
 * - Days are rendered dynamically, accounting for month lengths and starting offsets.
 * - Selected day is highlighted, with cross-calendar day mapping shown as a small label.
 *
 * Usage:
 * ------
 * Import and use this component to enable date selection in applications requiring
 * dual-language date pickers. Customize styles and integrate callbacks for additional functionality.
 */
"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { CalendarIcon } from "lucide-react";
import NepaliDate from "nepali-date-converter";
import { useState } from "react";
import { Input } from "../components/ui/input";
import "./globals.css";

export type DateFormat =
  | "YYYY/MM/DD"
  | "DD/MM/YYYY"
  | "MM/DD/YYYY"
  | "YYYY-MM-DD"
  | "MM-DD-YYYY"
  | "DD-MM-YYYY"
  | "MMM DD, YYYY"
  | "DD MMM YYYY"
  | "MMMM DD, YYYY"
  | "DDth MMMM, YYYY";

interface Props {
  onDateChange?: (date: { english: string; nepali: string }) => void;
  defaultValue?: string;
  language: "np" | "en";
  format:
    | "YYYY/MM/DD"
    | "DD/MM/YYYY"
    | "MM/DD/YYYY"
    | "YYYY-MM-DD"
    | "MM-DD-YYYY"
    | "DD-MM-YYYY"
    | "MMM DD, YYYY"
    | "DD MMM YYYY"
    | "MMMM DD, YYYY"
    | "DDth MMMM, YYYY";
}

export function BSDatePicker({
  onDateChange,
  defaultValue,
  language,
  format,
}: Props) {
  const [selectedDate, setSelectedDate] = useState<NepaliDate | Date | null>(
    defaultValue
      ? language === "np"
        ? new NepaliDate(defaultValue)
        : new Date(defaultValue)
      : null
  );
  // Store both NepaliDate and Gregorian Date in currentMonth
  const [currentMonth, setCurrentMonth] = useState<{
    nepali: NepaliDate;
    gregorian: Date;
  }>(() => {
    if (defaultValue) {
      const nepaliDate = new NepaliDate(defaultValue);
      const gregorianDate = new Date(defaultValue);

      return {
        nepali: language === "np" ? nepaliDate : new NepaliDate(gregorianDate),
        gregorian: language === "en" ? gregorianDate : nepaliDate.toJsDate(),
      };
    } else {
      const nowNepali = NepaliDate.now();
      const nowGregorian = new Date();

      return {
        nepali: language === "np" ? nowNepali : new NepaliDate(nowGregorian),
        gregorian: language === "en" ? nowGregorian : nowNepali.toJsDate(),
      };
    }
  });

  const [isOpen, setIsOpen] = useState(false);

  const MONTH_NAMES = {
    en: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    np: [
      "बैशाख",
      "जेठ",
      "असार",
      "सावन",
      "भदौ",
      "असोज",
      "कार्तिक",
      "मंसिर",
      "पौष",
      "माघ",
      "फागुन",
      "चैत",
    ],
  };

  const DAY_NAMES = {
    en: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
    np: ["आईत", "सोम", "मंगल", "बुध", "बिही", "शुक्र", "शनि"],
  };

  const NEPALI_NUMERALS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

  const formatDate = (
    date: NepaliDate | Date | null,
    lang: "en" | "np",
    format: DateFormat
  ): string => {
    if (!date) return "";

    if (lang === "en") {
      const jsDate = date instanceof Date ? date : date.toJsDate();
      return formatGregorianDate(jsDate, format);
    } else {
      const nepaliYear =
        date instanceof NepaliDate
          ? date.getYear()
          : new NepaliDate(date).getYear();
      const nepaliMonth = date.getMonth();
      const nepaliDay = date.getDate();

      const formattedNepaliDate = formatNepaliDate(
        nepaliYear,
        nepaliMonth,
        nepaliDay,
        format
      );
      return formattedNepaliDate;
    }
  };

  const formatGregorianDate = (date: Date, format: DateFormat): string => {
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();

    const formats: Record<DateFormat, string> = {
      "MM/DD/YYYY": `${month}/${day}/${year}`,
      "DD/MM/YYYY": `${day}/${month}/${year}`,
      "YYYY/MM/DD": `${year}/${month}/${day}`,
      "YYYY-MM-DD": `${year}-${month}-${day}`,
      "MM-DD-YYYY": `${month}-${day}-${year}`,
      "DD-MM-YYYY": `${day}-${month}-${year}`,
      "MMM DD, YYYY": date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      "DD MMM YYYY": date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      "MMMM DD, YYYY": date.toLocaleDateString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      }),
      "DDth MMMM, YYYY": `${date.getDate()}${getOrdinalSuffix(
        date.getDate()
      )} ${date.toLocaleDateString("en-US", {
        month: "long",
      })}, ${year}`,
    };

    return formats[format] || formats["YYYY-MM-DD"];
  };

  const formatNepaliDate = (
    year: number,
    month: number,
    day: number,
    format: DateFormat
  ): string => {
    const nepaliYear = toNepaliNumeral(year).padStart(2, "०");
    const nepaliMonth = toNepaliNumeral(month).padStart(2, "०");
    const nepaliDay = toNepaliNumeral(day).padStart(2, "०");

    const monthName = MONTH_NAMES["np"][month];
    const ordinalDay = `${nepaliDay}${getOrdinalSuffix(day)}`;

    const options: Record<DateFormat, string> = {
      "YYYY/MM/DD": `${nepaliYear}/${nepaliMonth}/${nepaliDay}`,
      "DD/MM/YYYY": `${nepaliDay}/${nepaliMonth}/${nepaliYear}`,
      "MM/DD/YYYY": `${nepaliMonth}/${nepaliDay}/${nepaliYear}`,
      "YYYY-MM-DD": `${nepaliYear}-${nepaliMonth}-${nepaliDay}`,
      "MM-DD-YYYY": `${nepaliMonth}-${nepaliDay}-${nepaliYear}`,
      "DD-MM-YYYY": `${nepaliDay}-${nepaliMonth}-${nepaliYear}`,
      "MMM DD, YYYY": `${monthName} ${nepaliDay}, ${nepaliYear}`,
      "DD MMM YYYY": `${nepaliDay} ${monthName} ${nepaliYear}`,
      "MMMM DD, YYYY": `${monthName} ${nepaliDay}, ${nepaliYear}`,
      "DDth MMMM, YYYY": `${ordinalDay} ${monthName}, ${nepaliYear}`,
    };

    return options[format] || options["YYYY-MM-DD"];
  };

  const getOrdinalSuffix = (day: number): string => {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = day % 100;
    return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
  };

  const handleDateSelect = (day: number) => {
    const newNepaliDate = new NepaliDate(
      currentMonth.nepali.getYear(),
      currentMonth.nepali.getMonth(),
      day
    );
    const newGregorianDate = new Date(
      currentMonth.gregorian.getFullYear(),
      currentMonth.gregorian.getMonth(),
      day
    );

    setSelectedDate(language === "np" ? newNepaliDate : newGregorianDate);

    if (onDateChange) {
      onDateChange({
        english: formatDate(newGregorianDate, "en", format),
        nepali: formatDate(newNepaliDate, "np", format),
      });
    }

    // Close the popover after selecting a date
    setIsOpen(false);
  };

  const handleMonthChange = (increment: number) => {
    setCurrentMonth((prevMonth) => {
      // Calculate new NepaliDate month and year
      let newNepaliYear = prevMonth.nepali.getYear();
      let newNepaliMonth = prevMonth.nepali.getMonth() + increment;

      if (newNepaliMonth > 11) {
        newNepaliYear += Math.floor(newNepaliMonth / 12);
        newNepaliMonth %= 12;
      } else if (newNepaliMonth < 0) {
        newNepaliYear += Math.floor(newNepaliMonth / 12); // Handles negative overflow
        newNepaliMonth = ((newNepaliMonth % 12) + 12) % 12; // Keeps month positive
      }

      // Determine the current selected day
      const currentDay =
        language === "np"
          ? selectedDate?.getDate() ?? 1 // Nepali date
          : selectedDate
          ? selectedDate.getDate()
          : 1; // Gregorian date

      // Calculate the max day in the new month
      //const newNepaliDate = new NepaliDate(newNepaliYear, newNepaliMonth, 1);
      const maxNepaliDay = new NepaliDate(
        newNepaliYear,
        newNepaliMonth + 1,
        0
      ).getDate(); // Last day of the new Nepali month

      const newGregorianDate = new Date(
        prevMonth.gregorian.getFullYear(),
        prevMonth.gregorian.getMonth() + increment,
        1
      );
      const maxGregorianDay = new Date(
        newGregorianDate.getFullYear(),
        newGregorianDate.getMonth() + 1,
        0
      ).getDate(); // Last day of the new Gregorian month

      // Adjust the day to fit within the new month's limits
      const adjustedNepaliDay = Math.min(currentDay, maxNepaliDay);
      const adjustedGregorianDay = Math.min(currentDay, maxGregorianDay);

      const updatedNepaliDate = new NepaliDate(
        newNepaliYear,
        newNepaliMonth,
        adjustedNepaliDay
      );
      const updatedGregorianDate = new Date(
        newGregorianDate.getFullYear(),
        newGregorianDate.getMonth(),
        adjustedGregorianDay
      );

      // Update the selected date
      setSelectedDate(
        language === "np" ? updatedNepaliDate : updatedGregorianDate
      );

      // Return the updated state with both NepaliDate and Gregorian Date
      return {
        nepali: updatedNepaliDate,
        gregorian: updatedGregorianDate,
      };
    });
  };

  const toNepaliNumeral = (num: number): string =>
    num
      .toString()
      .split("")
      .map((digit) => NEPALI_NUMERALS[parseInt(digit)])
      .join("");

  const getGregorianMonthRange = (nepaliMonth: NepaliDate) => {
    const firstDay = new NepaliDate(
      nepaliMonth.getYear(),
      nepaliMonth.getMonth(),
      1
    );
    const lastDay = new NepaliDate(
      nepaliMonth.getYear(),
      nepaliMonth.getMonth() + 1,
      0
    );

    const firstGregorianMonth = firstDay.toJsDate().toLocaleString("en-US", {
      month: "short",
    });
    const lastGregorianMonth = lastDay.toJsDate().toLocaleString("en-US", {
      month: "short",
    });

    return firstGregorianMonth === lastGregorianMonth
      ? firstGregorianMonth
      : `${firstGregorianMonth}/${lastGregorianMonth}`;
  };

  const getGregorianYearRange = (nepaliMonth: NepaliDate) => {
    const firstDay = new NepaliDate(
      nepaliMonth.getYear(),
      nepaliMonth.getMonth(),
      1
    );
    const lastDay = new NepaliDate(
      nepaliMonth.getYear(),
      nepaliMonth.getMonth() + 1,
      0
    );

    const firstGregorianYear = firstDay.toJsDate().getFullYear();
    const lastGregorianYear = lastDay.toJsDate().getFullYear();

    return firstGregorianYear === lastGregorianYear
      ? firstGregorianYear.toString()
      : `${firstGregorianYear}-${lastGregorianYear}`;
  };

  const getNepaliMonthRange = (date: NepaliDate) => {
    const firstDay = new NepaliDate(date.getYear(), date.getMonth(), 1).getBS();
    const lastDay = new NepaliDate(
      date.getYear(),
      date.getMonth() + 2,
      0
    ).getBS();

    const firstNepaliMonth = firstDay.month;
    const lastNepaliMonth = lastDay.month;

    return firstNepaliMonth === lastNepaliMonth
      ? MONTH_NAMES["np"][firstNepaliMonth]
      : `${MONTH_NAMES["np"][firstNepaliMonth]}/${MONTH_NAMES["np"][lastNepaliMonth]}`;
  };

  const getNepaliYearRange = (date: NepaliDate) => {
    const firstDay = new NepaliDate(date.getYear(), date.getMonth(), 1).getBS();
    const lastDay = new NepaliDate(
      date.getYear(),
      date.getMonth() + 2,
      0
    ).getBS();

    const firstNepaliYear = firstDay.year;
    const lastNepaliYear = lastDay.year;

    return firstNepaliYear === lastNepaliYear
      ? toNepaliNumeral(firstNepaliYear)
      : `${toNepaliNumeral(firstNepaliYear)}-${toNepaliNumeral(
          lastNepaliYear
        )}`;
  };

  return (
    <div className="flex gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              value={
                selectedDate ? formatDate(selectedDate, language, format) : ""
              }
              placeholder={format}
              className="w-[140px] pr-8"
              readOnly
            />
            <CalendarIcon className="absolute right-2 top-2.5 h-4 w-4 opacity-50" />
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="start"
          sideOffset={4} // Adjusts vertical/horizontal offset
          style={{
            zIndex: 9999,
          }}
        >
          <div
            style={{ backgroundColor: "var(--secondary-color)" }}
            className="mt-1 p-2 rounded-md bg-white"
          >
            {/* Month and Year Header */}
            <div
              style={{ backgroundColor: "var(--primary-color)" }}
              className="text-white p-2 rounded-md mb-2"
            >
              <div className="flex justify-between items-center">
                <div className="flex gap-1">
                  <button
                    onClick={() => handleMonthChange(-12)}
                    className="hover:bg-white/10 px-1 rounded"
                  >
                    &lt;&lt;
                  </button>
                  <button
                    onClick={() => handleMonthChange(-1)}
                    className="hover:bg-white/10 px-1 rounded"
                  >
                    &lt;
                  </button>
                </div>
                <div className="text-center flex flex-col">
                  {/* Top Header Display */}
                  {language === "np" ? (
                    <>
                      <div className="font-bold text-lg">
                        {`${
                          MONTH_NAMES[language][currentMonth.nepali.getMonth()]
                        } ${toNepaliNumeral(currentMonth.nepali.getYear())}`}
                      </div>
                      <div className="text-sm">
                        {getGregorianMonthRange(currentMonth.nepali)}{" "}
                        {getGregorianYearRange(currentMonth.nepali)}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="font-bold text-lg">
                        {`${
                          MONTH_NAMES[language][
                            currentMonth.gregorian.getMonth()
                          ]
                        } ${currentMonth.gregorian.getFullYear()}`}
                      </div>
                      <div className="text-sm">
                        {getNepaliMonthRange(currentMonth.nepali)}{" "}
                        {getNepaliYearRange(currentMonth.nepali)}
                      </div>
                    </>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleMonthChange(1)}
                    className="hover:bg-white/10 px-1 rounded"
                  >
                    &gt;
                  </button>
                  <button
                    onClick={() => handleMonthChange(12)}
                    className="hover:bg-white/10 px-1 rounded"
                  >
                    &gt;&gt;
                  </button>
                </div>
              </div>
            </div>
            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2 text-black pl-3">
              {/* Day Names */}
              {DAY_NAMES[language].map((day) => (
                <div key={day} className="text-center text-xs font-medium p-1">
                  {day}
                </div>
              ))}
              {/* Empty Cells for Starting Offset */}
              {Array.from({
                length:
                  language === "np"
                    ? new NepaliDate(
                        currentMonth.nepali.getYear(),
                        currentMonth.nepali.getMonth(),
                        1
                      ).getDay()
                    : new Date(
                        currentMonth.gregorian.getFullYear(),
                        currentMonth.gregorian.getMonth(),
                        1
                      ).getDay(),
              }).map((_, i) => (
                <div key={`empty-${i}`} className="h-8" />
              ))}
              {/* Day Numbers */}
              {Array.from({
                length:
                  language === "np"
                    ? new NepaliDate(
                        currentMonth.nepali.getYear(),
                        currentMonth.nepali.getMonth() + 1,
                        0
                      ).getDate()
                    : new Date(
                        currentMonth.gregorian.getFullYear(),
                        currentMonth.gregorian.getMonth() + 1,
                        0
                      ).getDate(),
              }).map((_, i) => {
                const day = i + 1;
                // NepaliDate or Gregorian Date for the current day
                let nepaliDate;
                let usDate;
                if (language === "np") {
                  nepaliDate = new NepaliDate(
                    currentMonth.nepali.getYear(),
                    currentMonth.nepali.getMonth(),
                    day
                  );
                  usDate = nepaliDate.toJsDate();
                } else {
                  usDate = new Date(
                    currentMonth.gregorian.getFullYear(),
                    currentMonth.gregorian.getMonth(),
                    day
                  );
                  nepaliDate = new NepaliDate(usDate);
                }

                return (
                  <button
                    key={day}
                    className={`h-8 w-8 rounded text-sm relative 
                      ${
                        selectedDate?.getDate() === day
                          ? "rounded bg-primary text-white  hover:bg-gray-100 hover:text-primary"
                          : ""
                      }`}
                    onClick={() => handleDateSelect(day)}
                  >
                    {language === "np" ? (
                      <>
                        <span
                          className={`absolute top-0 ${
                            day.toString().length === 1 ? "right-3" : "right-2"
                          } text-[10px]`}
                        >
                          {toNepaliNumeral(day)}
                        </span>
                        <span
                          className={`absolute bottom-0 ${
                            usDate.getDate().toString().length === 1
                              ? "right-1"
                              : "right-0"
                          }  text-[8px] text-gray-600`}
                        >
                          {usDate.getDate()}
                        </span>
                      </>
                    ) : (
                      <>
                        <span
                          className={`absolute top-0 ${
                            day.toString().length === 1 ? "right-3" : "right-2"
                          } text-[10px]`}
                        >
                          {day}
                        </span>
                        <span
                          className={`absolute bottom-0 ${
                            nepaliDate.getDate().toString().length === 1
                              ? "right-1"
                              : "right-0"
                          }  text-[8px] text-gray-600`}
                        >
                          {toNepaliNumeral(nepaliDate.getDate())}
                        </span>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
