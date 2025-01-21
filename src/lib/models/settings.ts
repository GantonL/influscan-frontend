import type { Plan } from "$lib/enums/plan";
import type { ComboboxConfiguration } from "./combobox";

export interface ScansSettings {
  user_id: string;
  start_scans_immediately: boolean;
  csv_parser?: 'strict' | 'dynamic';
  narrowed_analysis: boolean;
  prioritized_platform?: string;
  prioritized_domain?: string;
  prioritized_niche?: string;
}

export interface SettingsTextAction {
  type: 'text',
  placeholder?: string;
  title?: string;
  description?: string;
}

export interface SettingsBooleanAction {
  type: 'boolean';
}

export interface SettingsChoisesAction {
  type: 'choises',
  options: ComboboxConfiguration['options'];
}

export interface SettingsItemConfiguration<T> {
  title: string;
  description: string;
  path: keyof T;
  action: SettingsBooleanAction | SettingsChoisesAction | SettingsTextAction;
  plans?: Plan[];
  disabled?: boolean;
  requiresUpgrade?: boolean;
  children?: SettingsItemConfiguration<T>[];
}

export interface SettingsConfiguration<T> {
  title: string;
  items: SettingsItemConfiguration<T>[];
}
