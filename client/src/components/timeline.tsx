import { DayItem } from "./day-item";
import type { DayInfo } from "@/lib/itinerary-utils";
import type { DayDetails, EventCategory } from "@shared/schema";

interface TimelineProps {
  days: DayInfo[];
  dayDetails: Record<string, DayDetails>;
  onSaveEvent: (dateKey: string, eventText: string, category?: EventCategory) => void;
  onDeleteEvent: (dateKey: string) => void;
}

export function Timeline({ days, dayDetails, onSaveEvent, onDeleteEvent }: TimelineProps) {
  return (
    <div className="bg-card/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
      <div className="sticky top-0 bg-card/95 backdrop-blur-sm z-10 border-b border-border">
        <h3 className="text-xl font-semibold text-foreground p-6">
          Itinerario Detallado
        </h3>
      </div>
      <div
        className="max-h-[80vh] md:max-h-[80vh] overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-primary/40 scrollbar-track-transparent"
        data-testid="container-timeline"
      >
        {days.map((dayInfo) => (
          <DayItem
            key={dayInfo.dateKey}
            dayInfo={dayInfo}
            dayDetails={dayDetails[dayInfo.dateKey]}
            onSaveEvent={onSaveEvent}
            onDeleteEvent={onDeleteEvent}
          />
        ))}
      </div>
    </div>
  );
}
