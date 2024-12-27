import type { ScansSettings, SettingsConfiguration } from "$lib/models/settings";

export const ScansSettingsConfigurations: SettingsConfiguration<ScansSettings> = {
  title: 'Scans',
  items: [
    {
      title: 'Start scans immediately',
      description: 'Execution of scans will start immediately after a scan objcet has been created in multiple or single mode',
      path: 'start_scans_immediately',
      action: {
        type: 'boolean'
      }
    },
    {
      title: 'Parse CSV files with AI',
      description: 'Use any CSV file structure to initiate scans in multiple mode using our AI engine',
      path: 'parse_csv_with_ai',
      action: {
        type: 'boolean'
      }
    }
  ]
}