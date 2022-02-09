# SignalR

This project makes use of [SignalR](https://dotnet.microsoft.com/apps/aspnet/signalr).

The backend acts as the publisher and the frontend the subscriber.

## SignalR on the backend

### Creating the hubs

Start by identifying the scope of your Hub. If the Hub has a singular scope within the same group of commands or queries, use that same namespace.
Example: `namespace Application.Users.Common.SignalR`.
Otherwise, use the common application scope namespace `Application.Common.SignalR`.

Start by creating an interface for all methods the Hub provides

```csharp
using System.Threading.Tasks;
using Application.Prizes.Common;

namespace Application.Users.Common.SignalR
{
  public interface IUserHubService
  {
    Task UserCreated(UserIdDTO newUser);
  }
}
```

_Note: The member methods must be with a single argument; multiple arguments are not supported._

Next, create the Hub class.
If you need an authorized hub, a pre-existing base class exists that you can use.

```csharp
namespace Application.Users.Common.SignalR
{
  public class UserHub : BaseAuthorizedHub<IUserHubService> { }
}
```

The base class allows for users through authentication to be mapped to their client ids.
If you need a public hub, use the SignalR abstract class `Hub`.

```csharp
using Application.Common.Interfaces.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Application.Common.SignalR.Hub
{
  public class UserHub : Hub<IUserHubService> { }
}
```

The Hub class can be empty. If you need to implement features outside the hub service interface, they might need to be static.

Finally, register the hub in `Startup.cs`

```csharp
app.UseEndpoints(endpoints =>
{
  endpoints.MapHub<UserHub>("/hubs/user");
});
```

You are now ready to use the hub.

### Using hubs

Using hubs is easy. All you need is to use the IHubContext interface during DI.
This context will automatically inherit all the member methods from the interface.

```csharp
public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, int>
{
  private readonly IHubContext<UserHub, IUserHubService> hubContext;

  public CreateUserCommandHandler(IHubContext<UserHub, IUserHubService> hubContext)
  {
    this.hubContext = hubContext;
  }

  public async Task<int> Handle(CreateUserCommand request, CancellationToken cancellationToken)
  {
    await hubContext.Client.All.UserCreated( /** UserIdDTO needed */ )
  }
}
```

It is possible with authorized hubs to use the client id of specific users.
_Note: the use of the static members from the Hub class._

```csharp
public async Task<int> Handle(CreateUserCommand request, CancellationToken cancellationToken)
{
  var connectedAdminIds = await dbContext.Users
    .Where(x => x.Role == UserRoles.Admin && UserHub.GetConnectedIdentifiers.Contains(x.Id))
    .Select(x => x.Id)
    .ToListAsync();

  var connectedAdminClients = UserHub.GetConnectedClientIds(connectedAdminIds);

  await hubContext.Client.Clients(connectedAdminClients).UserCreated( /** UserIdDTO needed */ )
}
```

### Exposing hubs to the frontend via NSwag.

In `Application.Common.SignalR`, you will find the `AllHubsTypeGenerator.cs` file.
From here, you must add the individual hub service you need to expose with a unique key.

```csharp
private static IDictionary<string, Dictionary<string, IEnumerable<Type>>> AllMyHubs()
{
  return new Dictionary<string, Dictionary<string, IEnumerable<Type>>> {
    {"User", FindHubServiceType(typeof(IUserHubService))}
  };
}
```

When you build the backend, you can also generate a type in the nswag service that is fully typed.

### Testing hubs

It is important to write tests. So we have included some helper classes to generate mocks for the hub contexts,
explained further [here.](/backend/Application.UnitTests/Common/SignalR/Mocks/readme.md)

TLDR: You can mock each hub like this:

```csharp
var hubContextMock = HubMock<UserHub, IUserHubService>.SetupMock(
  new List<Expression<Func<IUserHubService, Task>>>
  {
    (obj) => obj.CreatedUser(null)
  }
);

// use hubContextMock.Object as the instance for each Command / Query handler
```

## SignalR in the frontend

### Connecting and Providing the hubs

The existing hook `useHubProvider` allows you to generate and connect a typed hub.
A `Provider` to expose the hub in React's Context API is also available.

```tsx
const { hub, Provider } = useHubProvider("user", {
  autoCloseOnUnmount: true,
});

return (
  <Provider value={hub}>
    <MyComponent />
  </Provider>
);
```

From child components, you can access the hub with the custom hook `useHubConsumer`

```tsx
const MyComponent: FC = () => {
  const { hub } = useHub("user");
  /** ... */
};
```

From here, you can subscribe to the events on the hub.

```tsx
useEffect(() => {
  hub?.onConnect("userCreated", (newUser) => {
    //newUser is already typed to UserIdDTO
  });
}, [hub]);
```

### Tips

1. Should you need to access the `HubConnection` from SignalR, you can do so with the hub

```typescript
hub.getConnection();
```

2. When using pub/sub, try to make the connection between normal web API calls and events separate.

```tsx
const [users, setUsers] = useState<UserIdDTO[]>([]);

const { hub, Provider } = useHubProvider("user", {
  autoCloseOnUnmount: true,
});

const { genClient } = useNSwagClient(UserClient);

useEffect(() => {
  hub.onConnect("userCreated", (newUser) => {
    setUsers((u) => [...u, newUser]);
  });
}, [hub]);

useEffectAsync(async () => {
  const client = await genClient();

  const allUsers = await client.getAllUsers();

  setUsers(allUsers);
}, []);
```
