import { QueryClient } from "@tanstack/react-query";

/**
 * A global instance of the Tanstack React Query client
 * 
 * Garbage collection is disabled by default, as we are using MMKV
 * as a client persister. This may need to be re-evaluated
 * at some point if storage usage becomes a problem
 * 
 * Default stale time is set to 1 hour. Users have the option
 * to refresh relevant datasets by design (i.e. refreshing 
 * Discover page for more results)
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: Infinity, // disable
            staleTime: (1000 * 60 * 60) * 1 // 1 hour, users can manually refresh stuff too!
        }
    }
});