import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Itinerary, DayDetails, EventCategory } from "@shared/schema";

const ITINERARY_QUERY_KEY = "/api/itinerary";

export function useItinerary() {
  // Fetch itinerary from backend
  const { data, isLoading, error } = useQuery<Itinerary>({
    queryKey: [ITINERARY_QUERY_KEY],
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Save itinerary mutation with optimistic updates
  const saveMutation = useMutation({
    mutationFn: async (itinerary: Itinerary) => {
      const response = await apiRequest("POST", ITINERARY_QUERY_KEY, itinerary);
      return await response.json();
    },
    onMutate: async (newItinerary) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [ITINERARY_QUERY_KEY] });

      // Snapshot the previous value
      const previousItinerary = queryClient.getQueryData([ITINERARY_QUERY_KEY]);

      // Optimistically update to the new value
      queryClient.setQueryData([ITINERARY_QUERY_KEY], newItinerary);

      // Return a context object with the snapshotted value
      return { previousItinerary };
    },
    onError: (err, newItinerary, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData([ITINERARY_QUERY_KEY], context?.previousItinerary);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: [ITINERARY_QUERY_KEY] });
    },
  });

  // Delete itinerary mutation with optimistic updates
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", ITINERARY_QUERY_KEY);
      return await response.json();
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [ITINERARY_QUERY_KEY] });
      const previousItinerary = queryClient.getQueryData([ITINERARY_QUERY_KEY]);

      // Optimistically clear the itinerary
      const today = new Date();
      const todayISO = today.toISOString().split("T")[0];
      queryClient.setQueryData([ITINERARY_QUERY_KEY], {
        startDate: todayISO,
        days: {},
      });

      return { previousItinerary };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData([ITINERARY_QUERY_KEY], context?.previousItinerary);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [ITINERARY_QUERY_KEY] });
    },
  });

  // Get current state with fallback to today's date
  const getCurrentState = (): { startDate: string | null; days: Record<string, DayDetails> } => {
    if (data) {
      return { startDate: data.startDate, days: data.days || {} };
    }
    
    // Default to today's date when no data
    const today = new Date();
    const todayISO = today.toISOString().split("T")[0];
    return { startDate: todayISO, days: {} };
  };

  const currentState = getCurrentState();

  const setStartDate = (date: Date | null) => {
    const newStartDate = date ? date.toISOString().split("T")[0] : null;
    const newItinerary: Itinerary = {
      startDate: newStartDate || "",
      days: currentState.days,
    };
    
    if (newStartDate) {
      saveMutation.mutate(newItinerary);
    }
  };

  const setEvent = (dateKey: string, eventText: string, category?: EventCategory) => {
    const existingDay = currentState.days[dateKey] || {};
    const newItinerary: Itinerary = {
      startDate: currentState.startDate || "",
      days: {
        ...currentState.days,
        [dateKey]: {
          ...existingDay,
          event: { text: eventText, category },
        },
      },
    };
    saveMutation.mutate(newItinerary);
  };

  const deleteEvent = (dateKey: string) => {
    const newDays = { ...currentState.days };
    delete newDays[dateKey];
    
    const newItinerary: Itinerary = {
      startDate: currentState.startDate || "",
      days: newDays,
    };
    saveMutation.mutate(newItinerary);
  };

  const clearItinerary = () => {
    deleteMutation.mutate();
  };

  return {
    startDate: currentState.startDate,
    days: currentState.days,
    isLoading,
    error,
    isSaving: saveMutation.isPending || deleteMutation.isPending,
    setStartDate,
    setEvent,
    deleteEvent,
    clearItinerary,
  };
}
