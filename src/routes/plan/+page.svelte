<script lang="ts">
	import { page } from "$app/stores";
	import { title } from "$lib/stores";
  import { type PlanDisplayConfigration } from "$lib/models/plan";
	import * as Card from "$lib/components/ui/card";
	import type { User } from "$lib/models/user";
	import { Plan } from "$lib/enums/plan";
	import { Check, LoaderCircle, X } from "@lucide/svelte";
	import { PlansDisplayConfiguartion } from "$lib/configurations/plans";
	import Button from "$lib/components/ui/button/button.svelte";
	import * as AlertDialog from "$lib/components/ui/alert-dialog";
	import { toast } from "svelte-sonner";
	import { goto } from "$app/navigation";
  title.set('Plan');

  const user: User | undefined = $state<User | undefined>($page.data.user);
  const plan: PlanDisplayConfigration = PlansDisplayConfiguartion[user?.plan ?? Plan.None];
  let upgradeDialogOpenedState = $state(false);
  let downgradeDialogOpenedState = $state(false);
  let revokeDialogOpenedState = $state(false);
  let updatePlanInProgress = $state(false);

  function onPlanAction(event: string) {
    switch (event) {
      case 'upgrade':
        upgradeDialogOpenedState = true;
        break;
      case 'downgrade':
        downgradeDialogOpenedState = true;
        break;
      case 'revoke':
        revokeDialogOpenedState = true;
        break;
    }
  }

  function onRevokePlan() {
    updatePlanInProgress = true;
    const body = new FormData();
    body.append('plan', Plan.None);
    const onError = () => {
      updatePlanInProgress = false;
      revokeDialogOpenedState = false;
      toast.error('Failed to update user plan');
    }
    fetch('/plan', {method: 'PUT', body})
      .then(res => {
        res.json().then(res => {
          if (res) {
            goto('/').finally(() => {
              location.reload();
            })
          } else {
            onError();
          }
        })
        .catch(onError);
      })
      .catch(onError);
  }

</script>
<Card.Root class="{plan.class} w-full">
  <Card.Header class="flex flex-col">
    <Card.Title class="flex flex-row gap-2 items-center">You are on the <span class="group bg-primary text-primary-foreground rounded-md p-2 flex flex-row gap-2"><plan.icon size=24 class={plan.iconClass}/> <span>{plan.name}</span></span> plan</Card.Title>
    <Card.Description>{plan.description}</Card.Description>
  </Card.Header>
  <Card.Content class="flex flex-col gap-4">
    <div class="flex flex-col">
      <h3 class="text-xl text-bold">You are paying </h3><p class="text-3xl text-bold">&dollar;{plan.price}<span class="text-muted-foreground text-sm">/month</span></p>
    </div>
    <div class="flex flex-col">
      <h3 class="text-xl text-bold">Your features:</h3>
      <ul class="flex flex-col gap-4 items-start p-2 w-full">
        {#each plan.features as feature}
        <li class="flex flex-row gap-2 items-center"><Check size=12/>{feature}</li>
        {/each}
        {#each (plan.excludedFeatures ?? []) as exfeature}
        <li class="flex flex-row gap-2 items-center text-muted-foreground"><X size=12/>{exfeature}</li>
        {/each}
      </ul>
    </div>
  </Card.Content>
  <Card.Footer class="flex flex-row flex-wrap gap-2 items-center">
    {#each plan.actions ?? [] as action}
    <Button class="flex flex-row gap-2 items-center" 
      variant={action.variant} 
      onclick={() => onPlanAction(action.event)}
      disabled={updatePlanInProgress}>
      <action.icon size=12/>
      <span>{action.title}</span>
    </Button>
    {/each}
  </Card.Footer>
</Card.Root>

<AlertDialog.Root bind:open={revokeDialogOpenedState}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you sure you want to revoke your user plan?</AlertDialog.Title>
			<AlertDialog.Description>
				You will no longer be able to execute new scans.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel disabled={updatePlanInProgress}>CANCEL</AlertDialog.Cancel>
			<AlertDialog.Action 
        onclick={onRevokePlan}
        disabled={updatePlanInProgress}>
        <div class="flex flex-row gap-2 items-center">
          {#if updatePlanInProgress}
          <LoaderCircle class="animate-spin" size=14/>
          {/if}
          <span>Confirm</span>
        </div>
      </AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>