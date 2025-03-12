import { useEffect, useRef } from "react";
import { UseMutationResult } from "react-query";

export const useDebouncedMutation = (mutation: UseMutationResult<any, unknown, object, unknown>, delay = 1500) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedMutate = (variables) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      mutation.mutate(variables);
    }, delay);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return debouncedMutate;
};
