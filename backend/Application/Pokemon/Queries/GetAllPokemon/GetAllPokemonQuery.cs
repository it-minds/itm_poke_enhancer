using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Security;
using AutoMapper;
using MediatR;

namespace Application.Pokemon.Queries.GetAllPokemon
{
  [TODOAuthorize]
  public class GetAllPokemonQuery : IRequest<List<BasePokemon>>
  {
    public class GetAllPokemonQueryHandler : IRequestHandler<GetAllPokemonQuery, List<BasePokemon>>
    {
      private readonly IPokeService _pokeService;
      private readonly IMapper _mapper;
      public GetAllPokemonQueryHandler(IPokeService pokeService, IMapper mapper)
      {
        _pokeService = pokeService;
        _mapper = mapper;
      }

      public async Task<List<BasePokemon>> Handle(GetAllPokemonQuery request, CancellationToken cancellationToken)
      {
        return await _pokeService.GetBasePokemonData();
      }
    }
  }
}
