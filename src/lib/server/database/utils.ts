import type { DatabaseFilter, DateFilter } from "$lib/models/filter";

export const getDatabaseFiltersFromClientFilters = (clientFilters: DateFilter[]): DatabaseFilter[] => {
  const filters: DatabaseFilter[] = [];
  clientFilters.forEach(cf => {
    switch (cf.type) {
      case 'date':
        if (cf.start) {
          filters.push({
            column: cf.path,
            operator: 'gte',
            value: cf.start,
          })
        }
        if (cf.end) {
          filters.push({
            column: cf.path,
            operator: 'lte',
            value: cf.end,
          })
        }
        break;
      default:
        break;
    }
  })
  return filters;
}
