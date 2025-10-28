import { useItinerary } from "@/hooks/use-itinerary";
import { generateItineraryDays } from "@/lib/itinerary-utils";
import { CalendarPicker } from "@/components/calendar-picker";
import { DateRangeDisplay } from "@/components/date-range-display";
import { SummaryPanel } from "@/components/summary-panel";
import { Timeline } from "@/components/timeline";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Skeleton } from "@/components/ui/skeleton";
import { RotateCcw, Loader2 } from "lucide-react";

export default function Home() {
  const { 
    startDate, 
    events, 
    isLoading, 
    isSaving,
    setStartDate, 
    setEvent, 
    deleteEvent, 
    clearItinerary 
  } = useItinerary();

  const startDateObj = startDate ? new Date(startDate + "T00:00:00") : null;
  const days = startDateObj ? generateItineraryDays(startDateObj) : [];

  const handleDateChange = (date: Date) => {
    setStartDate(date);
  };

  const handleClearItinerary = () => {
    if (
      window.confirm(
        "¿Estás seguro de que deseas limpiar el itinerario? Se perderán todos los eventos guardados."
      )
    ) {
      clearItinerary();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-primary/5">
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        <main className="max-w-7xl mx-auto px-4 py-8">
          <header className="max-w-2xl mx-auto text-center mb-12">
            <Skeleton className="h-14 w-3/4 mx-auto mb-4" />
            <Skeleton className="h-6 w-full" />
          </header>
          <div className="grid md:grid-cols-2 gap-8 items-start max-w-6xl mx-auto">
            <Card className="p-6">
              <Skeleton className="h-96 w-full" />
            </Card>
            <Card className="p-6">
              <Skeleton className="h-96 w-full" />
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-primary/5">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {isSaving && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm font-medium">Guardando...</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">
        <header className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Calculadora COSMOS (25 Días)
          </h1>
          <p className="text-lg text-muted-foreground">
            Selecciona la fecha de inicio para ver tu itinerario fijo de{" "}
            <strong>25 días / 24 noches</strong>.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 items-start max-w-6xl mx-auto">
          <div>
            <Card className="p-6 backdrop-blur-sm">
              <label
                className="block text-xl font-semibold text-foreground mb-4 text-center"
                htmlFor="calendar-picker"
              >
                Selecciona Fecha de Inicio
              </label>

              <DateRangeDisplay startDate={startDateObj} />

              <div className="mt-6 max-w-md mx-auto">
                <CalendarPicker
                  selectedDate={startDateObj}
                  onDateChange={handleDateChange}
                />
              </div>

              <Button
                onClick={handleClearItinerary}
                variant="outline"
                className="mt-4 w-full hover-elevate active-elevate-2"
                data-testid="button-clear-itinerary"
                disabled={isSaving}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Limpiar y Reiniciar Itinerario
              </Button>

              <SummaryPanel hasStartDate={!!startDateObj} />
            </Card>
          </div>

          <div>
            {days.length > 0 ? (
              <Timeline
                days={days}
                events={events}
                onSaveEvent={setEvent}
                onDeleteEvent={deleteEvent}
              />
            ) : (
              <Card className="p-12 text-center backdrop-blur-sm">
                <p className="text-muted-foreground text-lg">
                  Selecciona una fecha de inicio para ver tu itinerario
                </p>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
