using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Entities;
using Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Security;

namespace Application.ExampleChildren.Commands.UpdateExampleChild
{
  [TODOAuthorize]
  public class UpdateExampleChildCommand : IRequest
  {
    [JsonIgnore]
    public int Id { get; set; }
    public ExampleChildDto Child { get; set; }


    public class UpdateExampleChildCommandHandler : IRequestHandler<UpdateExampleChildCommand>
    {
      private readonly IApplicationDbContext _context;

      public UpdateExampleChildCommandHandler(IApplicationDbContext context)
      {
        _context = context;
      }

      public async Task<Unit> Handle(UpdateExampleChildCommand request, CancellationToken cancellationToken)
      {
        var exampleEntity = await _context.ExampleChildren.FindAsync(request.Id);

        if (exampleEntity == null)
        {
          throw new NotFoundException(nameof(ExampleChild), request.Id);
        }

        if (!await _context.ExampleParents.AnyAsync(e => e.Id == request.Child.ParentId, cancellationToken))
        {
          throw new NotFoundException(nameof(ExampleParent), request.Child.ParentId);
        }

        exampleEntity.Name = request.Child.Name;
        exampleEntity.Type = request.Child.Type;
        exampleEntity.ParentId = request.Child.ParentId;

        _context.ExampleChildren.Update(exampleEntity);
        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
      }
    }
  }
}
