using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using Moq;

namespace Application.UnitTests.Common.SignalR.Mocks
{
  public class ExpressionBuilder<T, V> where T : class
  {
    public IEnumerable<Expression<Func<T, V>>> expressions { get; set; }

    public Mock<T> Build(Mock<T> mock)
    {
      foreach (var expression in expressions)
      {
        mock.Setup(expression).Verifiable();
      }
      return mock;
    }
  }
}
