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
  
  let {useIsMobile, start, end, disabled, startChanged, endChanged}: {
    useIsMobile?: boolean,
    start?: Date; 
    end?: Date;
    disabled?: boolean;
    startChanged?: (value: DateValue) => void, 
    endChanged?: (value: DateValue) => void
  } = $props();

  const df = new DateFormatter("en-US", {
   dateStyle: "medium"
  });
  const now = new Date();
  const calendarNow = new CalendarDate(now.getFullYear(), (now.getMonth() + 1), now.getDate());
  let value: DateRange = $state({
   start: start ? new CalendarDate(start.getFullYear(), start.getMonth() + 1, start.getDate()) : calendarNow.subtract({days: 7}),
   end: end ? new CalendarDate(end.getFullYear(), end.getMonth() + 1, end.getDate()) : (start ? undefined : calendarNow),
  });
  
  let startValue: DateValue | undefined = $state(undefined);
  const sidebar = useSidebar();
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