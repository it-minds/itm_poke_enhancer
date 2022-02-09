namespace Domain.Entities
{
  public class PokeExtraEntry
  {
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Name { get; set; }
    public string Value { get; set; }
    public int PokeId { get; set; }
  }
}
