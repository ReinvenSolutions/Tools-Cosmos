import { useEffect, useRef } from "react";
import Flatpickr from "react-flatpickr";
import { Spanish } from "flatpickr/dist/l10n/es";
import "flatpickr/dist/flatpickr.css";
import { Card } from "@/components/ui/card";

interface CalendarPickerProps {
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
}

export function CalendarPicker({ selectedDate, onDateChange }: CalendarPickerProps) {
  const flatpickrRef = useRef<any>(null);

  useEffect(() => {
    if (flatpickrRef.current?.flatpickr) {
      const fp = flatpickrRef.current.flatpickr;
      
      const calendarElement = fp.calendarContainer;
      if (calendarElement) {
        calendarElement.style.background = "transparent";
        calendarElement.style.border = "none";
        calendarElement.style.boxShadow = "none";
      }
    }
  }, []);

  return (
    <Card className="p-2 overflow-visible">
      <Flatpickr
        ref={flatpickrRef}
        value={selectedDate || undefined}
        onChange={(dates) => {
          if (dates[0]) {
            onDateChange(dates[0]);
          }
        }}
        options={{
          inline: true,
          locale: Spanish,
          dateFormat: "Y-m-d",
          defaultDate: selectedDate || new Date(),
        }}
        className="hidden"
        data-testid="calendar-picker"
      />
    </Card>
  );
}
