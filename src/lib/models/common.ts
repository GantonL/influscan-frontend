
export interface EmptyResultsConfiguration {
  label: string;
  icon?: ConstructorOfATypedSvelteComponent;
  action?: {
    label: string;
    event: string;
  },
  class?: string;
}