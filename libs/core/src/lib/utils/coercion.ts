export function coerceBooleanProperty(value: unknown): boolean {
  return value != null && `${value}` !== 'false';
}

/** Coerces a data-bound value (typically a string) to a number. */
export function coerceNumberProperty(value: any): number;
export function coerceNumberProperty(value: any, fallback: any): number;
export function coerceNumberProperty(value: any, fallbackValue = 0): number {
  return isNumberValue(value) ? Number(value) : coerceNumberProperty(fallbackValue);
}

/**
 * Whether the provided value is considered a number.
 */
function isNumberValue(value: any): boolean {
  // parseFloat(value) handles most of the cases we're interested in (it treats null, empty string,
  // and other non-number values as NaN, where Number just uses 0) but it considers the string
  // '123hello' to be a valid number. Therefore we also check if Number(value) is NaN.
  return !isNaN(parseFloat(value as any)) && !isNaN(Number(value));
}
