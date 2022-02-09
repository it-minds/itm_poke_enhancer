using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using Microsoft.AspNetCore.SignalR;
using Moq;

namespace Application.UnitTests.Common.SignalR.Mocks.Hubs
{

  public class HubMock<THub, T> : BaseHubMock<THub, T>, IHubMock<THub, T>
    where THub : Hub<T>
    where T : class
  {
    private readonly Mock<T> mock;
    protected HubMock(Mock<T> mock)
    {
      this.mock = mock;
    }

    public Mock<T> GetServiceMock() => mock;

    public Mock<IHubContext<THub, T>> GetContextMock()
      => GetContextMock(GetClientMock(GetServiceMock()), GetGroupMock());

    public static Mock<IHubContext<THub, T>> SetupMock<V>(IEnumerable<Expression<Func<T, V>>> expressions)
    {
      var expressionBuilder = new ExpressionBuilder<T, V>
      {
        expressions = expressions
      };

      var serviceMock = expressionBuilder.Build(new Mock<T>());

      return new HubMock<THub, T>(serviceMock).GetContextMock();
    }
  }
}
