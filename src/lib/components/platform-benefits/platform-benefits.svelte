<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import {
		Zap,
		Target,
		BarChart3,
		Users,
		Clock,
		Shield,
		Sparkles,
		TrendingUp
	} from '@lucide/svelte';

	const benefits = [
		{
			icon: Zap,
			title: 'Lightning Fast',
			description: 'Scan thousands of customers in minutes, not hours'
		},
		{
			icon: Target,
			title: 'Precision Targeting',
			description: 'AI-powered analysis identifies the most influential customers'
		},
		{
			icon: BarChart3,
			title: 'Detailed Analytics',
			description: 'Comprehensive reports with engagement metrics and audience insights'
		},
		{
			icon: Users,
			title: 'Multi-Platform',
			description: 'Scan across Instagram, TikTok, YouTube, and more social platforms'
		},
		{
			icon: Clock,
			title: 'Real-time Updates',
			description: 'Get live updates on follower growth and engagement changes'
		},
		{
			icon: Shield,
			title: 'Privacy First',
			description: 'GDPR compliant with secure data handling and encryption'
		}
	];
</script>

<div class="flex flex-col gap-8 items-center">
	<div class="text-center">
		<div class="flex items-center justify-center gap-2 mb-4">
			<Sparkles size={24} class="text-primary" />
			<h2 class="text-3xl font-bold">Why Choose Influscan?</h2>
		</div>
		<p class="text-lg text-muted-foreground max-w-2xl">
			Built for modern businesses who want to leverage their customer relationships for growth
		</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
		{#each benefits as benefit}
			<Card.Root class="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
				<Card.Header>
					<div class="flex items-center justify-between mb-2">
						<div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
							<benefit.icon size={24} class="text-primary" />
						</div>
					</div>
					<Card.Title class="text-lg">{benefit.title}</Card.Title>
				</Card.Header>
				<Card.Content>
					<p class="text-muted-foreground">{benefit.description}</p>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>

	<div
		class="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6 w-full max-w-4xl text-center"
	>
		<TrendingUp size={32} class="mx-auto mb-4 text-primary" />
		<h3 class="text-xl font-semibold mb-2">Ready to grow your business?</h3>
		<p class="text-muted-foreground">
			Join hundreds of businesses already using Influscan to discover and collaborate with local
			influencers
		</p>
	</div>
</div>
