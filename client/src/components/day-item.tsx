import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Save, X, StickyNote, DollarSign } from "lucide-react";
import type { DayInfo } from "@/lib/itinerary-utils";
import type { EventCategory, DayDetails } from "@shared/schema";
import { categoryMetadata } from "@shared/schema";

interface DayItemProps {
  dayInfo: DayInfo;
  dayDetails: DayDetails | undefined;
  onSaveEvent: (dateKey: string, eventText: string, category?: EventCategory) => void;
  onUpdateDetails: (dateKey: string, details: Partial<DayDetails>) => void;
  onDeleteEvent: (dateKey: string) => void;
}

export function DayItem({ dayInfo, dayDetails, onSaveEvent, onUpdateDetails, onDeleteEvent }: DayItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [eventText, setEventText] = useState(dayDetails?.event?.text || "");
  const [category, setCategory] = useState<EventCategory | undefined>(dayDetails?.event?.category);
  const [notes, setNotes] = useState(dayDetails?.notes || "");
  const [budget, setBudget] = useState(dayDetails?.budget?.toString() || "");

  const handleSave = () => {
    const trimmedText = eventText.trim();
    if (trimmedText) {
      onSaveEvent(dayInfo.dateKey, trimmedText, category);
      setIsEditing(false);
    } else {
      handleDelete();
    }
  };

  const handleSaveDetails = () => {
    const budgetNum = budget ? parseFloat(budget) : undefined;
    onUpdateDetails(dayInfo.dateKey, {
      notes: notes.trim() || undefined,
      budget: budgetNum,
    });
    setShowDetails(false);
  };

  const handleDelete = () => {
    onDeleteEvent(dayInfo.dateKey);
    setEventText("");
    setCategory(undefined);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEventText(dayDetails?.event?.text || "");
    setCategory(dayDetails?.event?.category);
    setIsEditing(false);
  };

  const handleCancelDetails = () => {
    setNotes(dayDetails?.notes || "");
    setBudget(dayDetails?.budget?.toString() || "");
    setShowDetails(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const categoryData = dayDetails?.event?.category ? categoryMetadata[dayDetails.event.category] : null;

  return (
    <Card
      className={`p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
        dayInfo.isWeekend ? "border-l-4 border-l-primary/40 bg-primary/5" : ""
      }`}
      data-testid={`card-day-${dayInfo.dayNumber}`}
    >
      <div className="grid grid-cols-[auto_1fr_auto] gap-4">
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
          {dayDetails?.event && !isEditing && (
            <Badge
              variant="secondary"
              className={`mt-2 text-xs w-fit max-w-full border ${categoryData?.color || ""}`}
              data-testid={`badge-event-${dayInfo.dayNumber}`}
            >
              {categoryData && <span className="mr-1">{categoryData.icon}</span>}
              {dayDetails.event.text}
            </Badge>
          )}
          {dayDetails?.budget && !isEditing && (
            <div className="text-xs text-muted-foreground mt-1">
              💰 ${dayDetails.budget.toFixed(2)}
            </div>
          )}
        </div>

        {!isEditing ? (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="rounded-full hover-elevate active-elevate-2"
              data-testid={`button-details-${dayInfo.dayNumber}`}
              title="Notas y presupuesto"
            >
              {showDetails ? <X className="h-3 w-3" /> : <StickyNote className="h-3 w-3" />}
            </Button>
            <Button
              variant={dayDetails?.event ? "default" : "outline"}
              size="sm"
              onClick={dayDetails?.event ? handleEdit : () => setIsEditing(true)}
              className="rounded-full whitespace-nowrap hover-elevate active-elevate-2"
              data-testid={`button-${dayDetails?.event ? "edit" : "add"}-event-${dayInfo.dayNumber}`}
            >
              {dayDetails?.event ? (
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
          <div className="col-span-3 flex flex-col gap-2">
            <Input
              value={eventText}
              onChange={(e) => setEventText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe el evento..."
              autoFocus
              data-testid={`input-event-${dayInfo.dayNumber}`}
            />
            <div className="flex gap-2 flex-wrap">
              <Select value={category} onValueChange={(val) => setCategory(val as EventCategory)}>
                <SelectTrigger className="flex-1 min-w-[150px]" data-testid={`select-category-${dayInfo.dayNumber}`}>
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryMetadata).map(([key, meta]) => (
                    <SelectItem key={key} value={key}>
                      <span className="flex items-center gap-2">
                        <span>{meta.icon}</span>
                        <span>{meta.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                {dayDetails?.event && (
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
          </div>
        )}
      </div>

      {showDetails && !isEditing && (
        <div className="mt-4 pt-4 border-t border-border space-y-3">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              Notas del día
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Agrega notas adicionales..."
              className="resize-none"
              rows={3}
              data-testid={`textarea-notes-${dayInfo.dayNumber}`}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              Presupuesto del día ($)
            </label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="0.00"
              data-testid={`input-budget-${dayInfo.dayNumber}`}
            />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleSaveDetails}
              variant="default"
              className="hover-elevate active-elevate-2"
              data-testid={`button-save-details-${dayInfo.dayNumber}`}
            >
              <Save className="h-3 w-3 mr-1" />
              Guardar
            </Button>
            <Button
              size="sm"
              onClick={handleCancelDetails}
              variant="outline"
              className="hover-elevate active-elevate-2"
              data-testid={`button-cancel-details-${dayInfo.dayNumber}`}
            >
              <X className="h-3 w-3 mr-1" />
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
