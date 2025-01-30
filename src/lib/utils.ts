import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { DateFilter } from "./models/filter";
import type { SortingState } from "@tanstack/table-core";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function parseUrlFilters(filters: string | string[]): DateFilter[] | undefined {
	let filtersToParse = [];
	if (typeof filters === 'string') {
		filtersToParse.push(filters);
	} else {
		filtersToParse = filters;
	}
	if (filtersToParse.length === 0) {return;}
	const results: DateFilter[] = [];
	filtersToParse.forEach((filter) => {
		const parsedFilter = filter.split('|');
		switch (parsedFilter[0]) {
			case 'date':
				results.push({
					type: 'date',
					path: parsedFilter[1],
					start: parsedFilter[2],
					end: parsedFilter[3],
				})
				break;
			default:
				break;
		}
	})
	return results;
}

export function createUrlFilters(filters: DateFilter[]): string {
	let result = '';
	filters.forEach(filter => {
		if (result.length > 0) {
			result = result.concat(',');
		}
		switch (filter.type) {
			case 'date':
				result = result.concat(`${filter.type}|${filter.path}|${filter.start}|${filter.end ?? ''}`);
				break;
			default:
				break;
		}
	})
	return result;
}

export function parseUrlSort(sortState: string | string[]): SortingState | undefined {
	const sortToParse = typeof sortState === 'string' ? [sortState] : sortState;
	if (sortToParse.length=== 0) {return;}
	const state: SortingState = [];
	sortToParse.forEach((sort) => {
		state.push({
			id: sort.slice(1),
			desc: sort.slice(0, 1) === '-'
		})
	});
	return state;
}

export function createUrlSort(sortState: SortingState): string {
	let result = '';
	sortState.forEach(sort => {
		if (result.length > 0) {
			result = result.concat(',');
		}
		result = result.concat(`${sort.desc ? '-' : '+'}${sort.id}`)
	})
	return result;
}