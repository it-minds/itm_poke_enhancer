using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;

namespace Application.ExampleChildren
{
  public class ExampleChildDto : IAutoMap<ExampleChild>
  {
    public string Name { get; set; }
    public ExampleEnum Type { get; set; }
    public int ParentId { get; set; }
  }
}
