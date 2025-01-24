import type { MenuConfiguration } from "./menu";

export interface TableConfiguration<T> {
  bulkActions?: MenuConfiguration<T>;
  onRowClick?: { event: string; ignoreColumns?: string[] };
  pageSize?: number;
}