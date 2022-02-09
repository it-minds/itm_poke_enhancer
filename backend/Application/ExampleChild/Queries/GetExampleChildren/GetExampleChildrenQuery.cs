using Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Security;
using Application.ExampleChildren;

namespace Application.ExampleChildren.Queries.GetExampleChildren
{
  [TODOAuthorize]
  public class GetExampleChildrenQuery : IRequest<List<ExampleChildIdDto>>
  {
    public class GetExampleChildrenQueryHandler : IRequestHandler<GetExampleChildrenQuery, List<ExampleChildIdDto>>
    {
      private readonly IApplicationDbContext _context;
      private readonly IMapper _mapper;

      public GetExampleChildrenQueryHandler(IApplicationDbContext context, IMapper mapper)
      {
        _context = context;
        _mapper = mapper;
      }
      public async Task<List<ExampleChildIdDto>> Handle(GetExampleChildrenQuery request, CancellationToken cancellationToken)
      {
        var viewModel = await _context.ExampleChildren
                .Include(x => x.Parent)
                .ProjectTo<ExampleChildIdDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);


        return viewModel;
      }
    }
  }
}
