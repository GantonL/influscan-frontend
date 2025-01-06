<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
  import * as Card from "$lib/components/ui/card";
	import { Check, Heart, Spade, Sparkle, X } from "lucide-svelte";


</script>
<div class="flex flex-row flex-wrap items-start justify-center gap-4">
  
  <Card.Root class="group">
    <Card.Header class="flex flex-col items-center">
      <Card.Title class="flex flex-row gap-2 items-center"><Heart size=24 class="group-hover:animate-ping"/> Lite</Card.Title>
      <Card.Description>For individuals</Card.Description>
    </Card.Header>
    <Card.Content class="flex flex-col items-center">
      <h3 class="text-3xl text-bold">&dollar;5<span class="text-muted-foreground text-sm">/month</span></h3>
      <ul class="flex flex-col gap-4 items-start p-2 w-full">
        <li class="flex flex-row gap-2 items-center"><Check size=12/>Up to 250 scans per month</li>
        <li class="flex flex-row gap-2 items-center"><Check size=12/>CSV upload</li>
        <li class="flex flex-row gap-2 items-center"><Check size=12/>Strict CSV parser</li>
        <li class="flex flex-row gap-2 items-center text-muted-foreground"><X size=12/>API key</li>
        <li class="flex flex-row gap-2 items-center text-muted-foreground"><X size=12/>Integrations</li>
      </ul>
    </Card.Content>
    <Card.Footer>
      <Button class="w-full">Let's go!</Button>
    </Card.Footer>
  </Card.Root>
  <Card.Root class="group border-2 border-primary">
    <Card.Header class="flex flex-col items-center">
      <Card.Title class="flex flex-row gap-2 items-center"><Spade size=24 class="group-hover:animate-bounce"/> Plus</Card.Title>
      <Card.Description>For small businesses</Card.Description>
    </Card.Header>
    <Card.Content class="flex flex-col items-center">
      <h3 class="text-3xl text-bold">&dollar;25<span class="text-muted-foreground text-sm">/month</span></h3>
      <ul class="flex flex-col gap-4 items-start p-2 w-full">
        <li class="flex flex-row gap-2 items-center"><Check size=12/>Up to 1000 scans per month</li>
        <li class="flex flex-row gap-2 items-center"><Check size=12/>CSV upload</li>
        <li class="flex flex-row gap-2 items-center"><Check size=12/>Dynamic CSV parser</li>
        <li class="flex flex-row gap-2 items-center"><Check size=12/>API key</li>
        <li class="flex flex-row gap-2 items-center"><Check size=12/>Integrations</li>
      </ul>
    </Card.Content>
    <Card.Footer>
      <Button class="w-full">Let's go!</Button>
    </Card.Footer>
  </Card.Root>
  <Card.Root class="group">
    <Card.Header class="flex flex-col items-center">
      <Card.Title class="flex flex-row gap-2 items-center"><Sparkle size=24 class="group-hover:animate-spin"/> Pro</Card.Title>
      <Card.Description>For large companies</Card.Description>
    </Card.Header>
    <Card.Content class="flex flex-col items-center">
      <h3 class="text-3xl text-bold">&dollar;250<span class="text-muted-foreground text-sm">/month</span></h3>
      <ul class="flex flex-col gap-4 items-start p-2 w-full">
        <li class="flex flex-row gap-2 items-center"><Check size=12/>Up to 10000 scans per month</li>
        <li class="flex flex-row gap-2 items-center"><Check size=12/>CSV upload</li>
        <li class="flex flex-row gap-2 items-center"><Check size=12/>Dynamic CSV parser</li>
        <li class="flex flex-row gap-2 items-center"><Check size=12/>API key</li>
        <li class="flex flex-row gap-2 items-center"><Check size=12/>Integrations</li>
      </ul>
    </Card.Content>
    <Card.Footer>
      <Button class="w-full">Let's go!</Button>
    </Card.Footer>
  </Card.Root>
</div>