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
  action: SettingsBooleanAction | SettingsChoisesAction;
  plans: Plan[];
  disabled?: boolean;
  requiresUpgrade?: boolean;
}

export interface SettingsConfiguration<T> {
  title: string;
  items: SettingsItemConfiguration<T>[];
}
