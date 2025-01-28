export interface DatabaseFilter {
  column: string;
  operator: string;
  value: unknown;
}

export type DateFilter = {
  type: 'date';
  path: string;
  start?: string;
  end?: string;
}