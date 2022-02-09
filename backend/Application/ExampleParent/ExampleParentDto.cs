using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;

namespace Application.ExampleParents
{
  public class ExampleParentDto : IAutoMap<ExampleParent>
  {
    public string Name { get; set; }

    public void Mapping(Profile profile)
    {
      profile.CreateMap<ExampleParent, ExampleParentDto>();
    }
  }
}
