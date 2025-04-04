import type { Handle, RequestEvent } from '@sveltejs/kit';
import { verifyToken, createClerkClient } from '@clerk/backend';
import type { User } from '$lib/models/user';
import { getUser } from './database/users';
import type { Plan } from '$lib/enums/plan';

type ClerkErrorWithReason = {
	reason?: string
	[key: string]: unknown
}

type ProtectedPath =
	| string
	| ((event: RequestEvent<Partial<Record<string, string>>, string | null>) => boolean)

export default function handleClerk(
	secretKey: string,
	{
		debug = false,
		protectedPaths = [],
		signInUrl = '/sign-in',
    authorizedParties = [],
	}: {
		debug?: boolean;
		protectedPaths?: ProtectedPath[];
		signInUrl?: string;
    authorizedParties?: string[];
		jwtKey?: string
	}
) {
	return (async ({ event, resolve }) => {
		const sessionToken = event.cookies.get('__session')

    if (debug) {
      console.log('[Clerk SvelteKit] ' + event.url.pathname);
    }

		if (sessionToken) {
      if (debug) {
        console.log('[Clerk SvelteKit] Found session token in cookies.');
      }
			try {
				const session = await verifySession(sessionToken, {secretKey, authorizedParties});
				if (session) {
          if (debug) {
            console.log('[Clerk SvelteKit] Session verified successfully.');
          }
					event.locals.session = session;
					await handleUserMetadata(event.locals.session, {secretKey})
				} else {
          if (debug) {
            console.warn('[Clerk SvelteKit] Session verification returned no session.');
          }
				}
			} catch (error) {
				if (debug) {
					console.log(
						'[Clerk SvelteKit] Session verification failed.',
						(error as ClerkErrorWithReason)?.reason ?? error
					);
        }
			}
		} else {
      if (debug) {
        console.log('[Clerk SvelteKit] No session token found in cookies.');
      }
		}

		// Protect the protected routes.
		if (
			!event.locals.session &&
			protectedPaths.find((path) =>
				typeof path === 'string' ? event.url.pathname.startsWith(path) : path(event)
			)
		) {
      if (debug) {
        console.log('[Clerk SvelteKit] No session found, redirecting to login screen.')
      }
			const fullSignInUrl = new URL(signInUrl, event.url.origin)
			return Response.redirect(fullSignInUrl.toString() + '?redirectUrl=' + event.url.pathname)
		}

		return resolve(event)
	}) satisfies Handle
}

const verifySession = async (sessionToken: string, {secretKey, jwtKey, authorizedParties = []}: {secretKey: string; jwtKey?: string; authorizedParties?: string[]}): Promise<User | undefined> => {
	if (sessionToken) {
		const claims = await verifyToken(sessionToken, {
			secretKey,
			authorizedParties,
			jwtKey,
		});
		if (!claims.user_id) { return; }
		return {
			id: claims.user_id as string,
			name: claims.user_name as string,
			plan: claims.plan as Plan,
		}
	}
	return;
}

const handleUserMetadata = async (session: User, options: {secretKey: string; jwtKey?: string}) => {
	if (!session.id || session.plan) { return; }
	const client = createClerkClient({
		secretKey: options.secretKey,
		jwtKey: options.jwtKey,
	});
	const dbUser = await getUser(session.id);
	if (!dbUser) { return; }
	await client.users.updateUserMetadata(session.id, 
	{
		publicMetadata: {
			plan: dbUser.plan
		}
	});
	session.plan = dbUser.plan;
}  