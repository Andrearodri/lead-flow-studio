import { useSyncExternalStore } from "react";
import { tagService, type Tag } from "@/services/tagService";

/**
 * React hook that subscribes to the tagService and re-renders on changes.
 * Uses useSyncExternalStore for tear-free reads.
 */
export function useTags(): Tag[] {
  return useSyncExternalStore(
    tagService.subscribe,
    tagService.getTags,
    tagService.getTags,
  );
}
