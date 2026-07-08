import { useSyncExternalStore } from "react";
import { funnelService, type FunnelColumn } from "@/services/funnelService";

/**
 * React hook that subscribes to the funnelService and re-renders on changes.
 * Returns columns sorted by order.
 */
export function useFunnelColumns(): FunnelColumn[] {
  return useSyncExternalStore(
    funnelService.subscribe,
    funnelService.getColumns,
    funnelService.getColumns,
  );
}
