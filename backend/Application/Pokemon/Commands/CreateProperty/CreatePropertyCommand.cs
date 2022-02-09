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

namespace Application.Pokemon.Commands.CreateProperty
{
  [TODOAuthorize]
  public class CreatePropertyCommand : IRequest<int>
  {
    public int UserId { get; set; }
    public string Name { get; set; }
    public string Value { get; set; }
    public int PokeId { get; set; }

    public class CreatePropertyCommandHandler : IRequestHandler<CreatePropertyCommand, int>
    {
      private readonly IApplicationDbContext _context;
      private readonly IHubContext<ExampleHub, IExampleHubService> _exampleHubContext;

      public CreatePropertyCommandHandler(IApplicationDbContext context, IHubContext<ExampleHub, IExampleHubService> exampleHubContext)
      {
        _context = context;
        _exampleHubContext = exampleHubContext;
      }

      public async Task<int> Handle(CreatePropertyCommand request, CancellationToken cancellationToken)
      {
        var entity = new PokeExtraEntry
        {
          UserId = request.UserId,
          Name = request.Name,
          Value = request.Value,
          PokeId = request.PokeId
        };

        _context.PokeExtraEntries.Add(entity);

        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
      }
    }
  }
}
