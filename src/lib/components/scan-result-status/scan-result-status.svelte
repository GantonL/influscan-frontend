<script lang="ts">
	import { type ScanStatus } from "$lib/types/scan-status";
	import CircleCheckBig from "@lucide/svelte/icons/circle-check-big";
	import CircelX from "@lucide/svelte/icons/circle-x";
	import CircelDashed from "@lucide/svelte/icons/circle-dashed";
	import ClockAlert from "@lucide/svelte/icons/clock-alert";
  import * as Tooltip from "$lib/components/ui/tooltip";
	import { ListEnd } from "@lucide/svelte";

  let { status }: {status: ScanStatus} = $props();
  interface StatusConfiguration {
    icon: ConstructorOfATypedSvelteComponent;
    class?: string;
    tooltip?: string;
  }

  const configuration: Record<ScanStatus, StatusConfiguration> = {
    'completed': {icon: CircleCheckBig, class: 'text-green-500', tooltip: 'Completed'},
    'failed': {icon: CircelX, class: 'text-destructive', tooltip: 'Failed'},
    'in_progress': {icon: CircelDashed, class: 'text-yellow-500 animate-spin', tooltip: 'In progress'},
    'not_started': {icon: ClockAlert, class: 'text-muted-foreground', tooltip: 'Not started'},
    'queued': {icon: ListEnd, class: 'text-muted-foreground', tooltip: 'Queued'},
  }
</script>
{#snippet selectedStatus(statusConfiguration: StatusConfiguration)}
  <Tooltip.Provider>
    <Tooltip.Root>
      <Tooltip.Trigger>
        <div class={statusConfiguration.class}>
          <statusConfiguration.icon size=20/>
        </div>
      </Tooltip.Trigger>
      <Tooltip.Content>{statusConfiguration.tooltip}</Tooltip.Content>
    </Tooltip.Root>
  </Tooltip.Provider>
{/snippet}
{@render selectedStatus(configuration[status])}
