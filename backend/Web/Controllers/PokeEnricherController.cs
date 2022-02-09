using Application.Pokemon;
using Application.Pokemon.Queries.GetAllPokemon;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Web.Controllers
{

  public class PokeEnricherController : ApiControllerBase
  {
    [HttpGet]
    public async Task<ActionResult<ICollection<BasePokemon>>> GetAllPokemon(CancellationToken cancellationToken)
    {
      return await Mediator.Send(new GetAllPokemonQuery(), cancellationToken);
    }
  }
}
