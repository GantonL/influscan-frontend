export interface ScansSettings {
  user_id: string;
  start_scans_immediately: boolean;
  parse_csv_with_ai: boolean;
}

interface SettingsItemConfiguration<T> {
  title: string;
  description: string;
  path: keyof T;
  action: {
    type: 'boolean'
  }
}

export interface SettingsConfiguration<T> {
  title: string;
  items: SettingsItemConfiguration<T>[];
}
