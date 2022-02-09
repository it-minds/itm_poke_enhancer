using Application.ExampleParents.Commands.CreateExampleChildList;
using Application.ExampleParents;
using FluentAssertions;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace Application.UnitTests.ExampleChildLists.Commands.CreateExampleChildList
{
  public class CreateExampleChildListCommandTest : CommandTestBase
  {
    [Fact]
    public async Task Handle_ShouldPersistExampleChildList()
    {
      var command = new CreateExampleParentCommand
      {
        Parent= new ExampleParentDto {
          Name = "CreateTest"
        }
      };

      var handler = new CreateExampleParentCommand.CreateExampleParentCommandHandler(Context);

      var result = await handler.Handle(command, CancellationToken.None);

      var entity = Context.ExampleParents.Find(result);

      entity.Should().NotBeNull();
      entity.Name.Should().Be(command.Parent.Name);
    }

  }
}
