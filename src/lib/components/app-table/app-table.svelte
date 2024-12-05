<script lang="ts" generics="TData, TValue">
  import { type ColumnDef, getCoreRowModel, getPaginationRowModel, type PaginationState, type VisibilityState } from "@tanstack/table-core";
  import {
   createSvelteTable,
   FlexRender,
  } from "$lib/components/ui/data-table/index.js";
  import * as Table from "$lib/components/ui/table/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import ChevronDown from "lucide-svelte/icons/chevron-down";
	import { Plus } from "lucide-svelte";

  type DataTableProps<TData, TValue> = {
   columns: ColumnDef<TData, TValue>[];
   data: TData[];
  };
  
  let { data, columns, addData }: DataTableProps<TData, TValue> & { addData: () => void } = $props();

  let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
  let columnVisibility = $state<VisibilityState>({});
  
  const table = createSvelteTable({
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
    state: {
      get pagination() {
        return pagination;
      },
      get columnVisibility() {
        return columnVisibility;
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
 </script>
  
 <div class="flex flex-col gap-2">
    <div class="flex flex-row gap-2 justify-between">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          {#snippet child({ props })}
            <Button {...props} variant="outline" class="flex flex-row gap-2 items-center">
              <span>Columns</span>
              <ChevronDown />
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
      <Button
        variant="outline"
        onclick={() => addData()}
      >
        <div class="flex flex-row gap-2 items-center">
          <Plus />
          <span>Add</span>
        </div>
      </Button>
    </div>
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
         No results.
        </Table.Cell>
       </Table.Row>
      {/each}
     </Table.Body>
    </Table.Root>
   </div>
   <div class="flex items-center justify-end">
    <Button
      variant="outline"
      size="sm"
      onclick={() => table.previousPage()}
      disabled={!table.getCanPreviousPage()}
    >
      Previous
    </Button>
    <Button
      variant="outline"
      size="sm"
      onclick={() => table.nextPage()}
      disabled={!table.getCanNextPage()}
    >
      Next
    </Button>
   </div>
 </div>
 