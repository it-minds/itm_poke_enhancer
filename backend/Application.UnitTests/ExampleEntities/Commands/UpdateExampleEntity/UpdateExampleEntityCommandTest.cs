using Application.Common.Exceptions;
using Application.ExampleChildren;
using Application.ExampleChildren.Commands.UpdateExampleChild;
using Domain.Enums;
using FluentAssertions;
using System;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace Application.UnitTests.ExampleChildren.Commands.UpdateExampleChild
{
  public class UpdateExampleChildCommandTest : CommandTestBase
  {
    [Fact]
    public async Task Handle_GivenValidId_ShouldUpdatePersistedExampleChild()
    {
      var command = new UpdateExampleChildCommand
      {
        Id = 1,
        Child = new ExampleChildDto {
          Name = "TestUpdate",
          Type = ExampleEnum.Youngest,
          ParentId = 1
        }
      };

      var handler = new UpdateExampleChildCommand.UpdateExampleChildCommandHandler(Context);

      await handler.Handle(command, CancellationToken.None);

      var entity = Context.ExampleChildren.Find(command.Id);

      entity.Should().NotBeNull();
      entity.Name.Should().Be(command.Child.Name);
      entity.ParentId.Should().Be(command.Child.ParentId);
      entity.Type.Should().Be(command.Child.Type);
    }

    [Fact]
    public void Handle_GivenInvalidId_ThrowsException()
    {
      var command = new UpdateExampleChildCommand
      {
        Id = 99,
        Child = new ExampleChildDto {
          Name = "TestUpdate",
          Type = ExampleEnum.Youngest,
          ParentId = 1
        }
      };

      var sut = new UpdateExampleChildCommand.UpdateExampleChildCommandHandler(Context);
      Func<Task> action = async () => await sut.Handle(command, CancellationToken.None);

      action.Should().Throw<NotFoundException>();
    }

    [Fact]
    public void Handle_GivenInvalidExampleChildListId_ThrowsException()
    {
      var command = new UpdateExampleChildCommand
      {
        Id = 1,
        Child = new ExampleChildDto {
          Name = "TestUpdate",
          Type = ExampleEnum.Youngest,
          ParentId = 99
        }
      };

      var sut = new UpdateExampleChildCommand.UpdateExampleChildCommandHandler(Context);
      Func<Task> action = async () => await sut.Handle(command, CancellationToken.None);

      action.Should().Throw<NotFoundException>();

    }
  }
}
