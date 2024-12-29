import type { ComboboxConfiguration } from "./combobox";

export interface ScansSettings {
  user_id: string;
  start_scans_immediately: boolean;
  csv_parser?: 'strict' | 'dynamic';
}

interface SettingsBooleanAction {
  type: 'boolean',
}

interface SettingsChoisesAction {
  type: 'choises',
  options: ComboboxConfiguration['options'];
}

interface SettingsItemConfiguration<T> {
  title: string;
  description: string;
  path: keyof T;
  action: SettingsBooleanAction | SettingsChoisesAction
}

export interface SettingsConfiguration<T> {
  title: string;
  items: SettingsItemConfiguration<T>[];
}
