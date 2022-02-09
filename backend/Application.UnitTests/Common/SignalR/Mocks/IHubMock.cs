using System.Threading;
using Microsoft.AspNetCore.SignalR;
using Moq;

namespace Application.UnitTests.Common.SignalR.Mocks
{
  public interface IHubMock<THub, T>
    where THub : Hub<T>
    where T : class
  {
    Mock<T> GetServiceMock();

    Mock<IHubClients<T>> GetClientMock(Mock<T> serviceMock);

    Mock<IHubContext<THub, T>> GetContextMock(Mock<IHubClients<T>> clientMock, Mock<IGroupManager> groupMock);

    Mock<IHubContext<THub, T>> GetContextMock();

    Mock<IGroupManager> GetGroupMock();
  }
}
