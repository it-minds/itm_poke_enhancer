using System.Collections.Generic;

namespace Domain.Entities
{
  public class ExampleParent
  {
    public int Id { get; set; }
    public string Name { get; set; }
    public virtual ICollection<ExampleChild> Children { get; set; }
  }
}
