using System.Collections.Generic;
using System.Linq;

namespace Application.Common.SignalR
{
    public class ConnectionMapping<T, V>
    {
      private readonly Dictionary<T, HashSet<V>> _connections =
        new Dictionary<T, HashSet<V>>();

      public int Count { get =>  _connections.Count; }

      public void Add(T key, V connectionId)
      {
        lock (_connections)
        {
          HashSet<V> connections;
          if (!_connections.TryGetValue(key, out connections))
          {
            connections = new HashSet<V>();
            _connections.Add(key, connections);
          }

          lock (connections)
          {
            connections.Add(connectionId);
          }
        }
      }

      public IEnumerable<V> GetConnections(T key)
      {
        HashSet<V> connections;
        if (_connections.TryGetValue(key, out connections))
        {
          return connections;
        }

        return Enumerable.Empty<V>();
      }

      public IEnumerable<T> GetKeys() => _connections.Keys;

      public void Remove(T key, V connectionId)
      {
        lock (_connections)
        {
          HashSet<V> connections;
          if (!_connections.TryGetValue(key, out connections))
          {
            return;
          }

          lock (connections)
          {
            connections.Remove(connectionId);

            if (connections.Count == 0)
            {
              _connections.Remove(key);
            }
          }
        }
      }
    }
}
