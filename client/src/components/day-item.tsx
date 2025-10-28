import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Save, X } from "lucide-react";
import type { DayInfo } from "@/lib/itinerary-utils";

interface DayItemProps {
  dayInfo: DayInfo;
  event: string | undefined;
  onSaveEvent: (dateKey: string, eventText: string) => void;
  onDeleteEvent: (dateKey: string) => void;
}

export function DayItem({ dayInfo, event, onSaveEvent, onDeleteEvent }: DayItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [eventText, setEventText] = useState(event || "");

  const handleSave = () => {
    const trimmedText = eventText.trim();
    if (trimmedText) {
      onSaveEvent(dayInfo.dateKey, trimmedText);
      setIsEditing(false);
    } else {
      handleDelete();
    }
  };

  const handleDelete = () => {
    onDeleteEvent(dayInfo.dateKey);
    setEventText("");
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEventText(event || "");
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <Card
      className={`grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_auto] gap-4 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
        dayInfo.isWeekend ? "border-l-4 border-l-primary/40 bg-primary/5" : ""
      }`}
      data-testid={`card-day-${dayInfo.dayNumber}`}
    >
      <div
        className="bg-primary text-primary-foreground font-bold w-10 h-10 flex items-center justify-center rounded-full text-lg flex-shrink-0"
        data-testid={`text-day-number-${dayInfo.dayNumber}`}
      >
        {dayInfo.dayNumber}
      </div>

      <div className="flex flex-col justify-center min-w-0">
        <div
          className="text-lg font-semibold text-foreground truncate"
          data-testid={`text-day-date-${dayInfo.dayNumber}`}
        >
          {dayInfo.formattedDate}
        </div>
        <div
          className="text-sm text-muted-foreground capitalize"
          data-testid={`text-day-weekday-${dayInfo.dayNumber}`}
        >
          {dayInfo.weekday}
        </div>
        {event && !isEditing && (
          <Badge
            variant="secondary"
            className="mt-2 text-xs w-fit max-w-full"
            data-testid={`badge-event-${dayInfo.dayNumber}`}
          >
            {event}
          </Badge>
        )}
      </div>

      {!isEditing ? (
        <div className="flex items-center">
          <Button
            variant={event ? "default" : "outline"}
            size="sm"
            onClick={event ? handleEdit : () => setIsEditing(true)}
            className="rounded-full whitespace-nowrap hover-elevate active-elevate-2"
            data-testid={`button-${event ? "edit" : "add"}-event-${dayInfo.dayNumber}`}
          >
            {event ? (
              <>
                <Edit className="h-3 w-3 mr-1" />
                Editar
              </>
            ) : (
              <>
                <Plus className="h-3 w-3 mr-1" />
                Agregar
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2 col-span-3 md:col-span-1 md:flex-row md:items-center">
          <Input
            value={eventText}
            onChange={(e) => setEventText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe el evento..."
            autoFocus
            className="flex-1"
            data-testid={`input-event-${dayInfo.dayNumber}`}
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleSave}
              variant="default"
              className="hover-elevate active-elevate-2"
              data-testid={`button-save-event-${dayInfo.dayNumber}`}
            >
              <Save className="h-3 w-3" />
            </Button>
            {event && (
              <Button
                size="sm"
                onClick={handleDelete}
                variant="destructive"
                className="hover-elevate active-elevate-2"
                data-testid={`button-delete-event-${dayInfo.dayNumber}`}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleCancel}
              variant="outline"
              className="hover-elevate active-elevate-2"
              data-testid={`button-cancel-event-${dayInfo.dayNumber}`}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
