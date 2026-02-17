export function setFormValue<T, K extends keyof T>(
  setState: React.Dispatch<React.SetStateAction<T>>,
  key: K,
  value: T[K],
) {
  setState((prev) => ({
    ...prev,
    [key]: value,
  }));
}
