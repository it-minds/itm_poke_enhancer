using System;

namespace Application.Common.Security
{
  /// <summary>
  /// Specifies that the command or query that this attribute is applied to does not require authorization.
  /// </summary>
  [AttributeUsage(AttributeTargets.Class, AllowMultiple = true, Inherited = true)]
  public class AllowAnonymous : Attribute, IAuthAttribute
  {

  }
}
