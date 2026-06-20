import { type JSONContent } from 'twenty-emails';

const isJSONContent = (value: unknown): value is JSONContent => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    typeof value.type === 'string'
  );
};

export const parseEmailBody = (body: string): JSONContent | string => {
  try {
    const parsedBody: unknown = JSON.parse(body);

    return isJSONContent(parsedBody) || typeof parsedBody === 'string'
      ? parsedBody
      : body;
  } catch {
    return body;
  }
};
