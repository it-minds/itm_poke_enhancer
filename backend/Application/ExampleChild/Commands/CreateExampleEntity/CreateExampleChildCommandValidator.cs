using FluentValidation;

namespace Application.ExampleChildren.Commands.CreateExampleChild
{
  public class CreateExampleChildCommandValidator : AbstractValidator<CreateExampleChildCommand>
  {
    public CreateExampleChildCommandValidator()
    {
      RuleFor(e => e.Name)
          .MinimumLength(4)
          .MaximumLength(200)
          .NotEmpty();
      RuleFor(e => e.Type)
          .IsInEnum()
          .NotNull();
      RuleFor(e => e.ParentId)
          .NotNull();
    }
  }
}
