const AI_TELEMETRY_ENABLED = process.env.AI_TELEMETRY_ENABLED === 'true';

export const AI_TELEMETRY_CONFIG = {
  isEnabled: AI_TELEMETRY_ENABLED,
  recordInputs: AI_TELEMETRY_ENABLED,
  recordOutputs: AI_TELEMETRY_ENABLED,
};
