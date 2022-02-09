using Domain.Common;
using Domain.Enums;

namespace Domain.Entities
{
  public class ExampleChild : AuditableEntity
  {
    public int Id { get; set; }
    public string Name { get; set; }
    public ExampleEnum Type { get; set; }
    public int ParentId { get; set; }

    public virtual ExampleParent Parent { get; set; }
  }
}
