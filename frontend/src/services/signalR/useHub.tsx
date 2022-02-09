import { useContext } from "react";
import { AllHubs } from "services/backend/client.generated";
import { AuthorizedHub } from "./AuthorizedHub";
import { getHubContext } from "./utils";

type Hook = <T extends keyof AllHubs>(
  key: T
) => {
  hub: AuthorizedHub<T>;
};

export const useHub: Hook = <T extends keyof AllHubs>(key: T) => {
  const hub = useContext<AuthorizedHub<T>>(getHubContext(key));
  return { hub };
};
