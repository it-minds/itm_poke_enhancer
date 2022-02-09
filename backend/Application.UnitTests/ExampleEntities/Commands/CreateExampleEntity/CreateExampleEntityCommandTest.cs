using Application.Common.SignalR.Hubs;
using Application.Common.SignalR.Interfaces.HubContexts;
using Application.ExampleChildren.Commands.CreateExampleChild;
using Application.UnitTests.Common.SignalR.Mocks.Hubs;
using Domain.Enums;
using FluentAssertions;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace Application.UnitTests.ExampleChildren.Commands.CreateExampleChild
{
  public class CreateExampleChildCommandTest : CommandTestBase
  {
    [Fact]
    public async Task Handle_ShouldPersistExampleChild()
    {
      var command = new CreateExampleChildCommand
      {
        Name = "Young Test",
        Type = ExampleEnum.Youngest,
        ParentId = 1
      };

      var hubContextMock = HubMock<ExampleHub, IExampleHubService>.SetupMock(
        new List<Expression<Func<IExampleHubService, Task>>>
        {
          (obj) => obj.ReceiveMessage(null)
        }
      );

      var handler = new CreateExampleChildCommand.CreateExampleChildCommandHandler(Context, hubContextMock.Object);

      var result = await handler.Handle(command, CancellationToken.None);

      var entity = Context.ExampleChildren.Find(result);

      entity.Should().NotBeNull();
      entity.Name.Should().Be(command.Name);
      entity.Type.Should().Be(command.Type);
      entity.ParentId.Should().Be(command.ParentId);
    }
  }
}
