
export interface EmptyResultsConfiguration {
  label: string;
  icon?: ConstructorOfATypedSvelteComponent;
  action?: {
    label: string;
    event: string;
  },
  class?: string;
}

export interface AppCustomEvent<Data = void> {
  type: string;
  data?: Data;
}
