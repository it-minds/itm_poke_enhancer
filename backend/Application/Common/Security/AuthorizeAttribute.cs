using System;

namespace Application.Common.Security
{
  /// <summary>
  /// Specifies that the command or query that this attribute is applied to does require authorization.
  /// </summary>
  [AttributeUsage(AttributeTargets.Class, AllowMultiple = true, Inherited = true)]
  public class AuthorizeAttribute : Attribute, IAuthAttribute
  {
    /// <summary>
    /// Initializes a new instance of the <see cref="AuthorizeAttribute"/> class. 
    /// </summary>
    public AuthorizeAttribute() { }

    /// <summary>
    /// Gets or sets a comma delimited list of roles that are allowed to access the resource.
    /// </summary>
    public string Roles { get; set; }

    /// <summary>
    /// Gets or sets the policy name that determines access to the resource.
    /// </summary>
    public string Policy { get; set; }
  }
}
