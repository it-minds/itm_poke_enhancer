# Changelog

## [2](https://github.com/IT-Minds/inhouse_cph/pull/151)

### SignalR changes

- Completely replaced the use of `Hub` to `Hub<T>`.
  Instead of services for each providing the hub, now the service functions as the generic extension base for a strongly typed version of `Hub`. The services must now be used when declaring the hub and when using the hubs through `IHubContext`.

Declaring the hubs:

```csharp
public class SomeHub : Hub<ISomeHubService> {}
```

Using the hubs:

```csharp
private readonly IHubContext<SomeHub, ISomeHubService> someHubContext;
```

- A standard hub with authorization has been added for easy setup. Note, each template usage might require a minor change of identifying claims. See [this document](/backend/Web/Auth/AuthorizationForSignalR.md) for details on how to enable authorized hubs.
- Created a reflection class for build a Type of all stringly typed hubs, meant for NSwag usage.
- To allow for testing a mock generator of hub contexts has been added.
- For ease of use on the client side, two hooks that provide strongly typed hub connections has been added:
  - `useHubProvider` creates a connection and a React context and `useHubConsumer` allows for reusing provided hub connection.
- Added usage and test documentation with further details of implementation [here](/docs/SignalR.md).

### Misc backend changes

- Added options of declaring C# files as unused in the project with a simple naming convention of `*.example.cs`.

### Misc frontend changes

- Added `typecheck` script for type checking that runs much quicker than `build`. Meant for CI or local code validity check.

## [1](https://github.com/IT-Minds/inhouse_cph/pull/139)

### NSwag changes

- For better understanding, `AuthBase` has been renamed to `ClientConfiguration` as the parameter is meant to allow for initial configurations that affect any client.
- For better readability, all methods in the ClientBase class have been marked public/protected/private.
- Added the option to allow for custom handling of status code per request. After having initialized a client the method `setStatusCallbackMap` is available. It can be used like this:

```typescript
initializedClient.setStatusCallbackMap({
  401: async (res) => {
    console.info("nswag 401 - checking auth");
    await checkAuth();
    return res.json();
  },
});
```

- A new hook has been added to replace the old `apiClient.ts`. `useNSwagClient` can create a typed client generator as needed inside components. It allows for a general 401 handler as well as setting up the authorization. It can be used like this

```typescript
const { genClient } = useNSwagClient(ExampleChildClient);

const fetchData = useCallback(async () => {
  const exampleClient = await genClient();
  const data = await exampleClient.getAllChildren();
  return data;
}, []);
```

- Option to abort each fetch request added through the `useNSwagClient` hook.
  You can use the automatic abort on unmount or manually do it.

```typescript
const { genClient } = useNSwagClient(ExampleChildClient, true);
```

```typescript
const { genClient, abortController } = useNSwagClient(ExampleChildClient);

const abortFetch = useCallback(() => {
  abortController.signal.addEventListener("abort", () => {
    console.log("manually aborted!");
  });

  abortController.abort();
}, []);
```

### Misc frontend changes

- Updated dependencies.
- Added a `checkAuth` method in the auth context.
- Added a `useInterval` utility hook.
- Added a `useLocalStorage` utility hook.
- Added a `useOptimisticValue` utility hook.

### IAC changes

- Added default value as a function for `appName` parameter.
- Added publisher profiles as outputs for future automation.
