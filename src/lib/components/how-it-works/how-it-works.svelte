<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Upload, Radar, TrendingUp, ArrowRight } from '@lucide/svelte';

	const steps = [
		{
			icon: Upload,
			title: 'Upload Customer Data',
			description: 'Import your customer list via CSV or connect your existing platforms',
			details: 'Support for CSV uploads, Shopify integration, and API connections'
		},
		{
			icon: Radar,
			title: 'AI-Powered Scanning',
			description: 'Our AI analyzes social media presence and influence metrics',
			details:
				'Scans Instagram, TikTok, YouTube and other platforms for follower count and engagement'
		},
		{
			icon: TrendingUp,
			title: 'Get Influencer Insights',
			description: 'Receive detailed reports on potential influencer collaborations',
			details: 'Influence scores, contact information, and collaboration recommendations'
		}
	];
</script>

<div class="flex flex-col gap-8 items-center">
	<div class="text-center">
		<h2 class="text-3xl font-bold mb-4">How Influscan Works</h2>
		<p class="text-lg text-muted-foreground max-w-2xl">
			Transform your customer base into a powerful influencer network in three simple steps
		</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl relative">
		{#each steps as step, i}
			<Card.Root class="relative group hover:shadow-lg transition-shadow">
				<Card.Header class="text-center">
					<div
						class="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4"
					>
						<step.icon size={32} class="text-primary" />
					</div>
					<Card.Title class="text-xl">{step.title}</Card.Title>
				</Card.Header>
				<Card.Content class="text-center">
					<p class="text-muted-foreground mb-3">{step.description}</p>
					<p class="text-sm text-muted-foreground/80">{step.details}</p>
				</Card.Content>

				<!-- Arrow connector (except for last item) -->
				{#if i < steps.length - 1}
					<div class="hidden md:block absolute top-1/2 -right-8 transform -translate-y-1/2">
						<ArrowRight size={24} class="text-muted-foreground" />
					</div>
				{/if}
			</Card.Root>
		{/each}
	</div>
</div>
