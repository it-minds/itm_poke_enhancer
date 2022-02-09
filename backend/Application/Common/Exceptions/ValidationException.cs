using FluentValidation.Results;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Application.Common.Exceptions
{
  public class ValidationException : Exception
  {
    public ValidationException()
        : base("One or more validation failures have occurred.")
    {
      Errors = new Dictionary<string, string[]>();
    }

    public ValidationException(IEnumerable<ValidationFailure> failures)
        : this()
    {
      Errors = failures
          .GroupBy(e => e.PropertyName, e => e.ErrorMessage)
          .ToDictionary(failureGroup => failureGroup.Key, failureGroup => failureGroup.ToArray());

      CommandErrorCodes = failures.GroupBy(x => x.ErrorCode)
        .ToDictionary(propertyGroup => propertyGroup.Key, propertyGroup =>
        propertyGroup.Select(x => x.PropertyName).Distinct().ToArray());
    }

    public IDictionary<string, string[]> Errors { get; }
    public IDictionary<string, string[]> CommandErrorCodes { get; }
  }
}
