using System;
using System.Linq;
using System.Reflection;
using Application.Common.Security;
using FluentAssertions;
using MediatR;
using Xunit;

namespace Application.UnitTests.Common.Authorization
{
  public class AuthorizationTests
  {

    //Tests if all commands and queries have an Authorization Attribute
    [Fact]
    public void AllCommandAndQueries_ShouldHaveAnAuthorizationAttribute()
    {
      var authAttributeType = typeof(IAuthAttribute);

      var commandsAndQueriesTypes = authAttributeType.Assembly.GetTypes()
        .Where(type => type.GetInterfaces().Any(i =>
          i.IsGenericType && i.GetGenericTypeDefinition() == typeof(IRequest<>)));

      var commandsAndQueriesMissingAuthorizationAttribute = commandsAndQueriesTypes.Where(x =>
        !x.GetCustomAttributes().Any(x => x.GetType().GetInterfaces().Contains(typeof(IAuthAttribute))))
        .Select(x => x.Name);

      commandsAndQueriesMissingAuthorizationAttribute.Should().BeNullOrEmpty();
    }
  }
}
