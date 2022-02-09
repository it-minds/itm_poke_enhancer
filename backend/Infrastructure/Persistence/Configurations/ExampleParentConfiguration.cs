using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
  public class ExampleChildListConfiguration : IEntityTypeConfiguration<ExampleParent>
  {
    public void Configure(EntityTypeBuilder<ExampleParent> builder)
    {
      builder.Property(e => e.Name)
          .HasMaxLength(200)
          .IsRequired();

      builder.HasMany<ExampleChild>(e => e.Children)
          .WithOne(e => e.Parent)
          .IsRequired(true);
    }
  }
}
