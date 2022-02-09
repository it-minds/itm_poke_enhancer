using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using AutoMapper;
using MediatR;

namespace Application.Pokemon.Queries.GetPokemon
{
  public class GetPokemonQuery : IRequest<PokeServiceDto>
  {
    public class GetPokemonQueryHandler : IRequestHandler<GetPokemonQuery, PokeServiceDto>
    {

      private readonly IApplicationDbContext _context;
      private readonly IMapper _mapper;
      public GetPokemonQueryHandler(IApplicationDbContext dbContext, IMapper mapper)
      {
        _context = dbContext;
        _mapper = mapper;
      }

      public PokeServiceDto Handle(GetPokemonQuery request, CancellationToken cancellationToken)
      {
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
