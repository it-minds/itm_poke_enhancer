using Application.ExampleChildren;
using Application.ExampleChildren.Queries.GetExampleChildren;
using AutoMapper;
using FluentAssertions;
using Infrastructure.Persistence;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace Application.UnitTests.ExampleChildren.Queries.GetExampleChildren
{
  [Collection("QueryTests")]
  public class GetExampleChildrenQueryTest
  {
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetExampleChildrenQueryTest(QueryTestFixture fixture)
    {
      _context = fixture.Context;
      _mapper = fixture.Mapper;
    }

    [Fact]
    public async Task Handle_ReturnsCorrectVmAndExampleChildrenCount()
    {
      var query = new GetExampleChildrenQuery();

      var handler = new GetExampleChildrenQuery.GetExampleChildrenQueryHandler(_context, _mapper);

      var result = await handler.Handle(query, CancellationToken.None);

      result.Should().BeOfType<List<ExampleChildIdDto>>();
      result.Count.Should().Be(5);
    }
  }
}
