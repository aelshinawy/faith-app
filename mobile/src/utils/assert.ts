export function assert(
  condition: boolean,
  message?: string
): asserts condition {
  if (!condition) {
    console.error(message ?? "assert statement failed");
  }
}

export function assertDefined<T>(
  value: T,
  name?: string,
  location?: string
): asserts value is NonNullable<T> {
  if (value === undefined || value === null) {
    console.error(`assertDefined statement failed 
    name: ${name}, location: ${location} `);
  }
}
