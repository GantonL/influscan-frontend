export interface ComboboxConfiguration {
  options: {
    value: string;
    label: string;
    description?: string;
  }[];
  event?: string;
  placeholder?: string;
  search?: {
    placeholder?: string;
    emptyState?: string;
  }
}