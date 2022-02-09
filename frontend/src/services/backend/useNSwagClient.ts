import { useCallback, useEffect, useRef } from "react";
import { useAuth } from "services/auth/useAuth";
import { client, NSwagClient } from "services/backend/client";
import { ClientBase } from "services/backend/client.generated";
import IsomorphicAbortController from "utils/isomorphicAbortController";

interface NSwagClientType<T> {
  genClient: () => Promise<T>;
  abortController: AbortController;
  refreshAbortSignal: () => void;
}

const genNSwagClient = async <T extends ClientBase, V extends NSwagClient<T> = NSwagClient<T>>(
  clientType: V,
  checkAuth: () => Promise<void>,
  abortController = new IsomorphicAbortController()
) => {
  const initializedClient = await client(clientType);

  initializedClient.setStatusCallbackMap({
    401: async res => {
      console.info("nswag 401 - checking auth");
      await checkAuth();
      return res.json();
    }
  });
  initializedClient.setAbortSignal(abortController.signal);

  return initializedClient;
};

export const useNSwagClient = <T extends ClientBase, V extends NSwagClient<T> = NSwagClient<T>>(
  client: V,
  useAbortOnUnmount = false
): NSwagClientType<InstanceType<V>> => {
  const { checkAuth } = useAuth();
  const abortController = useRef(new IsomorphicAbortController());

  const genClient = useCallback(
    () => genNSwagClient(client, checkAuth, abortController.current),
    []
  );

  const refreshAbortSignal = useCallback(() => {
    abortController.current = new IsomorphicAbortController();
  }, []);

  useEffect(() => {
    if (useAbortOnUnmount) {
      abortController.current.signal.addEventListener("abort", () => {
        console.log("aborted on unmount!");
      });

      return () => {
        abortController.current.abort();
      };
    }
  }, [useAbortOnUnmount]);

  return {
    genClient,
    abortController: abortController.current,
    refreshAbortSignal
  };
};
