using Application.ExampleParents.Commands.CreateExampleChildList;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using System.Threading.Tasks;

namespace Web.Controllers
{
  public class ExampleChildListController : ApiControllerBase
  {
    [HttpPost]
    public async Task<ActionResult<int>> CreateParent(CreateExampleParentCommand command, CancellationToken cancellationToken)
    {
      return await Mediator.Send(command, cancellationToken);
    }
  }
}
