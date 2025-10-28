import { getEndDate } from "@/lib/itinerary-utils";

interface DateRangeDisplayProps {
  startDate: Date | null;
}

export function DateRangeDisplay({ startDate }: DateRangeDisplayProps) {
  if (!startDate) {
    return (
      <div
        className="text-center text-lg font-bold text-muted-foreground p-4 bg-gradient-to-r from-muted to-accent rounded-xl border border-border"
        data-testid="text-date-range"
      >
        Selecciona una fecha de inicio
      </div>
    );
  }

  const endDate = getEndDate(startDate);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div
      className="text-center text-lg font-bold text-primary p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20"
      data-testid="text-date-range"
    >
      <div className="text-sm font-medium text-muted-foreground mb-1">
        Itinerario de 25 días
      </div>
      <div>
        {formatDate(startDate)} - {formatDate(endDate)}
      </div>
    </div>
  );
}
