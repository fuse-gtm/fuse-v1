export const PROCESS_PRESSURE_HEALTH_ERROR_MESSAGES = {
  PROCESS_PRESSURE_TIMEOUT: 'Process pressure check timeout',
  PROCESS_PRESSURE_CHECK_FAILED: 'Process pressure check failed',
  RSS_MEMORY_PRESSURE_HIGH: 'RSS memory is above readiness threshold',
  HEAP_RATIO_PRESSURE_HIGH: 'Heap usage ratio is above readiness threshold',
  EVENT_LOOP_LAG_HIGH: 'Event loop lag is above readiness threshold',
} as const;
