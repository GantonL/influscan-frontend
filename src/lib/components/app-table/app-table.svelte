<script lang="ts" generics="TData, TValue">
  import { type ColumnDef, getCoreRowModel, getPaginationRowModel, getSortedRowModel, type PaginationState, type RowSelectionState, type SortingState, type TableOptions, type VisibilityState } from "@tanstack/table-core";
  import {
   createSvelteTable,
   FlexRender,
  } from "$lib/components/ui/data-table/index.js";
  import * as Table from "$lib/components/ui/table/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import Settings2 from "@lucide/svelte/icons/settings-2";
	import ChevronLeft from "@lucide/svelte/icons/chevron-left";
	import ChevronRight from "@lucide/svelte/icons/chevron-right";
	import { Plus } from "@lucide/svelte";
	import EmptyResults from "../empty-results/empty-results.svelte";
	import { type TableConfiguration } from "$lib/models/table";
	import Menu from "../menu/menu.svelte";
	import Combobox from "../combobox/combobox.svelte";
	import { pageSizeOptionsConfiguration } from "./defaults";
	import DateRangePicker from "../date-range-picker/date-range-picker.svelte";
	import { type DateFilter } from "$lib/models/filter";
	import { type DateValue } from "@internationalized/date";
	import { Input } from "../ui/input";
	import { useSidebar } from "../ui/sidebar";
	import { Skeleton } from "../ui/skeleton";
  

  type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    configuration?: TableConfiguration<TData>;
    disabled?: boolean;
    isLoading?: boolean;
  };
  
  let { 
    data, 
    columns,
    disabled,
    configuration,
    isLoading,
    addData, 
    bulkActions, 
    rowClick,
    pageSizeChanged,
    pageIndexChanged,
    sortingChanged,
    filterChanged
  }: DataTableProps<TData, TValue> & { 
    addData?: () => void;
    bulkActions?: (e: {type: string; data: any}) => void; 
    rowClick?: (e: {type: string; data: any}) => void;
    pageSizeChanged?: (newPageSize: number) => void;
    pageIndexChanged?: (newPageIndex: number) => void;
    sortingChanged?: (state: SortingState) => void;
    filterChanged?: (state: DateFilter) => void;
  } = $props();

  let pageSize = $state(configuration?.pageSize ?? 10);
  let pagination = $state<PaginationState>({ pageIndex: configuration?.pageIndex ?? 0, pageSize });
  let rowCount = $state(configuration?.serverSide?.totalItems);
  let columnVisibility = $state<VisibilityState>({});
  let rowSelection = $state<RowSelectionState>({});
  let sortingState = $state(configuration?.sortingState);
  let sorting = $state<SortingState>(sortingState ?? []);
  let dateFilter = $state(configuration?.dateFilter?.initialState);

  const tableOptions: TableOptions<any> = ({
    get data() {
      return data;
    },
    columns,
    rowCount,
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: (updater) => {
      if (typeof updater === "function") {
        sorting = updater(sorting);
      } else {
        sorting = updater;
      }
      sortingChanged && sortingChanged(sorting);
    },
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
      pageIndexChanged && pageIndexChanged(pagination.pageIndex);
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
      get sorting() {
        return sorting;
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: !!configuration?.serverSide?.manualPagination,
  })
  
  const table = createSvelteTable(tableOptions);
  
  const sidebar = useSidebar();

  function onBulkMenu(e: {type: string; data: any}) {
    bulkActions && bulkActions(e);
  }

  function onRowClick(columnId: string, data: any) {
    if (!configuration?.onRowClick || disabled) { return; }
    if (configuration.onRowClick.ignoreColumns?.includes(columnId)) { return; }
    rowClick && 
    rowClick({type: configuration.onRowClick.event, data})
  }

  /**
   * Used outside of the component to reset row selection
   */
  function resetSelection() {
    table.resetRowSelection();
  }

  function onPageSizeChanged(e: {type: string, data: any}) {
    const newPageSize = Number(e.data);
    pageSizeChanged && pageSizeChanged(newPageSize);
    table.setPageSize(newPageSize);
  }

  function onDateFilterChanged(date: DateValue | undefined, direction: 'start' | 'end') {
    if (!filterChanged || !configuration?.dateFilter?.enabled) { return; }
    const represntationalDate = date ? `${date.year}-${date.month}-${date.day}` : undefined;
    const dateFromValue = represntationalDate ? new Date(represntationalDate) : undefined;
    if (!dateFilter && dateFromValue) {
      dateFilter = {
        start: dateFromValue,
        end: dateFromValue,
      }
    } else {
      if (direction === 'start' && dateFilter?.start?.getTime() === dateFromValue?.getTime()) {
        return;
      }
      if (direction === 'end' && dateFilter?.end?.getTime() === dateFromValue?.getTime()) {
        return;
      }

    }
    if (dateFilter && dateFromValue) {
      dateFilter[direction] = dateFromValue;
    }
    filterChanged({type: 'date', path: configuration.dateFilter!.path, [direction]: represntationalDate})
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
         <Table.Cell
          onclick={() => onRowClick(cell.column.id, $state.snapshot(row.original))} >
          <FlexRender
           content={cell.column.columnDef.cell}
           context={cell.getContext()}
          />
         </Table.Cell>
        {/each}
       </Table.Row>
      {:else }
        {#if isLoading}
        <Table.Row>
          <Table.Cell colspan={columns.length}>
            <Skeleton class="mb-2 h-12 rounded-md" />
            <Skeleton class="mb-2 h-12 rounded-md" />
            <Skeleton class="mb-2 h-12 rounded-md" />
          </Table.Cell>
        </Table.Row>
        {:else}
          <Table.Row>
            <Table.Cell colspan={columns.length} class="h-24 text-center">
              <EmptyResults />
            </Table.Cell>
          </Table.Row>
        {/if}
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
        {disabled}
        variant="outline"
        onclick={() => addData()}
      >
        <div class="flex flex-row gap-2 items-center">
          <Plus />
          <span class:hidden={sidebar.isMobile}>Add</span>
        </div>
      </Button>
      {#if configuration?.bulkActions && (table.getIsSomePageRowsSelected() || table.getIsAllPageRowsSelected() || table.getIsAllRowsSelected())}
        <Menu
          {disabled} 
          rawData={table.getFilteredSelectedRowModel().rows.map(r => r.original)} 
          configuration={configuration.bulkActions} event={onBulkMenu}/>
      {/if}
    </div>
    <div class="flex flex-row gap-2 items-center">
      {#if configuration?.dateFilter?.enabled}
        <DateRangePicker
          {disabled}
          useIsMobile={true}
          start={dateFilter?.start}
          end={dateFilter?.end}
          startChanged={(v) => onDateFilterChanged(v, 'start')}
          endChanged={(v) => onDateFilterChanged(v, 'end')}
          />
      {/if}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          {#snippet child({ props })}
            <Button {...props} {disabled} variant="outline" class="flex flex-row gap-2 items-center">
              <Settings2 />
              <span class:hidden={sidebar.isMobile}>View</span>
            </Button>
          {/snippet}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
          {#each table
            .getAllColumns()
            .filter((col) => col.getCanHide()) as column (column.id)}
            <DropdownMenu.CheckboxItem
              {disabled}
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
  </div>
 {/snippet}

 {#snippet footer()}
  <div class="flex flex-row gap-2 justify-between">
    <div class="text-muted-foreground flex-1 text-sm">
      {table.getFilteredSelectedRowModel().rows.length} of{" "}
      {table.getFilteredRowModel().rows.length} row(s) selected.<br>
      <span>Total: {table.getRowCount()}</span> 
    </div>
    <div class="flex items-center justify-end gap-1">
      <Combobox
        {disabled}
        configuration={pageSizeOptionsConfiguration} 
        selectedOption={String(pageSize)}
        event={onPageSizeChanged}/>
      <Button
        variant="outline"
        size="sm"
        onclick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage() || disabled}
      >
        <ChevronLeft />
      </Button>
      <div class="flex flex-row gap-1 items-center">
        <span class:hidden={sidebar.isMobile}>Page</span>
        <Input type="number" class="max-w-14" 
          value={table.getState().pagination.pageIndex + 1}
          min=1
          max={table.getPageCount()}
          onchange={(v) => {
              const val = v.target?.value;
              const pageCount = table.getPageCount();
              if (!val) return;
              if (val < 1) {v.target.value = 1};
              if (val > pageCount) {v.target.value = pageCount};
              table.setPageIndex(Number(v.target.value) - 1)
            }
          }
          disabled={(!table.getCanPreviousPage() && !table.getCanNextPage()) || disabled}>
        </Input>
        <span class="text-nowrap">of {table.getPageCount()}</span>
      </div>
      <Button
        variant="outline"
        size="sm"
        onclick={() => table.nextPage()}
        disabled={!table.getCanNextPage() || disabled}
      >
        <ChevronRight />
      </Button>
    </div>
  </div>
 {/snippet}