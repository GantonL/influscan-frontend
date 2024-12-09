import ScanResultStatus from "$lib/components/scan-result-status/scan-result-status.svelte";
import { renderComponent, renderSnippet } from "$lib/components/ui/data-table";
import type { MenuConfiguration } from "$lib/models/menu";
import type { ScanResult } from "$lib/models/scan";
import type { ColumnDef } from "@tanstack/table-core";
import { createRawSnippet } from "svelte";
import ScanTableActions from "./scan-table-actions.svelte";
import Copy from "lucide-svelte/icons/copy";
import Trash2 from "lucide-svelte/icons/trash-2";
import Radar from "lucide-svelte/icons/radar";
import Eye from "lucide-svelte/icons/eye";
import TableOfContents from "lucide-svelte/icons/table-of-contents";
import ScanResultEstimation from "$lib/components/scan-result-estimation/scan-result-estimation.svelte";
import Checkbox from "$lib/components/checkbox/checkbox.svelte";
import ScanResultExplanation from "$lib/components/scan-result-explanaiton/scan-result-explanation.svelte";
import type { TableConfiguration } from "$lib/models/table";

export const columns: ColumnDef<ScanResult>[] = [
  {
    id: "select",
    header: ({ table }) =>
      renderComponent(Checkbox, {
        checked: table.getIsAllPageRowsSelected(),
        indeterminate:
          table.getIsSomePageRowsSelected() &&
          !table.getIsAllPageRowsSelected(),
        onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
        controlledChecked: true,
        "aria-label": "Select all",
      }),
    cell: ({ row }) =>
      renderComponent(Checkbox, {
        checked: row.getIsSelected(),
        onCheckedChange: (value) => row.toggleSelected(!!value),
        controlledChecked: true,
        "aria-label": "Select row",
      }),
    enableSorting: false,
    enableHiding: false,
  },
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
    cell: ({row}) => {
      const explanation = row.original.explanation;
      if (!explanation) return;
      return renderComponent(ScanResultExplanation, { explanation });
    }
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
          title: 'View details', 
          event: 'view', 
          icon: Eye,
        },
        {
          title: 'Rescan', 
          event: 'scan', 
          icon: Radar,
        },
        {
          title: 'Copy scan ID', 
          event: 'copy', 
          icon: Copy
        },
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
};

export const tableConfiguration: TableConfiguration<ScanResult> = {
  bulkActions: {
    label: 'Actions',
    buttonVariant: 'default',
    trigger: TableOfContents,
    groups: [
      {
        items: [
          {
            title: 'Rescan', 
            event: 'scan', 
            icon: Radar,
          },
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
  },
};