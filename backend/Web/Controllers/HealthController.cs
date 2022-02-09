using Application.ExampleChildren;
using Application.ExampleChildren.Commands.CreateExampleChild;
using Application.ExampleChildren.Commands.DeleteExampleChild;
using Application.ExampleChildren.Commands.UpdateExampleChild;
using Application.ExampleChildren.Queries.GetExampleChildren;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Web.Controllers
{

  public class HealthController : ApiControllerBase
  {
    [HttpGet]
    public ActionResult<bool> GetBackendHealth()
    {
      // TODO make integration health checks

      return true;
    }
  }
}
