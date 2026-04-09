import type { EvaluationContext, Value } from 'expr-eval-fork';
import { isNonEmptyString } from '@sniptt/guards';

import { conditionalAvailabilityParser } from './conditionalAvailabilityParser';

export const evaluateConditionalAvailabilityExpression = (
  expression: string | null | undefined,
  context: EvaluationContext,
): boolean => {
  if (!isNonEmptyString(expression)) {
    return true;
  }

  try {
    const parsed = conditionalAvailabilityParser.parse(expression);

    return parsed.evaluate(context as Value) === true;
  } catch {
    return false;
  }
};
