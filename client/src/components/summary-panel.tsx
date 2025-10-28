import { DAYS_IN_TRIP, NIGHTS_IN_TRIP } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SummaryPanelProps {
  hasStartDate: boolean;
}

export function SummaryPanel({ hasStartDate }: SummaryPanelProps) {
  return (
    <Card className="mt-8">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl text-center">Resumen del Viaje</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <Card className="text-center p-3 border-primary/20">
            <p
              className="text-3xl font-extrabold text-primary"
              data-testid="text-days-total"
            >
              {DAYS_IN_TRIP}
            </p>
            <p className="text-xs font-medium text-muted-foreground mt-1">
              Días Totales
            </p>
          </Card>

          <Card className="text-center p-3 border-primary/20">
            <p
              className="text-3xl font-extrabold text-primary"
              data-testid="text-nights-total"
            >
              {NIGHTS_IN_TRIP}
            </p>
            <p className="text-xs font-medium text-muted-foreground mt-1">
              Noches Totales
            </p>
          </Card>
        </div>

        <p
          className="text-sm font-medium text-muted-foreground mt-4 text-center"
          data-testid="text-status-message"
        >
          {hasStartDate
            ? "Itinerario listo para personalizar"
            : "Selecciona una fecha para comenzar"}
        </p>
      </CardContent>
    </Card>
  );
}
