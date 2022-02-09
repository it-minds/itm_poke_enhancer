using Application.Common.Exceptions;
using Application.ExampleChildren.Commands.DeleteExampleChild;
using FluentAssertions;
using System;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace Application.UnitTests.ExampleChildren.Commands.DeleteExampleChild
{
  public class DeleteExampleChildCommandTest : CommandTestBase
  {
    [Fact]
    public async Task Handle_GivenValidId_ShouldRemovePersistedExampleChild()
    {
      var command = new DeleteExampleChildCommand
      {
        Id = 1
      };

      var handler = new DeleteExampleChildCommand.DeleteExampleChildCommandHandler(Context);

      await handler.Handle(command, CancellationToken.None);

      var entity = Context.ExampleChildren.Find(command.Id);

      entity.Should().BeNull();
    }

    [Fact]
    public void Handle_GivenInvalidId_ThrowsException()
    {
      var command = new DeleteExampleChildCommand
      {
        Id = 99
      };

      var handler = new DeleteExampleChildCommand.DeleteExampleChildCommandHandler(Context);

      Func<Task> action = async () => await handler.Handle(command, CancellationToken.None);
      action.Should().Throw<NotFoundException>();
    }
  }
}
