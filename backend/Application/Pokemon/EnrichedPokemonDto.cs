using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Pokemon
{
  public class EnrichedPokemonDto
  {

    public BasePokemon BasePokemon { get; set; }
    public ICollection<PokeExtraEntryDto> ExtraEntries { get; set; }

  }
}
