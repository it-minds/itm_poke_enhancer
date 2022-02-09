using Application.Common.Mappings;

namespace Application.Pokemon
{
  class PokeServiceDto : IAutoMap<Pokemon>
  {
    public string Name { get; set; }
    public int PokeId { get; set; }
    public int UserId { get; set; }
    public string Value { get; set; }

  }
}
