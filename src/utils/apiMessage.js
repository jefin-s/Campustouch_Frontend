export const getApiMessage = (payload, fallback = 'Request completed.') => {
  if (!payload) return fallback;

  if (typeof payload === 'string') {
    return payload;
  }

  if (payload instanceof Error && payload.message) {
    return payload.message;
  }

  const source = payload.response?.data ?? payload.data ?? payload;
  if (!source) return fallback;

  if (typeof source === 'string') {
    return source;
  }

  const directKeys = [
    'message',
    'Message',
    'title',
    'Title',
    'detail',
    'Detail',
    'error',
    'Error',
    'statusMessage',
  ];

  for (const key of directKeys) {
    if (typeof source[key] === 'string' && source[key].trim()) {
      return source[key];
    }
  }

  const nestedErrors = source.errors;
  if (Array.isArray(nestedErrors) && nestedErrors.length > 0) {
    return typeof nestedErrors[0] === 'string' ? nestedErrors[0] : fallback;
  }

  if (nestedErrors && typeof nestedErrors === 'object') {
    const firstError = Object.values(nestedErrors).flat().find(Boolean);
    if (typeof firstError === 'string') {
      return firstError;
    }
  }

  if (source.data && source.data !== source) {
    return getApiMessage(source.data, fallback);
  }

  return fallback;
};
