import { isNonEmptyString } from '@sniptt/guards';

import { conditionalAvailabilityParser } from './conditionalAvailabilityParser';

type EvaluationContext = Record<string, unknown>;
type ParserEvaluationContext = NonNullable<
  Parameters<ReturnType<typeof conditionalAvailabilityParser.parse>['evaluate']>[0]
>;

export const evaluateConditionalAvailabilityExpression = (
  expression: string | null | undefined,
  context: EvaluationContext,
): boolean => {
  if (!isNonEmptyString(expression)) {
    return true;
  }

  try {
    const parsed = conditionalAvailabilityParser.parse(expression);

    return (
      parsed.evaluate(context as unknown as ParserEvaluationContext) === true
    );
  } catch {
    return false;
  }
};
