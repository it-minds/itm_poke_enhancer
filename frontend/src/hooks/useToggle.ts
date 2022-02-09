import { useCallback, useMemo, useState } from "react";

export const useToggle = <T>(values: [T, T], initialValue?: T): [T, () => void] => {
  if (initialValue && values.indexOf(initialValue) == -1)
    throw Error("Value has to be part of the array.");

  const [state, setState] = useState<T>(initialValue ?? values[0]);

  const index = useMemo(() => values.indexOf(state), [state, values]);

  const toggle = useCallback(() => setState(values[index === 0 ? 1 : 0]), [index, values]);

  return [state, toggle];
};
