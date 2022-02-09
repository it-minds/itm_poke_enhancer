
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace Web.Auth
{
  public static class AuthorizationForSignalR
  {
    public static Func<MessageReceivedContext, Task> OnMessageReceived = (context) =>
    {
      var path = context.HttpContext.Request.Path;
      if (!path.HasValue || !(path.Value.StartsWith("/hubs/")))
      {
        // This event does not concern out hubs - continue;
        return Task.CompletedTask;
      }

      var accessToken = context.Request.Query["access_token"];
      if (string.IsNullOrEmpty(accessToken))
      {
        // No access token found - continue and let authorize handle a potential failure.
        return Task.CompletedTask;
      }

      var accessTokenStr = accessToken.ToString();
      if (!accessTokenStr.StartsWith("bearer ", true, null))
      {
        // Token doesn't match bearer jwt standard - continue and let authorize handle a potential failure.
        return Task.CompletedTask;
      }

      // Token is a bearer token and event concers our hubs.
      // Add the token to the context!

      var bearerToken = accessTokenStr.Substring(7);
      context.Token = bearerToken;

      return Task.CompletedTask;
    };
  }
}
