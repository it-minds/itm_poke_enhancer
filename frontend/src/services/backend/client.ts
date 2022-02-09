/* istanbul ignore file */
import fetch from "isomorphic-unfetch";
import { GetServerSidePropsContext } from "next";
import { getAuthToken } from "services/auth/useAuthContextValue";
import EnvSettings from "types/EnvSettings";

import { ClientBase, ClientConfiguration } from "./client.generated";

export interface NSwagClient<T extends ClientBase> {
  new (
    configuration: ClientConfiguration,
    baseUrl?: string,
    http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }
  ): T;
}

export const client = async <T extends ClientBase, V extends NSwagClient<T>>(
  Client: V,
  context?: GetServerSidePropsContext
): Promise<InstanceType<V>> => {
  const envSettings = await fetch("/api/getEnv").then<EnvSettings>(x => x.json());

  const authToken = getAuthToken(context) ?? "";
  const initializedClient = new Client(new ClientConfiguration(authToken), envSettings.backendUrl, {
    fetch
  }) as InstanceType<V>;

  return initializedClient;
};
