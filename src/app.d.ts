// See https://kit.svelte.dev/docs/types#app


// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session?: {
				userId?: string;
				claims?: {
					user_id?: string;
					user_name?: string;
				}
			};
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
