<script lang="ts" generics="TData, TValue">
  import { type ColumnDef, getCoreRowModel, getPaginationRowModel, type PaginationState, type RowSelectionState, type TableOptions, type VisibilityState } from "@tanstack/table-core";
  import {
   createSvelteTable,
   FlexRender,
  } from "$lib/components/ui/data-table/index.js";
  import * as Table from "$lib/components/ui/table/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import Settings2 from "lucide-svelte/icons/settings-2";
	import ChevronLeft from "lucide-svelte/icons/chevron-left";
	import ChevronRight from "lucide-svelte/icons/chevron-right";
	import { Plus } from "lucide-svelte";
	import EmptyResults from "../empty-results/empty-results.svelte";
	import { type TableConfiguration } from "$lib/models/table";
	import Menu from "../menu/menu.svelte";

  type DataTableProps<TData, TValue> = {
   columns: ColumnDef<TData, TValue>[];
   data: TData[];
   configuration?: TableConfiguration<TData>;
  };
  
  let { data, columns, configuration, addData, bulkActions }: DataTableProps<TData, TValue> & { addData: () => void, bulkActions?: (e: {type: string; data: any}) => void } = $props();

  let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
  let columnVisibility = $state<VisibilityState>({});
  let rowSelection = $state<RowSelectionState>({});
  
  const tableOptions: TableOptions<any> = ({
    get data() {
      return data;
    },
    columns,
    onColumnVisibilityChange: (updater) => {
      if (typeof updater === "function") {
        columnVisibility = updater(columnVisibility);
      } else {
        columnVisibility = updater;
      }
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        pagination = updater(pagination);
      } else {
        pagination = updater;
      }
    },
    onRowSelectionChange: (updater) => {
      if (typeof updater === "function") {
        rowSelection = updater(rowSelection);
      } else {
        rowSelection = updater;
      }
    },
    state: {
      get pagination() {
        return pagination;
      },
      get columnVisibility() {
        return columnVisibility;
      },
      get rowSelection() {
        return rowSelection;
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })
  const table = createSvelteTable(tableOptions);

  function onBulkMenu(e: {type: string; data: any}) {
    bulkActions && bulkActions(e);
  }
 </script>
  
 <div class="flex flex-col gap-2 w-full max-w-[1200px]">
   {@render header()}
   <div class="rounded-md border">
    <Table.Root>
     <Table.Header>
      {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
       <Table.Row>
        {#each headerGroup.headers as header (header.id)}
         <Table.Head>
          {#if !header.isPlaceholder}
           <FlexRender
            content={header.column.columnDef.header}
            context={header.getContext()}
           />
          {/if}
         </Table.Head>
        {/each}
       </Table.Row>
      {/each}
     </Table.Header>
     <Table.Body>
      {#each table.getRowModel().rows as row (row.id)}
       <Table.Row data-state={row.getIsSelected() && "selected"}>
        {#each row.getVisibleCells() as cell (cell.id)}
         <Table.Cell>
          <FlexRender
           content={cell.column.columnDef.cell}
           context={cell.getContext()}
          />
         </Table.Cell>
        {/each}
       </Table.Row>
      {:else}
       <Table.Row>
        <Table.Cell colspan={columns.length} class="h-24 text-center">
          <EmptyResults />
        </Table.Cell>
       </Table.Row>
      {/each}
     </Table.Body>
    </Table.Root>
   </div>
   {@render footer()}
 </div>

 {#snippet header()}
  <div class="flex flex-row gap-2 justify-between">
    <div class="flex flex-row gap-2 items-center">
      <Button
        variant="outline"
        onclick={() => addData()}
      >
        <div class="flex flex-row gap-2 items-center">
          <Plus />
          <span>Add</span>
        </div>
      </Button>
      {#if configuration?.bulkActions && (table.getIsSomePageRowsSelected() || table.getIsAllPageRowsSelected() || table.getIsAllRowsSelected())}
        <Menu rawData={table.getFilteredSelectedRowModel().rows.map(r => r.original)} configuration={configuration.bulkActions} event={onBulkMenu}/>
      {/if}
    </div>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {#snippet child({ props })}
          <Button {...props} variant="outline" class="flex flex-row gap-2 items-center">
            <Settings2 />
            <span>View</span>
          </Button>
        {/snippet}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        {#each table
          .getAllColumns()
          .filter((col) => col.getCanHide()) as column (column.id)}
          <DropdownMenu.CheckboxItem
            class="capitalize"
            controlledChecked
            checked={column.getIsVisible()}
            onCheckedChange={(value) => column.toggleVisibility(!!value)}
          >
            {column.id}
          </DropdownMenu.CheckboxItem>
        {/each}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>
 {/snippet}

 {#snippet footer()}
  <div class="flex flex-row gap-2 justify-between">
    <div class="text-muted-foreground flex-1 text-sm">
      {table.getFilteredSelectedRowModel().rows.length} of{" "}
      {table.getFilteredRowModel().rows.length} row(s) selected.
    </div>
    <div class="flex items-center justify-end">
      <Button
        variant="outline"
        size="sm"
        onclick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronLeft />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onclick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        <ChevronRight />
      </Button>
    </div>
  </div>
 {/snippet}