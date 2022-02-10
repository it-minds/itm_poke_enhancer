using Application.Common.Mappings;
using Domain.Entities;

namespace Application.Pokemon
{
  public class PokeExtraEntryDto : IAutoMap<PokeExtraEntry>
  {

    public string Name { get; set; }
    public int PokeId { get; set; }
    public int UserId { get; set; }
    public string Value { get; set; }

  }
}
