<script lang="ts">
	import { title } from '$lib/stores';
	import Plans from './plans.svelte';
	import type { User } from '$lib/models/user';
	import { page } from '$app/stores';
	import { Plan } from '$lib/enums/plan';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import HeroSection from '$lib/components/hero-section/hero-section.svelte';
	import HowItWorks from '$lib/components/how-it-works/how-it-works.svelte';
	import PlatformBenefits from '$lib/components/platform-benefits/platform-benefits.svelte';

	title.clear();
	const user: User | undefined = $state<User | undefined>($page.data.user);
</script>

<div class="space-y-20">
	<!-- Hero Section -->
	<HeroSection />

	<!-- How It Works Flow -->
	<HowItWorks />

	<Separator />

	<!-- Platform Benefits -->
	<PlatformBenefits />

	<!-- Plans Section (conditional) -->
	{#if !user?.plan || user?.plan === Plan.None}
		<Separator />
		<section>
			<div class="text-center mb-12">
				<h2 class="text-3xl font-bold mb-4">Choose Your Plan</h2>
				<p class="text-lg text-muted-foreground">
					Start discovering influencers today with a plan that fits your business
				</p>
			</div>
			<Plans />
		</section>
	{/if}
</div>
