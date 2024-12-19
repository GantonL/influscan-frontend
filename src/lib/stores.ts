import { writable } from 'svelte/store';

function createTitle() {
	const { subscribe, set } = writable('');
	
	return {
		subscribe,
		set: (value: string) => {
			set(`${value} • InfluScan`)
		},
		clear: () => {
			set('InfluScan');
		}
	}
}

export const title = createTitle();