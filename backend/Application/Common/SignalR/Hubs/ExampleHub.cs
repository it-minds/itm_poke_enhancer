using System.Threading.Tasks;
using Application.Common.SignalR.Hubs.Interfaces.Hubs;
using Application.Common.SignalR.Interfaces.HubContexts;

namespace Application.Common.SignalR.Hubs
{
  // TODO remove this.
  public class ExampleHub : BaseAuthorizedHub<IExampleHubService>, IExampleHub
  {
    // ! NOTE: This method is invokable by the connected clients only.
    public async Task SendMessage(string message)
    {
      await Clients.All.ReceiveMessage(message);
    }

    public async Task SendMessageToGroup(string message, string group)
    {
      await Clients.Group(group).ReceiveMessage(message);
    }
  }
}
