using System.Collections.Generic;
using System.Threading;
using Microsoft.AspNetCore.SignalR;
using Moq;

namespace Application.UnitTests.Common.SignalR.Mocks
{
  public abstract class BaseHubMock<THub, T>
    where THub : Hub<T>
    where T : class
  {
    public Mock<IGroupManager> GetGroupMock()
    {
      var mock = new Mock<IGroupManager>();
      mock.Setup(obj => obj.AddToGroupAsync("", "", CancellationToken.None)).Verifiable();
      mock.Setup(obj => obj.RemoveFromGroupAsync("", "", CancellationToken.None)).Verifiable();
      return mock;
    }

    public Mock<IHubClients<T>> GetClientMock(Mock<T> serviceMock)
    {
        var mock = new Mock<IHubClients<T>>();

        var stringList = new List<string> {};

        mock.Setup(_ => _.All).Returns(serviceMock.Object).Verifiable();
        mock.Setup(_ => _.AllExcept(stringList)).Returns(serviceMock.Object).Verifiable();
        mock.Setup(_ => _.Client("")).Returns(serviceMock.Object).Verifiable();
        mock.Setup(_ => _.Clients(stringList)).Returns(serviceMock.Object).Verifiable();
        mock.Setup(_ => _.Group("")).Returns(serviceMock.Object).Verifiable();
        mock.Setup(_ => _.GroupExcept("", stringList)).Returns(serviceMock.Object).Verifiable();
        mock.Setup(_ => _.Groups(stringList)).Returns(serviceMock.Object).Verifiable();
        mock.Setup(_ => _.User("")).Returns(serviceMock.Object).Verifiable();
        mock.Setup(_ => _.Users(stringList)).Returns(serviceMock.Object).Verifiable();

        return mock;
    }

    public Mock<IHubContext<THub, T>> GetContextMock(Mock<IHubClients<T>> clientMock,
      Mock<IGroupManager> groupMock
    ) {
      var mock = new Mock<IHubContext<THub, T>>();
      mock.Setup(_ => _.Clients).Returns(clientMock.Object).Verifiable();
      mock.Setup(_ => _.Groups).Returns(groupMock.Object).Verifiable();

      return mock;
    }
  }
}
