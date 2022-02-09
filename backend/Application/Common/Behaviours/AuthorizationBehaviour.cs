using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Security;
using MediatR;
using System;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Common.Behaviours
{
  public class AuthorizationBehaviour<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
  {
    private readonly ICurrentUserService _currentUserService;
    private readonly IAuthorizationService _identityService;

    public AuthorizationBehaviour(
        ICurrentUserService currentUserService,
        IAuthorizationService identityService)
    {
      _currentUserService = currentUserService;
      _identityService = identityService;
    }

    public async Task<TResponse> Handle(TRequest request, CancellationToken cancellationToken, RequestHandlerDelegate<TResponse> next)
    {
      var authAttributes = request.GetType().GetCustomAttributes().Where(x => x.GetType().GetInterfaces().Contains(typeof(IAuthAttribute)));

      if (authAttributes.Any())
      {

        var authorizeAttributes = authAttributes.Where(x => x.GetType() == typeof(AuthorizeAttribute)).Select(x => x as AuthorizeAttribute);
        if (authorizeAttributes.Any())
        {
          // Must be authenticated user
          if (_currentUserService.UserId == null)
          {
            throw new UnauthorizedAccessException();
          }

          // Role-based authorization
          var authorizeAttributesWithRoles = authorizeAttributes.Where(a => !string.IsNullOrWhiteSpace(a.Roles));

          if (authorizeAttributesWithRoles.Any())
          {
            foreach (var roles in authorizeAttributesWithRoles.Select(a => a.Roles.Split(',')))
            {
              var authorized = false;
              foreach (var role in roles)
              {
                var isInRole = _identityService.IsInRole(role.Trim());
                if (isInRole)
                {
                  authorized = true;
                  break;
                }
              }

              // Must be a member of at least one role in roles
              if (!authorized)
              {
                throw new ForbiddenAccessException();
              }
            }
          }

          // Policy-based authorization
          var authorizeAttributesWithPolicies = authorizeAttributes.Where(a => !string.IsNullOrWhiteSpace(a.Policy));
          if (authorizeAttributesWithPolicies.Any())
          {
            foreach (var policy in authorizeAttributesWithPolicies.Select(a => a.Policy))
            {
              var authorized = _identityService.HasPolicy(policy);

              if (!authorized)
              {
                throw new ForbiddenAccessException();
              }
            }
          }
        }
        return await next();
      }
      //Command or query is missing an AuthorizationAttribute attribute, please add one of the following:
      //AuthorizeAttribute - Specifies that the command or query that this attribute is applied to does require authorization.
      //TODOAuthorizeAttribute - Specifies that the command or query that this attribute is applied to require authorization at a later stage.
      //AllowAnonymous - Specifies that the command or query that this attribute is applied to does require authorization.
      if (Debugger.IsAttached)
        Debugger.Break();
      throw new Exception("Missing AuthorizationAttribute on Command");
    }
  }
}
