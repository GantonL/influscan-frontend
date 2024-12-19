<script lang="ts">
	import { title } from '$lib/stores';
	import SignIn from 'clerk-sveltekit/client/SignIn.svelte';
	title.set('Sign-in')
</script>

<div>
	<SignIn redirectUrl="/sign-in/success" />
</div>