using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using AutoMapper;
using MediatR;

namespace Application.Pokemon.Queries.GetPokemon
{
  public class GetPokemonQuery : IRequest<PokeServiceDto>
  {

    int Id { get; set; }

    public class GetPokemonQueryHandler : IRequestHandler<GetPokemonQuery, PokeServiceDto>
    {

      private readonly IApplicationDbContext _context;
      private readonly IMapper _mapper;
      private readonly IPokeService _pokeService;

      public GetPokemonQueryHandler(IApplicationDbContext dbContext, IMapper mapper, IPokeService pokeService)
      {
        _context = dbContext;
        _mapper = mapper;
        _pokeService = pokeService;
      }

      public PokeServiceDto Handle(GetPokemonQuery request, CancellationToken cancellationToken)
      {
        _pokeService.

        var ting = new PokeServiceDto
        {
          Name = "lol",
          PokeId = 1,
          UserId = 1,
          Value = "lol"
        };
        return ting;
      }

      Task<PokeServiceDto> IRequestHandler<GetPokemonQuery, PokeServiceDto>.Handle(GetPokemonQuery request, CancellationToken cancellationToken)
      {
        throw new System.NotImplementedException();
      }
    }
  }
}
