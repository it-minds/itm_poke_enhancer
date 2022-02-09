import { useEffect, useState } from "react";

export const useMemoAsync = <T>(
  cb: () => Promise<T>,
  deps: unknown[],
  initialValue: T = null
): T => {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    let active = true;
    load();
    return () => {
      active = false;
    };

    async function load() {
      const res = await cb();
      if (!active) {
        return;
      }
      setValue(res);
    }
  }, [...deps]);

  return value;
};
