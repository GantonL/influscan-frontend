import type { SortingState } from "@tanstack/table-core";
import type { DateFilter } from "./filter";

export interface BaseViewSettings {
  user_id: string;
  page_size?: number;
  sort_by?: SortingState;
  filters?: DateFilter[];
}

export type ScansViewSettings = BaseViewSettings;