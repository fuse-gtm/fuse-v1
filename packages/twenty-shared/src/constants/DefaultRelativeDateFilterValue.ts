import { type RelativeDateFilter } from '@/utils/filter/dates/utils/relativeDateFilterSchema';

export const DEFAULT_RELATIVE_DATE_FILTER_VALUE: RelativeDateFilter = {
  direction: 'THIS',
  unit: 'DAY',
  amount: 1,
};
