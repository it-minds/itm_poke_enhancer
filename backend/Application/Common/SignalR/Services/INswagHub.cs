using System.Threading.Tasks;

namespace Application.Common.SignalR.Hubs
{
  // !NOTE: All methods here must either be implemented in BaseAuthorizedHub or in the individual hubs.
  public interface INswagHub
  {
    Task JoinGroup(string groupName);
    Task LeaveGroup(string groupName);
  }
}
