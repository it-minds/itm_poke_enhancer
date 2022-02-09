using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
  public class ExampleChildConfiguration : IEntityTypeConfiguration<ExampleChild>
  {
    public void Configure(EntityTypeBuilder<ExampleChild> builder)
    {
      builder.Property(e => e.Name)
          .HasMaxLength(200)
          .IsRequired();

      builder.HasOne<ExampleParent>(e => e.Parent)
          .WithMany(e => e.Children)
          .HasForeignKey(e => e.ParentId)
          .IsRequired(true);
    }
  }
}
