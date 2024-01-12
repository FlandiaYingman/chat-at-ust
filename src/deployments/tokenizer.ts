import { Deployment } from "@/deployments/index.ts";
import { useEffect, useMemo, useState } from "react";

export function useTokenizer(deployment: Deployment, text: string) {
  const [tokens, setTokens] = useState<number>(0);
  const tokenizer = useMemo(
    () => new Worker(new URL("./tokenizer.worker.ts", import.meta.url), { type: "module" }),
    [],
  );
  useEffect(() => {
    tokenizer.onmessage = (e: MessageEvent<number>) => {
      setTokens(e.data);
    };
  });
  useEffect(() => {
    tokenizer.postMessage({
      model: deployment.deployment,
      text: text,
    });
  }, [deployment, text]);
  return {
    tokens,
    price: (tokens * deployment.price) / 1000.0,
  };
}
