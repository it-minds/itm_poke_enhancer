import { useEffectAsync } from "hooks/useEffectAsync";
import { Provider, useEffect, useMemo, useRef, useState } from "react";
import { AllHubs } from "services/backend/client.generated";
import { AuthorizedHub } from "./AuthorizedHub";
import { getHubContext } from "./utils";

type Hook = <T extends keyof AllHubs>(
  key: T,
  settings?: Partial<{
    autoCloseOnUnmount: boolean;
  }>
) => {
  hub: AuthorizedHub<T>;
  Provider: Provider<AuthorizedHub<T>>;
  isConnected: boolean;
};

const defaultSettings: Parameters<Hook>[1] = {
  autoCloseOnUnmount: false
};

export const useHubProvider: Hook = <T extends keyof AllHubs>(key: T, settings = {}) => {
  const useableSettings = useRef({ ...defaultSettings, ...settings });

  useEffect(() => {
    useableSettings.current = { ...defaultSettings, ...settings };
  }, [settings]);

  const [hub, setHub] = useState<AuthorizedHub<T>>(null);

  const HubProvider = useMemo(() => getHubContext(key), [key]);

  useEffectAsync(async () => {
    const hub = await AuthorizedHub.startConnection(key);
    setHub(hub);
  }, [key]);

  useEffect(() => {
    if (hub && useableSettings.current.autoCloseOnUnmount) {
      return () => {
        hub.closeConnection();
      };
    }
  }, [hub]);

  const isConnected = useMemo(() => !!hub?.getConnection()?.connectionId, [hub]);

  return {
    hub,
    Provider: HubProvider.Provider,
    isConnected
  };
};
