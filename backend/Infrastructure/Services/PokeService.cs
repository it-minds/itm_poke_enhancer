using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Pokemon;
using System.Net.Http;

namespace Infrastructure.Services
{
  public class PokeService : IPokeService
  {
    public async Task<List<BasePokemon>> GetBasePokemonData()
    {
      try
      {
        HttpClient client = new HttpClient();
        var result = await client.GetAsync("http://pokeapi.co/api/v2/pokemon");
        var resolvedPokemon = await result.Content.ReadAsAsync<Root>();

        var pokemonToReturn = new List<BasePokemon>();
        foreach (var pokemon in resolvedPokemon.results)
        {
          var pokemonUrl = pokemon.url.Split("/");
          // Console.WriteLine(pokemon.url + ", " + pokemonUrl[pokemonUrl.Length - 2]);
          var newPokemon = new BasePokemon
          {
            Name = pokemon.name,
            Id = int.Parse(pokemonUrl[pokemonUrl.Length - 2])
          };
          pokemonToReturn.Add(newPokemon);
        }
        return pokemonToReturn;
      }
      catch (HttpRequestException e)
      {
        throw e;
      }

    }

    public Task<BasePokemon> GetPokemon(int id)
    {
      throw new System.NotImplementedException();
    }
  }
  public class Result
  {
    public string name { get; set; }
    public string url { get; set; }
  }
  public class Root
  {
    public int count { get; set; }
    public string next { get; set; }
    public object previous { get; set; }
    public List<Result> results { get; set; }
  }
}

