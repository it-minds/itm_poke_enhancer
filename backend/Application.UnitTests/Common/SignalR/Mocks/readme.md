# SignalR Mocks

`IHubContext` from SignalR and `Mock` from moq aren't great friends sadly.

From what we have discovered, due to the abstract extension method factory that `IHubContext` uses,
`Mock` simply can't generate a suitable candidate.

## SignalR Interface

Our interface `IHubMock` gives a good overview of all the different parts needed to create a full mock of an `IHubContext`.

The SignalR parts are static as they aren't impacted by the unique Hubs and Services.

The generic abstract class `BaseHubMock` provide a full implementation of the following necessary parts.

- `IGroupManager` Mock
- `IHubClients` Mock
- `IHubContext` Mock

While both `IHubClients` and `IHubContext` require a typed Service
it is only used to adhere to the typing rules of their parent interfaces. The implementation thus stay the same between different hubs.

## Service Interface

The parts of the mock that is required to be done on a Hub and Service basis is individual Service members.

`HubMock` provides a way to construct a mock of a hub by providing a range of expressions for the Service members for each test.

All the individual Hubs can be initiated ad such:

```csharp
var hubContextMock = HubMock<UserHub, IUserHubService>.SetupMock(
  new List<Expression<Func<IUserHubService, Task>>>
  {
    (obj) => obj.CreatedUser(null)
  }
);

// use hubContextMock.Object as the instance for each Command / Query handler
```
