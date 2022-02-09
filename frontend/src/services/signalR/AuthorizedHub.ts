import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { getAuthToken } from "services/auth/useAuthContextValue";
import type { AllHubs } from "services/backend/client.generated";
import EnvSettings from "types/EnvSettings";

type Wrap = AllHubs;

export class AuthorizedHub<T extends keyof Wrap> {
  private constructor(private connection: HubConnection) {}

  static async startConnection<T extends keyof Wrap>(hub: T): Promise<AuthorizedHub<T>> {
    if (!process.browser) return null;

    const envSettings = await fetch("/api/getEnv").then<EnvSettings>(x => x.json());

    const token = getAuthToken();
    const connection = new HubConnectionBuilder()
      .withUrl(`${envSettings.backendUrl}/hubs/${hub}`, {
        headers: {
          Authorization: "bearer " + token
        },
        withCredentials: false,
        accessTokenFactory: () => "bearer " + token
      })
      .withAutomaticReconnect()
      .build();

    await connection.start();

    return new AuthorizedHub<T>(connection);
  }

  public onEvent<U extends keyof Wrap[T]["events"]>(
    key: U,
    cb: (args: Wrap[T]["events"][U]) => void
  ): void {
    this.connection.on(key.toString(), cb);
  }

  public invoke<M extends keyof Wrap[T]["methods"], N extends Wrap[T]["methods"][M]>(
    key: M,
    ...args: unknown[]
  ): Promise<N> {
    return this.connection.invoke<N>(key as string, ...args);
  }

  public fireAndForget<M extends keyof Wrap[T]["methods"]>(
    key: M,
    ...args: unknown[]
  ): Promise<void> {
    return this.connection.send(key as string, ...args);
  }

  public getConnection(): HubConnection {
    return this.connection;
  }

  public closeConnection(): Promise<void> {
    return this.connection.stop();
  }
}
