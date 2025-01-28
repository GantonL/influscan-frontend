import ScanResultStatus from "$lib/components/scan-result-status/scan-result-status.svelte";
import { renderComponent, renderSnippet } from "$lib/components/ui/data-table";
import type { ScanResult } from "$lib/models/scan";
import type { ColumnDef } from "@tanstack/table-core";
import { createRawSnippet } from "svelte";
import Trash2 from "lucide-svelte/icons/trash-2";
import Radar from "lucide-svelte/icons/radar";
import TableOfContents from "lucide-svelte/icons/table-of-contents";
import Checkbox from "$lib/components/checkbox/checkbox.svelte";
import ScanResultExplanation from "$lib/components/scan-result-explanaiton/scan-result-explanation.svelte";
import type { TableConfiguration } from "$lib/models/table";

type TableScanResult = Pick<ScanResult, 'details' | 'id' | 'estimation' | 'explanation' | 'status' | 'rankings'>;

export const columns: ColumnDef<TableScanResult>[] = [
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
          render: () => `<div>${details.name}</div>`
        }
      });
      return renderSnippet(detailsCellSnippet, row.getValue('details'));
    }
  },
  {
    accessorKey: 'estimation',
    header: ({ column }) =>
      renderComponent(SortableHeader, {
        label: 'Estimation',
        onclick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      }),
    cell: ({row}) => {
      const estimation = row.original.estimation;
      if (!estimation) return;
      return renderComponent(Gauge, { value: estimation });
    }
  },
  {
    accessorKey: 'rankings',
    header: 'Socials',
    cell: ({row}) => {
      const rankings = row.original.rankings;
      if (!rankings) return;
      return renderComponent(ScanResultRankings, { rankings });
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
];

export const tableConfiguration: TableConfiguration<TableScanResult> = {
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
  onRowClick: {
    event: 'navigate',
    ignoreColumns: ['select']
  },
  dateFilter: {
    enabled: true,
    path: 'created_at',
  }
};

import { z } from "zod";
import SortableHeader from "$lib/components/app-table/sortable-header.svelte";
import ScanResultRankings from "$lib/components/scan-result-rankings/scan-result-rankings.svelte";
import Gauge from "$lib/components/gauge/gauge.svelte";
 
export const singleScanformSchema = z.object({
  name: z.string().min(3).max(50).trim(),
  email: z.string().optional(),
  address: z.string().optional(),
});
 
export type SingleScanFormSchema = typeof singleScanformSchema;