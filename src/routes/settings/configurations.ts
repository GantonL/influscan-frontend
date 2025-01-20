import { Plan } from "$lib/enums/plan";
import type { ScansSettings, SettingsConfiguration } from "$lib/models/settings";
import type { User } from "$lib/models/user";

export const ScansSettingsConfigurations: SettingsConfiguration<Omit<ScansSettings, 'user_id'>> = {
  title: 'Scans',
  items: [
    {
      title: 'Start scans immediately',
      description: 'Execution of scans will start immediately after a scan objcet has been created in multiple or single mode',
      path: 'start_scans_immediately',
      action: {
        type: 'boolean'
      },
      plans: [Plan.Lite, Plan.Plus, Plan.Pro],
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
            description: 'Parse with a strict policy, using predefined required fields.',
            disabledIf: (user) => ![Plan.Lite, Plan.Plus, Plan.Pro].includes((user as User)?.plan ?? Plan.None)
          },
          {
            label: 'Dynamic',
            value: 'dynamic',
            description: 'Let us figure out the fields we need.',
            disabledIf: (user) => ![Plan.Plus, Plan.Pro].includes((user as User)?.plan ?? Plan.None)
          }
        ]
      },
      plans: [Plan.Lite, Plan.Plus, Plan.Pro],
    },
    {
      title: 'Narrowed analysis',
      description: 'Define analysis narrowing rules to meet the needs of your business and reduce noise.',
      path: 'narrowed_analysis',
      action: {
        type: 'boolean',
      },
      plans: [Plan.Plus, Plan.Pro],
    }
  ]
}