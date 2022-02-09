# SignalR HubContext Interfaces

These interfaces are meant to strong type the methods for specific hubs.

In hubs they can be used like this

```csharp
public class RoomHub : BaseAuthorizedHub<IExampleHubService>, IExampleHub
{
  public async Task SendMessage(string user, string message)
  {
    await Clients.All.ReceiveMessage(5);
  }
}
```

In The application the can be used like this

```csharp


```
