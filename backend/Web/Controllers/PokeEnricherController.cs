using Application.Pokemon;
using Application.Pokemon.Commands.CreateProperty;
using Application.Pokemon.Queries.GetAllPokemon;
using Application.Pokemon.Queries.GetPokemon;
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

    [HttpGet("{id}")]
    public async Task<ActionResult<EnrichedPokemonDto>> GetEnrichedPokemon([FromRoute] int id, CancellationToken cancellationToken)
    {
      GetPokemonQuery query = new GetPokemonQuery
      {
        Id = id
      };

      return await Mediator.Send(query, cancellationToken);
    }

    [HttpPost]
    public async Task<ActionResult<int>> AddProperty([FromBody] CreatePropertyCommand command, CancellationToken cancellationToken)
    {
      return await Mediator.Send(command, cancellationToken);
    }

  }
}
