using System;
using System.Collections.Generic;
using System.Linq;

namespace Application.Common.Exceptions
{
  public class CommandErrorCodeException : Exception
  {
    public IDictionary<string, string[]> CommandErrorCodes = new Dictionary<string, string[]>();

    public CommandErrorCodeException(CommandErrorCode errorCode, string[] parameters = null, string message = null) : base(message == null ? "One or more exceptions have occurred." : message)
    {
      CommandErrorCodes.Add(errorCode.ToString(), parameters == null ? new string[] { } : parameters);
    }

    public CommandErrorCodeException(IEnumerable<KeyValuePair<CommandErrorCode, string[]>> errorCodes, string message = null) : base(message == null ? "One or more exceptions have occurred." : message)
    {
      foreach (var errorCodeGroup in errorCodes.GroupBy(x => x.Key))
      {
        CommandErrorCodes.Add(errorCodeGroup.Key.ToString(), errorCodeGroup.SelectMany(y => y.Value).Distinct().ToArray());
      }
    }
  }
}