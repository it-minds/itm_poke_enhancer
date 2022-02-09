import { useEffect, useState } from "react";
import { useEffectAsync } from "./useEffectAsync";

interface OptimisticState<T> {
  readonly status: "pending" | "loading" | "failed" | "succeed";
  readonly value?: T;
  readonly error?: Error;
}

export const useOptimisticValue = <T>(
  func: () => T | Promise<T>,
  predictedValue: T
): OptimisticState<T> => {
  const [optimisticValue, setOptimisticValue] = useState<OptimisticState<T>>({
    status: "pending",
    value: predictedValue
  });

  useEffect(() => {
    setOptimisticValue({
      status: "pending",
      value: predictedValue
    });
  }, [predictedValue]);

  useEffectAsync(async () => {
    setOptimisticValue({
      ...optimisticValue,
      status: "loading"
    });
    try {
      const value = await func();
      setOptimisticValue({
        status: "succeed",
        value
      });
    } catch (error) {
      setOptimisticValue({
        ...optimisticValue,
        status: "failed",
        error
      });
    }
  }, [func, predictedValue]);

  return optimisticValue;
};
