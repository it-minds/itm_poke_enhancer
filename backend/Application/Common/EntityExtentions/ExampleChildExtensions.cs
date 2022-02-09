using System;
using System.Collections.Generic;
using System.Linq;
using Domain.Entities;

namespace Application.EntityExtentions
{
  public static class ExampleChildExtentions
  {

    /// <summary>
    /// Returns a list of siblings.
    ///
    /// Requires Includes:
    /// * Parent
    ///   * Children
    /// </summary>
    /// <param name="child">Self</param>
    /// <returns>List<ExampleChild></returns>
    public static List<ExampleChild> GetSiblings(this ExampleChild child)
    {
      if (child.Parent == null)
      {
        throw new ArgumentException("Missing Include Parent");
      }

      var siblings = child.Parent.Children.Where(c => c.Id != child.Id).ToList();

      return siblings;
    }
  }
}
