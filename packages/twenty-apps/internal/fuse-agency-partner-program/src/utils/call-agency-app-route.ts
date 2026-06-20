const getEnv = (key: string): string | undefined => {
  if (typeof process === 'undefined') return undefined;

  return process.env?.[key];
};

type ErrorResponse = {
  messages?: string[];
  message?: string;
  error?: string;
  statusCode?: number;
};

const extractErrorMessage = (text: string, status: number): string => {
  try {
    const json = JSON.parse(text) as ErrorResponse;

    if (json.messages?.length) return json.messages[0];

    return json.message ?? json.error ?? `Server error (${status})`;
  } catch {
    return text || `Server error (${status})`;
  }
};

export const callAgencyAppRoute = async (
  path: string,
  body: Record<string, unknown>,
): Promise<unknown> => {
  const apiUrl = getEnv('TWENTY_API_URL') ?? '';
  const token = getEnv('TWENTY_APP_ACCESS_TOKEN');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${apiUrl}/s${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();

    throw new Error(extractErrorMessage(text, response.status));
  }

  return response.json();
};
