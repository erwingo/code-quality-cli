export function errorIncludes(err: any, message: string) {
  if (!(err instanceof Error)) { return false; }
  return err.message.includes(message);
}
