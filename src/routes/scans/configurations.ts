import ScanResultStatus from "$lib/components/scan-result-status/scan-result-status.svelte";
import { renderComponent, renderSnippet } from "$lib/components/ui/data-table";
import type { EmptyResultsConfiguration } from "$lib/models/common";
import type { MenuConfiguration } from "$lib/models/menu";
import type { ScanResult } from "$lib/models/scan";
import type { ColumnDef } from "@tanstack/table-core";
import { createRawSnippet } from "svelte";
import ScanTableActions from "./scan-table-actions.svelte";
import Copy from "lucide-svelte/icons/copy";
import Trash2 from "lucide-svelte/icons/trash-2";
import Radar from "lucide-svelte/icons/radar";
import ScanResultEstimation from "$lib/components/scan-result-estimation/scan-result-estimation.svelte";

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
    cell: ({row}) => {
      const estimation = row.original.estimation;
      if (!estimation) return;
      return renderComponent(ScanResultEstimation, { estimation });
    }
  },
  {
    accessorKey: 'explanation',
    header: 'Explanation',
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({row}) => {
      return renderComponent(ScanTableActions, {data: row.original}) 
    }
  }
];

export const actionsMenu: MenuConfiguration<ScanResult> = {
  groups: [
    {
      items: [
        {
          title: 'Rescan', 
          event: 'scan', 
          icon: Radar,
        },
        {
          title: 'Copy scan ID', 
          event: 'copy', 
          icon: Copy
        }
      ]
    },
    {
      items: [
        {
          title: 'Delete', 
          event: 'delete', 
          icon: Trash2, 
          class: 'bg-destructive/5 text-destructive'}
      ]
    }
  ]
}