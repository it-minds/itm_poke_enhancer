# Authorization for SignalR

SignalR only supports sending `access_token` as part of the request queries.
The access token must be parsed during each incoming request.
From there it can be attached to the context that fits your chosen auth.

A standard handler for when using JWT bearer token auth has been created.
`AuthorizationForSignalR` contains a single member function `OnMessageReceived`.

Below is an example of how to attach signalr auth.

```csharp
services
  .AddAuthentication( /** */ )
  .AddJwtBearer(x =>
  {
    /**  */
    x.Events = new JwtBearerEvents
    {
      OnMessageReceived = AuthorizationForSignalR.OnMessageReceived
    };
  });
```
