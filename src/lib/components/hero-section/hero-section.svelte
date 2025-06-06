<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import SignedIn from 'clerk-sveltekit/client/SignedIn.svelte';
	import SignedOut from 'clerk-sveltekit/client/SignedOut.svelte';
	import { LogIn, Zap, Play, Users, TrendingUp, Radar } from '@lucide/svelte';

	const stats = [
		{ value: '10K+', label: 'Scans Completed' },
		{ value: '500+', label: 'Businesses Served' },
		{ value: '50K+', label: 'Influencers Discovered' }
	];
</script>

<div class="flex flex-col lg:flex-row items-center gap-12 min-h-[60vh]">
	<!-- Left side - Hero content -->
	<div class="flex-1 space-y-8">
		<div class="space-y-4">
			<Badge variant="secondary" class="w-fit">
				<Users size={14} class="me-1" />
				Discover Hidden Influencers
			</Badge>

			<h1 class="text-4xl lg:text-6xl font-bold leading-tight">
				Turn Your Customers Into Influencers
			</h1>

			<p class="text-xl text-muted-foreground leading-relaxed max-w-2xl">
				Discover which of your customers are social media influencers and grow your business through
				authentic local partnerships. Our AI scans your customer base to identify untapped
				influencer opportunities.
			</p>
		</div>

		<!-- CTA Buttons -->
		<div class="flex flex-col items-center sm:flex-row gap-4">
			<SignedIn>
				<Button size="lg" class="text-lg px-8">
					<a href="/scans" class="flex items-center gap-2">
						<Zap size={20} />
						Start Scanning
					</a>
				</Button>
			</SignedIn>
			<SignedOut>
				<Button size="lg" class="text-lg px-8">
					<a href="/sign-in" class="flex items-center gap-2">
						<LogIn size={20} />
						Get Started
					</a>
				</Button>
			</SignedOut>

			<Button variant="outline" size="lg" class="text-lg px-8">
				<Play size={16} class="mr-2" />
				Watch Demo
			</Button>
		</div>

		<!-- Stats -->
		<div class="grid grid-cols-3 gap-6 pt-8 border-t">
			{#each stats as stat}
				<div class="text-center">
					<div class="text-2xl lg:text-3xl font-bold text-primary">{stat.value}</div>
					<div class="text-sm text-muted-foreground">{stat.label}</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Right side - Visual element -->
	<div class="flex-1 flex justify-center">
		<div class="relative">
			<!-- Main circle -->
			<div
				class="w-80 h-80 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative"
			>
				<!-- Center icon -->
				<div class="w-24 h-24 rounded-full bg-primary flex items-center justify-center">
					<TrendingUp size={48} class="text-primary-foreground" />
				</div>

				<!-- Floating elements -->
				<div
					class="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-primary shadow-lg flex items-center justify-center animate-bounce"
				>
					<Users size={24} class="text-primary-foreground" />
				</div>

				<div
					class="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-primary shadow-lg flex items-center justify-center animate-pulse"
				>
					<Zap size={28} class="text-primary-foreground" />
				</div>

				<div
					class="absolute top-1/4 -left-8 w-12 h-12 rounded-full bg-primary shadow-lg flex items-center justify-center animate-bounce"
					style="animation-delay: 0.5s"
				>
					<Radar size={20} class="text-primary-foreground" />
				</div>
			</div>

			<!-- Background decoration -->
			<div class="absolute inset-0 -z-10">
				<div
					class="w-96 h-96 rounded-full bg-gradient-to-r from-primary/5 to-secondary/5 blur-3xl"
				></div>
			</div>
		</div>
	</div>
</div>
