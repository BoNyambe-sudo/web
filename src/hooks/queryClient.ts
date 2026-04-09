import { QueryClient } from "@tanstack/react-query";

// Create and export query client instance
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Default query options
      staleTime: 1000 * 60 * 5, // 5 minutes default stale time
      gcTime: 1000 * 60 * 30, // 30 minutes default garbage collection
    },
  },
});
