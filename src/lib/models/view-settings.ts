import type { SortingState } from "@tanstack/table-core";

export interface BaseViewSettings {
  user_id: string;
  page_size?: number;
  sort_by?: SortingState;
}

export type ScansViewSettings = BaseViewSettings;