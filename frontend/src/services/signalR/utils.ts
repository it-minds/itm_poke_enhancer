import { Context, createContext } from "react";
import { AllHubs } from "services/backend/client.generated";
import { AuthorizedHub } from "./AuthorizedHub";

/**
 *? Note: If you do not want each hub type to be required compiletime, simply replace `Required<T>` => `T`
 */
type KeysEnum<T> = { [P in keyof Required<T>]: true };
const allHubs: KeysEnum<AllHubs> = {
  exampleHub: true
};

type ContextMapType<T extends keyof AllHubs = keyof AllHubs> = Record<T, Context<AuthorizedHub<T>>>;

//! Note this object must be available at runtime as the reference must be the same when retrieving a context.
const allHubContexts = Object.freeze(
  Object.keys(allHubs).reduce<ContextMapType>((acc, cur: keyof AllHubs) => {
    acc[cur] = createContext<AuthorizedHub<typeof cur>>(null);
    return acc;
  }, {} as ContextMapType)
);

export const getHubContext = <T extends keyof AllHubs>(key: T): Context<AuthorizedHub<T>> => {
  return (allHubContexts as unknown as ContextMapType<T>)[key];
};
