using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Web.Controllers
{

  public class PokeEnricherController : ApiControllerBase
  {
    [HttpGet("id")]
    public async Task<ActionResult<pokemon>> GetPokemon([FromRoute] int id) {
      return NoContent();
    }
  }
}
