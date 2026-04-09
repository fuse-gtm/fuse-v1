import { isNonEmptyString } from '@sniptt/guards';

import { conditionalAvailabilityParser } from './conditionalAvailabilityParser';

type EvaluationContext = Record<string, unknown>;

export const evaluateConditionalAvailabilityExpression = (
  expression: string | null | undefined,
  context: EvaluationContext,
): boolean => {
  if (!isNonEmptyString(expression)) {
    return true;
  }

  try {
    const parsed = conditionalAvailabilityParser.parse(expression);

    return parsed.evaluate(context) === true;
  } catch {
    return false;
  }
};
