using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common;
using Application.Common.Interfaces;
using Application.Pokemon;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Pokemon.Queries.GetPokemon
{
  public class GetPokemonQuery : IRequest<PokeServiceDto>
  {
    public class GetPokemonQueryHandler : IRequestHandler<GetPokemonQuery, PokeServiceDto>
    {
      public GetPokemonQueryHandler(IApplicationDbContext dbContext, IMapper mapper)
        : base(dbContext, mapper) { }

      public async Task<int> Handle(GetPokemon Query request, CancellationToken cancellationToken)
      {
        return 0;
      }
    }
  }
}
