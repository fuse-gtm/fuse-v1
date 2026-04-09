import { isNonEmptyString } from '@sniptt/guards';

import { conditionalAvailabilityParser } from './conditionalAvailabilityParser';

type EvaluationContext = Record<string, unknown>;
type ExpressionValue =
  | number
  | string
  | boolean
  | null
  | undefined
  | ExpressionValue[]
  | ((...args: ExpressionValue[]) => ExpressionValue)
  | { [propertyName: string]: ExpressionValue };

type ParserEvaluationContext = Record<string, ExpressionValue>;

export const evaluateConditionalAvailabilityExpression = (
  expression: string | null | undefined,
  context: EvaluationContext,
): boolean => {
  if (!isNonEmptyString(expression)) {
    return true;
  }

  try {
    const parsed = conditionalAvailabilityParser.parse(expression);

    return parsed.evaluate(context as ParserEvaluationContext) === true;
  } catch {
    return false;
  }
};
