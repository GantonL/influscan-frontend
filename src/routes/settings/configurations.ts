import type { ScansSettings, SettingsConfiguration } from "$lib/models/settings";

export const ScansSettingsConfigurations: SettingsConfiguration<Omit<ScansSettings, 'user_id'>> = {
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
      title: 'CSV Parser',
      description: 'Choose the parsing method of CSV files',
      path: 'csv_parser',
      action: {
        type: 'choises',
        options: [
          {
            label: 'Strict',
            value: 'strict',
            description: 'Parse with a strict policy, using predefined required fields.'
          },
          {
            label: 'Dynamic',
            value: 'dynamic',
            description: 'Let us figure out the fields we need.'
          }
        ]
      }
    }
  ]
}