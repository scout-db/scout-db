export const isEnumValue =
  <T extends Record<string, unknown>>(e: T) =>
  (token: unknown): token is T[keyof T] => {
    return Object.values(e).includes(token as T[keyof T]);
  };
