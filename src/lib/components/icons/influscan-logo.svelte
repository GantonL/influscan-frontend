<script lang="ts">
  export let size: number = 24;
  export let className: string = "";
  export let animate: boolean = true;
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 32 32"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  class={className}
>
  <defs>
    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ef4444;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Main scanning circle -->
  <circle
    cx="16"
    cy="16"
    r="14"
    stroke="url(#gradient1)"
    stroke-width="2"
    fill="none"
    opacity="0.3"
  />
  
  <!-- Inner scanning circle -->
  <circle
    cx="16"
    cy="16"
    r="10"
    stroke="url(#gradient1)"
    stroke-width="1.5"
    fill="none"
    opacity="0.5"
  />
  
  <!-- Central influence icon -->
  <circle
    cx="16"
    cy="16"
    r="4"
    fill="url(#gradient2)"
  />
  
  <!-- Scanning beam lines -->
  <g opacity="0.8">
    <line
      x1="16"
      y1="2"
      x2="16"
      y2="8"
      stroke="url(#gradient1)"
      stroke-width="2"
      stroke-linecap="round"
    />
    <line
      x1="16"
      y1="24"
      x2="16"
      y2="30"
      stroke="url(#gradient1)"
      stroke-width="2"
      stroke-linecap="round"
    />
    <line
      x1="2"
      y1="16"
      x2="8"
      y2="16"
      stroke="url(#gradient1)"
      stroke-width="2"
      stroke-linecap="round"
    />
    <line
      x1="24"
      y1="16"
      x2="30"
      y2="16"
      stroke="url(#gradient1)"
      stroke-width="2"
      stroke-linecap="round"
    />
  </g>
  
  <!-- Corner scanning dots -->
  <g opacity="0.6">
    <circle cx="6" cy="6" r="1.5" fill="url(#gradient2)" />
    <circle cx="26" cy="6" r="1.5" fill="url(#gradient2)" />
    <circle cx="6" cy="26" r="1.5" fill="url(#gradient2)" />
    <circle cx="26" cy="26" r="1.5" fill="url(#gradient2)" />
  </g>
  
  <!-- Dynamic pulse effect -->
  {#if animate}
    <circle
      cx="16"
      cy="16"
      r="6"
      stroke="url(#gradient2)"
      stroke-width="1"
      fill="none"
      opacity="0.4"
    >
      <animate
        attributeName="r"
        values="6;8;6"
        dur="2s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="opacity"
        values="0.4;0.1;0.4"
        dur="2s"
        repeatCount="indefinite"
      />
    </circle>
  {/if}
</svg>