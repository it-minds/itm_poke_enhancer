using System;
using System.Collections.Generic;
using Application.Pokemon;

namespace Application.Common.Interfaces
{
  public interface IPokeService
  {
    List<BasePokemon> GetBasePokemonData();
    BasePokemon GetPokemon(int id);
  }
}
