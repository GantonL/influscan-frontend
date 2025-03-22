<script>
	import *  as Card from "$lib/components/ui/card";
	import { AppFeatures } from "$lib/configurations/app-features";

</script>
<div class="flex flex-col gap-4 items-center ">
  <h2 class="text-2xl">Features</h2>
  <div class="grid gap-4 grid-cols-[repeat(auto-fit,_minmax(250px,_1fr));]">
    {#each AppFeatures as feature}
    <Card.Root>
      <a href={feature.link}>
        <Card.Header>
          <div class="flex flex-row items-center gap-2">
            <div class="p-2 border rounded-full bg-secondary shadow-md">
              <feature.icon size=20/>
            </div>
            <h3 class="font-semibold text-lg">{feature.title}</h3>
          </div>
        </Card.Header>
        <Card.Content>{feature.description}</Card.Content>
      </a>
    </Card.Root>
    {/each}
  </div>
</div>