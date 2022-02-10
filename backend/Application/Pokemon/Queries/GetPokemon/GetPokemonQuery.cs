using System.Collections.Generic;
using System.Threading;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using AutoMapper;
using MediatR;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Application.Common.Security;

namespace Application.Pokemon.Queries.GetPokemon
{
  [TODOAuthorize]
  public class GetPokemonQuery : IRequest<EnrichedPokemonDto>
  {

    public int Id { get; set; }

    public class GetPokemonQueryHandler : IRequestHandler<GetPokemonQuery, EnrichedPokemonDto>
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

      public async Task<EnrichedPokemonDto> Handle(GetPokemonQuery request, CancellationToken cancellationToken)
      {
        BasePokemon basePokemon = await _pokeService.GetBasePokemon(request.Id);
        List<PokeExtraEntryDto> extraEntries = await _context.PokeExtraEntries.Where(e => e.PokeId == request.Id)
                                               .ProjectTo<PokeExtraEntryDto>(_mapper.ConfigurationProvider)
                                               .ToListAsync(cancellationToken);

        return new EnrichedPokemonDto
        {
          BasePokemon = basePokemon,
          ExtraEntries = extraEntries
        };
      }
    }
  }
}
