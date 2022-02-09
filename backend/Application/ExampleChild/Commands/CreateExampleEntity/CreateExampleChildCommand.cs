using Application.Common.Interfaces;
using Application.Common.SignalR.Hubs;
using Application.Common.SignalR.Interfaces.HubContexts;
using Domain.Entities;
using Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Security;

namespace Application.ExampleChildren.Commands.CreateExampleChild
{
  [TODOAuthorize]
  public class CreateExampleChildCommand : IRequest<int>
  {
    public string Name { get; set; }
    public ExampleEnum Type { get; set; }
    public int ParentId { get; set; }

    public class CreateExampleChildCommandHandler : IRequestHandler<CreateExampleChildCommand, int>
    {
      private readonly IApplicationDbContext _context;
      private readonly IHubContext<ExampleHub, IExampleHubService> _exampleHubContext;

      public CreateExampleChildCommandHandler(IApplicationDbContext context, IHubContext<ExampleHub, IExampleHubService> exampleHubContext)
      {
        _context = context;
        _exampleHubContext = exampleHubContext;
      }

      public async Task<int> Handle(CreateExampleChildCommand request, CancellationToken cancellationToken)
      {
        var exampleEntity = new ExampleChild
        {
          Name = request.Name,
          Type = request.Type,
          ParentId = request.ParentId,
        };

        _context.ExampleChildren.Add(exampleEntity);

        await _context.SaveChangesAsync(cancellationToken);

        await _exampleHubContext.Clients.All.ReceiveMessage( "New Child has been added!");

        return exampleEntity.Id;
      }
    }
  }
}
