import Menu from "$lib/components/menu/menu.svelte";
import ScanResultStatus from "$lib/components/scan-result-status/scan-result-status.svelte";
import { renderComponent, renderSnippet } from "$lib/components/ui/data-table";
import type { EmptyResultsConfiguration } from "$lib/models/common";
import type { MenuConfiguration } from "$lib/models/menu";
import type { ScanResult } from "$lib/models/scan";
import type { ColumnDef } from "@tanstack/table-core";
import { createRawSnippet } from "svelte";
import { writable } from "svelte/store";

export const scanActionsMenuEvents = writable();

export const emptyResultsConfiguration: EmptyResultsConfiguration = {
  label: 'No scans found',
  action: {
    event: 'add',
    label: 'Add'
  }
}

export const columns: ColumnDef<ScanResult>[] = [
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({row}) => {
      return renderComponent(ScanResultStatus, {status: row.original.status});
    }
  },
  {
    accessorKey: 'details',
    header: 'Details',
    cell: ({row}) => {
      const detailsCellSnippet = createRawSnippet((getDetails: () => ScanResult['details']) => {
        const details = getDetails();
        return {
          render: () => `<div>${details.first_name} ${details.last_name}</div>`
        }
      });
      return renderSnippet(detailsCellSnippet, row.getValue('details'));
    }
  },
  {
    accessorKey: 'estimation',
    header: 'Estimation',
  },
  {
    accessorKey: 'explanation',
    header: 'Explanation',
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({row}) => {
      return renderComponent(Menu, { rawData: row.original, configuration: actionsMenu, event: scanActionsMenuEvents.set  }) 
    }
  }
];

const actionsMenu: MenuConfiguration = {
  groups: [
    {
      items: [
        {title: 'Copy scan ID', event: 'copy'}
      ]
    },
    {
      items: [
        {title: 'Delete', event: 'delete'}
      ]
    }
  ]
}