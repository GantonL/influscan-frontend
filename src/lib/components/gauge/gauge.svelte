<script lang="ts">
  let { value }: { value: number } = $props();
  const colorConfiguration: string[] = [
    "text-red-500",
    "text-orange-500",
    "text-yellow-500",
    "text-yellow-400",
    "text-lime-400",
    "text-lime-300",
    "text-green-300",
    "text-green-400",
    "text-green-500",
    "text-green-600", 
  ];
  let color = $state('');
  $effect.pre(() => {
    color = colorConfiguration[Math.ceil((value ?? 0)/10)];
  })
</script>
<div class="relative size-16">
  <svg class="size-full rotate-[135deg]" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
    <!-- Background Circle (Gauge) -->
    <circle cx="18" cy="18" r="16" fill="none" class="stroke-current text-muted" stroke-width="4" stroke-dasharray="75 100" stroke-linecap="round"></circle>

    <!-- Gauge Progress -->
    <circle cx="18" cy="18" r="16" fill="none" class="stroke-current {color}" stroke-width="2" stroke-dasharray="{value * 0.75} 100" stroke-linecap="round"></circle>
  </svg>

  <!-- Value Text -->
  <div class="absolute transform translate-x-1/2 right-1/2 top-2 translate-y-1/2 ">
    <span class="font-bold">{value}%</span>
  </div>
</div>