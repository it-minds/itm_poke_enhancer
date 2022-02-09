using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Application.Common.SignalR.Hubs
{
  [Authorize]
  public abstract class BaseAuthorizedHub<T> : Hub<T>, INswagHub where T : class
  {
    private readonly static ConnectionMapping<string, string> _connectorConnections = new ConnectionMapping<string, string>();
    private readonly static ConnectionMapping<string, string> _groupsConnector = new ConnectionMapping<string, string>();

    // CONNECTIONS
    public static IEnumerable<string> GetConnectedIdentifiers { get => _connectorConnections.GetKeys(); }
    public static IEnumerable<string> GetConnectedClientIds(string identifier) => _connectorConnections.GetConnections(identifier);
    public static IEnumerable<string> GetConnectedClientIds(IEnumerable<string> identifiers) =>
      identifiers.SelectMany(identifier => _connectorConnections.GetConnections(identifier));

    // GROUPS
    public static IEnumerable<string> GetActiveGroups { get => _groupsConnector.GetKeys(); }
    public static IEnumerable<string> GetGroupsClientIds(string identifier) => _groupsConnector.GetConnections(identifier);
    public static IEnumerable<string> GetGroupsClientIds(IEnumerable<string> identifiers) =>
      identifiers.SelectMany(identifier => _groupsConnector.GetConnections(identifier));

    // HUB CONNECTIONS
    private string ConnectorId() => Context.User.FindFirstValue(ClaimTypes.NameIdentifier);

    /// <summary>
    /// Connects the connection from the Hub.
    /// NOTE: this method is automatically used by SignalR and isn't available for the clients
    /// </summary>
    /// <param name="exception"></param>
    /// <returns>A Task that represents the asynchronous disconnect.</returns>
    public override Task OnConnectedAsync()
    {
      string identifier = ConnectorId();
      _connectorConnections.Add(identifier, Context.ConnectionId);
      return base.OnConnectedAsync();
    }

    /// <summary>
    /// Disconnects the connection from the Hub.
    /// - Removes the connection from all SignalR Groups.
    /// - Removes the connection from the Connector-connection map
    /// - Finds the connection's active Connector and if the Connector has no more active connections they are also removed from the groups-connector map.
    /// NOTE: this method is automatically used by SignalR and isn't available for the clients.
    /// </summary>
    /// <param name="exception"></param>
    /// <returns>A Task that represents the asynchronous disconnect.</returns>
    public override async Task OnDisconnectedAsync(Exception exception)
    {
      string identifier = ConnectorId();
      _connectorConnections.Remove(identifier, Context.ConnectionId);

      var connectorHasNoActiveClients = GetConnectedClientIds(identifier).Count() == 0;
      foreach (var group in _groupsConnector.GetKeys())
      {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, group);
        if (connectorHasNoActiveClients) _groupsConnector.Remove(group, identifier);
      }

      await base.OnDisconnectedAsync(exception);
    }

    // CLIENT METHODS
    public async Task JoinGroup(string groupName)
    {
      await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
      _groupsConnector.Add(groupName, ConnectorId());
    }

    public async Task LeaveGroup(string groupName)
    {
      await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
      _groupsConnector.Remove(groupName, ConnectorId());
    }
  }
}
