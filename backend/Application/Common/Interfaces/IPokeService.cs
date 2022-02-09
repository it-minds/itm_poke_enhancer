using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Pokemon;

namespace Application.Common.Interfaces
{
  public interface IPokeService
  {
    Task<List<BasePokemon>> GetBasePokemonData();
    Task<BasePokemon> GetPokemon(int id);
  }
}
