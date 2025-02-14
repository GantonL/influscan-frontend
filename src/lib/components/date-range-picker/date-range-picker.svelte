<script lang="ts">
  import CalendarIcon from "lucide-svelte/icons/calendar";
  import type { DateRange } from "bits-ui";
  import {
   CalendarDate,
   DateFormatter,
   type DateValue,
   getLocalTimeZone
  } from "@internationalized/date";
  import { cn } from "$lib/utils.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import { RangeCalendar } from "$lib/components/ui/range-calendar/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
	import { useSidebar } from "../ui/sidebar/context.svelte";
	import Combobox from "../combobox/combobox.svelte";
	import type { ComboboxConfiguration } from "$lib/models/combobox";
	import Button from "../ui/button/button.svelte";
	import { FilterX } from "lucide-svelte";
  type Preset = {
    label: string;
    range: DateRange;
  }

  let {useIsMobile, start, end, disabled, presets, startChanged, endChanged}: {
    useIsMobile?: boolean,
    start?: Date; 
    end?: Date;
    disabled?: boolean;
    presets?: Preset[];
    startChanged?: (value: DateValue | undefined) => void, 
    endChanged?: (value: DateValue | undefined) => void
  } = $props();

  const df = new DateFormatter("en-US", {
   dateStyle: "medium"
  });
  const now = new Date();
  const calendarNow = new CalendarDate(now.getFullYear(), (now.getMonth() + 1), now.getDate());
  let value: DateRange | undefined = $state({
   start: start ? new CalendarDate(start.getFullYear(), start.getMonth() + 1, start.getDate()) : undefined,
   end: end ? new CalendarDate(end.getFullYear(), end.getMonth() + 1, end.getDate()) : undefined,
  });
  let startValue: DateValue | undefined = $state(undefined);
  const sidebar = useSidebar();
  if (!presets) {
    presets = [
      {
        label: 'Today', 
        range: {
          start: calendarNow,
          end: calendarNow.add({days: 1}),
        },
      },
      {
        label: 'Last 7 days', 
        range: {
          start: calendarNow.subtract({days: 7}),
          end: calendarNow.add({days: 1})
        },
      },
      {
        label: 'Last 30 days', 
        range: {
          start: calendarNow.subtract({days: 30}),
          end: calendarNow.add({days: 1})
        },
      },
      {
        label: 'Last 12 months', 
        range: {
          start: calendarNow.subtract({months: 12}),
          end: calendarNow.add({days: 1})
        },
      }
    ];
  };
  const datesPresetsConfiguration: ComboboxConfiguration = {
    options: presets!.map((preset) => {
      return {
        label: preset.label,
        value: preset.label,
      } 
    })
  }
  const selectedPreset = $state(presets!.find(p => p.range.start?.toString() === value.start?.toString() && p.range.end?.toString() === value.end?.toString()));
  
  function onPresetsChanged(newPreset: Preset['label']) {
    const selectedPreset = presets?.find(p => p.label === newPreset);
    if (!selectedPreset) { return; }
    value = {
      start: selectedPreset!.range.start,
      end: selectedPreset!.range.end,
    };
    startChanged && startChanged(value.start);
    endChanged && endChanged(value.end);
  }

  function reset() {
    value = undefined;
    startChanged && startChanged(undefined);
    endChanged && endChanged(undefined);
  }

 </script>
  
 <div class="grid gap-2">
  <Popover.Root>
   <Popover.Trigger
    {disabled}
    class={cn(
     buttonVariants({ variant: "outline" }),
     !value && "text-muted-foreground"
    )}
   >
    <CalendarIcon class="size-4" />
    {#if (useIsMobile && !sidebar.isMobile) || !useIsMobile}
      {#if value && value.start}
      {#if value.end}
        {df.format(value.start.toDate(getLocalTimeZone()))} - {df.format(
        value.end.toDate(getLocalTimeZone())
        )}
      {:else}
        {df.format(value.start.toDate(getLocalTimeZone()))}
      {/if}
      {:else if startValue}
      {df.format(startValue.toDate(getLocalTimeZone()))}
      {:else}
      Pick a date
      {/if}
    {/if}
   </Popover.Trigger>
   <Popover.Content class="w-auto p-0" align="start">
    <div class="w-full flex flex-row items-center justify-between p-2">
      <Combobox
        {disabled}
        configuration={datesPresetsConfiguration} 
        selectedOption={selectedPreset?.label}
        event={(v) => onPresetsChanged(v.data)} />
      <Button variant="secondary" class="flex flex-row gap-2 items-center"
        onclick={reset}>
        <FilterX size=12/>
        <span>Reset</span>
      </Button>
    </div>
    <RangeCalendar
     bind:value
     onStartValueChange={(v) => {
      startValue = v;
      (startChanged && v) && startChanged(v)
     }}
     numberOfMonths={2}
     onEndValueChange={(v) => {
      (endChanged && v) && endChanged(v)
     }}
    />
   </Popover.Content>
  </Popover.Root>
 </div>