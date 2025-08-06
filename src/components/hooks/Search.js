import { useEffect, useState } from "react";

export function useDebounce(value, delay = 500) {
  const [debouncedVal, setDebouncedVal] = useState();
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedVal(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedVal;
}
