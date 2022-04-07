export function coerceBooleanProperty(value: unknown): boolean {
    return value != null && `${value}` !== 'false';
}
