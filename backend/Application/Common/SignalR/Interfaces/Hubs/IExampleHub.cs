using System.Threading.Tasks;

namespace Application.Common.SignalR.Hubs.Interfaces.Hubs
{
  // TODO remove this.
  public interface IExampleHub : INswagHub
  {
    Task SendMessage( string message);
  }
}
