import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { CLERK_SECRET_KEY } from '$env/static/private';
import handleClerk from '$lib/server/authentication';

export const handle: Handle = sequence(
	handleClerk(CLERK_SECRET_KEY, {
		// debug: true,
		protectedPaths: [
			'/scans',
			'/api',
			'/settings',
			'/plan',
		],
		signInUrl: '/sign-in',
		authorizedParties: ['http://localhost:5173', 'https://influscan.pages.dev'],
	})
)