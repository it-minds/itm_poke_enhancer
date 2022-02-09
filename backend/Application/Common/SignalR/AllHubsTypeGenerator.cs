using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Reflection.Emit;
using System.Threading.Tasks;
using Application.Common.SignalR.Hubs;

namespace Application.Common.SignalR
{
  public static class AllHubsTypeGenerator
  {
    public static Type Generate()
    {
      TypeBuilder parent = GetTypeBuilder("AllHubs");

      BuildHubs(parent);

      var fullType = parent.CreateType();

      return fullType;
    }

    private static void BuildHubs(TypeBuilder parent)
    {
      var hubs = Assembly.GetExecutingAssembly().GetExportedTypes()
          .Where(t => (t.BaseType?.IsGenericType ?? false) && t.BaseType?.GetGenericTypeDefinition() == typeof(BaseAuthorizedHub<>))
          .ToList();

      foreach (var hub in hubs)
      {
        TypeBuilder hubBuilder = GetTypeBuilder(hub.Name);

        TypeBuilder methods = GetTypeBuilder(hub.Name + "Methods");

        TypeBuilder events = GetTypeBuilder(hub.Name + "Events");

        BuildEvents(events, hub.BaseType.GetGenericArguments().First());

        var interfaces = hub.GetDirectInterfaces().Where(i => i != typeof(IDisposable));
        foreach (var hubinterface in interfaces)
        {
          BuildMethods(methods, hubinterface);
        }
        BuildMethods(methods, typeof(INswagHub));

        CreateProperty(hubBuilder, "Methods", methods.CreateType());
        CreateProperty(hubBuilder, "Events", events.CreateType());
        CreateProperty(parent, hubBuilder.Name, hubBuilder.CreateType());
      }
    }

    private static void BuildEvents(TypeBuilder parent, Type hubInterface)
    {
      foreach (var method in hubInterface.GetMethods())
      {
        // if for example `Task<int> MyMethod(string inputArg)` it becomes `public string MyMethod {get; set;}`
        CreateProperty(parent, method.Name, method.GetParameters().First().ParameterType);
      }
    }

    private static void BuildMethods(TypeBuilder parent, Type hubInterface)
    {
      foreach (var method in hubInterface.GetMethods())
      {
        if (method.ReturnType.IsGenericType && method.ReturnType.GetGenericTypeDefinition() == typeof(Task))
        {
          // if for example `Task<int> MyMethod()` it becomes `public int MyMethod {get; set;}`
          CreateProperty(parent, method.Name, method.ReturnType.GenericTypeArguments.First());
        }
        else if (method.ReturnType == typeof(Task))
        {
          // if for example `Task MyMethod()` it becomes `public NoResponse MyMethod {get; set;}`
          CreateProperty(parent, method.Name, typeof(NoResponse));
        }
        else
        {
          // if for example `int MyMethod()` it becomes `public int MyMethod {get; set;}`
          CreateProperty(parent, method.Name, method.ReturnType);
        }

      }
    }

    private static IEnumerable<Type> GetDirectInterfaces(this Type type)
    {
      var allInterfaces = new List<Type>();
      var childInterfaces = new List<Type>();

      foreach (var i in type.GetInterfaces())
      {
        allInterfaces.Add(i);
        foreach (var ii in i.GetInterfaces())
          childInterfaces.Add(ii);
      }
      var directInterfaces = allInterfaces.Except(childInterfaces);
      return directInterfaces;
    }

    private static TypeBuilder GetTypeBuilder(string typeSignature = "MyDynamicType")
    {
      var an = new AssemblyName(typeSignature);

      var assemblyBuilder = AssemblyBuilder.DefineDynamicAssembly(an, AssemblyBuilderAccess.Run);

      ModuleBuilder moduleBuilder = assemblyBuilder.DefineDynamicModule("MainModule");

      TypeBuilder tb = moduleBuilder.DefineType(typeSignature,
        TypeAttributes.Public |
        TypeAttributes.Class |
        TypeAttributes.AutoClass |
        TypeAttributes.AnsiClass |
        TypeAttributes.BeforeFieldInit |
        TypeAttributes.AutoLayout,
        null);

      tb.DefineDefaultConstructor(MethodAttributes.Public | MethodAttributes.SpecialName | MethodAttributes.RTSpecialName);

      return tb;
    }

    private static void CreateProperty(TypeBuilder tb, string propertyName, Type propertyType)
    {
      FieldBuilder fieldBuilder = tb.DefineField("_" + propertyName, propertyType, FieldAttributes.Private);

      PropertyBuilder propertyBuilder = tb.DefineProperty(propertyName, PropertyAttributes.HasDefault, propertyType, null);
      MethodBuilder getPropMthdBldr = tb.DefineMethod("get_" + propertyName, MethodAttributes.Public | MethodAttributes.SpecialName | MethodAttributes.HideBySig, propertyType, Type.EmptyTypes);
      ILGenerator getIl = getPropMthdBldr.GetILGenerator();

      getIl.Emit(OpCodes.Ldarg_0);
      getIl.Emit(OpCodes.Ldfld, fieldBuilder);
      getIl.Emit(OpCodes.Ret);

      MethodBuilder setPropMthdBldr =
          tb.DefineMethod("set_" + propertyName,
            MethodAttributes.Public |
            MethodAttributes.SpecialName |
            MethodAttributes.HideBySig,
            null, new[] { propertyType });

      ILGenerator setIl = setPropMthdBldr.GetILGenerator();
      Label modifyProperty = setIl.DefineLabel();
      Label exitSet = setIl.DefineLabel();

      setIl.MarkLabel(modifyProperty);
      setIl.Emit(OpCodes.Ldarg_0);
      setIl.Emit(OpCodes.Ldarg_1);
      setIl.Emit(OpCodes.Stfld, fieldBuilder);

      setIl.Emit(OpCodes.Nop);
      setIl.MarkLabel(exitSet);
      setIl.Emit(OpCodes.Ret);

      propertyBuilder.SetGetMethod(getPropMthdBldr);
      propertyBuilder.SetSetMethod(setPropMthdBldr);
    }
  }

  public class NoResponse { }
}
