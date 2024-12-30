<script lang="ts">
	import Avatar from "$lib/components/avatar/avatar.svelte";
	import { avataaars, openPeeps, personas } from "@dicebear/collection";
	import type { Style } from "@dicebear/core";
  const avatars: {id: string, collection: Style<any>, class?: string}[] = [
    {
      id: crypto.randomUUID(),
      collection: personas,
    },
    {
      id: crypto.randomUUID(),
      collection: avataaars,
    },
    {
      id: crypto.randomUUID(),
      collection: openPeeps,
    },
    {
      id: crypto.randomUUID(),
      collection: personas,
    },
    {
      id: crypto.randomUUID(),
      collection: avataaars,
    },
    {
      id: crypto.randomUUID(),
      collection: openPeeps,
    },
    {
      id: crypto.randomUUID(),
      collection: personas,
    },
    {
      id: crypto.randomUUID(),
      collection: avataaars,
    },
    {
      id: crypto.randomUUID(),
      collection: openPeeps,
    },
    {
      id: crypto.randomUUID(),
      collection: personas,
    }
  ];
  $effect(() => {
    const container: HTMLDivElement | null = document.querySelector('.funny-container');
    if (!container) { return; }
    for (let i = 0; i < avatars.length; i++) {
      const item = document.getElementById(avatars[i].id);
      if (!item) { continue; }
  
      const x = Math.random() * (container.offsetWidth - 40);
      const y = Math.random() * (container.offsetHeight - 40);
  
      item.style.transform = `translate(${x}px, ${y}px)`;
    }
  })

</script>

<div class="funny-container relative w-64 h-64">
  {#each avatars as avatar}
  <div
    id={avatar.id} 
    class="absolute rounded-full p-1 h-16 w-16">
    <Avatar 
      collection={avatar.collection}
      styleClass={`h-full w-full`}/>
  </div>
  {/each}
</div>