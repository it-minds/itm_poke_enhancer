using System.Threading.Tasks;

namespace Application.Common.SignalR.Interfaces.HubContexts
{
  // TODO remove this.
  public interface IExampleHubService
  {
    Task ReceiveMessage(string message);
  }
}
