import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Itinerary } from "@shared/schema";

const ITINERARY_QUERY_KEY = "/api/itinerary";

export function useItinerary() {
  // Fetch itinerary from backend
  const { data, isLoading, error } = useQuery<Itinerary>({
    queryKey: [ITINERARY_QUERY_KEY],
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Save itinerary mutation
  const saveMutation = useMutation({
    mutationFn: async (itinerary: Itinerary) => {
      const response = await apiRequest("POST", ITINERARY_QUERY_KEY, itinerary);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ITINERARY_QUERY_KEY] });
    },
  });

  // Delete itinerary mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", ITINERARY_QUERY_KEY);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ITINERARY_QUERY_KEY] });
    },
  });

  // Get current state with fallback to today's date
  const getCurrentState = (): { startDate: string | null; events: Record<string, string> } => {
    if (data) {
      return { startDate: data.startDate, events: data.events };
    }
    
    // Default to today's date when no data
    const today = new Date();
    const todayISO = today.toISOString().split("T")[0];
    return { startDate: todayISO, events: {} };
  };

  const currentState = getCurrentState();

  const setStartDate = (date: Date | null) => {
    const newStartDate = date ? date.toISOString().split("T")[0] : null;
    const newItinerary: Itinerary = {
      startDate: newStartDate || "",
      events: currentState.events,
    };
    
    if (newStartDate) {
      saveMutation.mutate(newItinerary);
    }
  };

  const setEvent = (dateKey: string, eventText: string) => {
    const newItinerary: Itinerary = {
      startDate: currentState.startDate || "",
      events: {
        ...currentState.events,
        [dateKey]: eventText,
      },
    };
    saveMutation.mutate(newItinerary);
  };

  const deleteEvent = (dateKey: string) => {
    const newEvents = { ...currentState.events };
    delete newEvents[dateKey];
    
    const newItinerary: Itinerary = {
      startDate: currentState.startDate || "",
      events: newEvents,
    };
    saveMutation.mutate(newItinerary);
  };

  const clearItinerary = () => {
    deleteMutation.mutate();
  };

  return {
    startDate: currentState.startDate,
    events: currentState.events,
    isLoading,
    error,
    isSaving: saveMutation.isPending,
    setStartDate,
    setEvent,
    deleteEvent,
    clearItinerary,
  };
}
