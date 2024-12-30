<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
  import * as Card from "$lib/components/ui/card";
	import { Check } from "lucide-svelte";


</script>
<div class="flex flex-row flex-wrap items-start justify-center gap-4">
  
  <Card.Root>
    <Card.Header class="flex flex-col items-center">
      <Card.Title>Lite</Card.Title>
    </Card.Header>
    <Card.Content class="flex flex-col items-center">
      <h3 class="text-xl text-bold">&dollar;5<span class="text-muted-foreground text-sm">/month</span></h3>
      <ul class="flex flex-col gap-4 items-start p-2 w-full">
        <li class="flex flex-row gap-2 items-center"><Check size=12/>Up to 250 scans per month</li>
        <li class="flex flex-row gap-2 items-center"><Check size=12/>Maximum 20 scans per day</li>
        <li class="flex flex-row gap-2 items-center"><Check size=12/>CSV upload</li>
        <li class="flex flex-row gap-2 items-center"><Check size=12/>Strict CSV parser</li>
      </ul>
    </Card.Content>
    <Card.Footer>
      <Button class="w-full">Sounds good</Button>
    </Card.Footer>
  </Card.Root>
  <Card.Root class="border-2 border-primary">
    <Card.Header class="flex flex-col items-center">
      <Card.Title>Pro</Card.Title>
    </Card.Header>
    <Card.Content class="flex flex-col items-center">
      <h3 class="text-xl text-bold">&dollar;10<span class="text-muted-foreground text-sm">/month</span></h3>
      <ul class="flex flex-col gap-4 items-start p-2 w-full">
        <li class="flex flex-row gap-2 items-center"><Check size=12/>Up to 1000 scans per month</li>
        <li class="flex flex-row gap-2 items-center"><Check size=12/>Maximum 100 scans per day</li>
        <li class="flex flex-row gap-2 items-center"><Check size=12/>CSV upload</li>
        <li class="flex flex-row gap-2 items-center"><Check size=12/>Dynamic CSV parser</li>
        <li class="flex flex-row gap-2 items-center"><Check size=12/>API key</li>
      </ul>
    </Card.Content>
    <Card.Footer>
      <Button class="w-full">Oh yeah!</Button>
    </Card.Footer>
  </Card.Root>
  <Card.Root>
    <Card.Header class="flex flex-col items-center">
      <Card.Title>Bro</Card.Title>
    </Card.Header>
    <Card.Content class="flex flex-col items-center">
      <h3 class="text-xl text-bold">&dollar;50<span class="text-muted-foreground text-sm">/month</span></h3>
      <ul class="flex flex-col gap-4 items-start p-2 w-full">
        <li class="flex flex-row gap-2 items-center"><Check size=12/>Up to 10000 scans per month</li>
        <li class="flex flex-row gap-2 items-center"><Check size=12/>Maximum 1000 scans per day</li>
        <li class="flex flex-row gap-2 items-center"><Check size=12/>CSV upload</li>
        <li class="flex flex-row gap-2 items-center"><Check size=12/>Dynamic CSV parser</li>
        <li class="flex flex-row gap-2 items-center"><Check size=12/>API key</li>
      </ul>
    </Card.Content>
    <Card.Footer>
      <Button class="w-full">Damnnn</Button>
    </Card.Footer>
  </Card.Root>
</div>