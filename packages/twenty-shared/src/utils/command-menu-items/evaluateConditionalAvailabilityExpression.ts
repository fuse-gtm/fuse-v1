import { isNonEmptyString } from '@sniptt/guards';

import { conditionalAvailabilityParser } from './conditionalAvailabilityParser';

export const evaluateConditionalAvailabilityExpression = (
  expression: string | null | undefined,
  context: Record<string, unknown>,
): boolean => {
  if (!isNonEmptyString(expression)) {
    return true;
  }

  try {
    const parsed = conditionalAvailabilityParser.parse(expression);

    return parsed.evaluate(context as never) === true;
  } catch {
    return false;
  }
};
