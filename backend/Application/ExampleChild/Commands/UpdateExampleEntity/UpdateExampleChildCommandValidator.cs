using FluentValidation;

namespace Application.ExampleChildren.Commands.UpdateExampleChild
{
  public class UpdateExampleChildCommandValidator : AbstractValidator<UpdateExampleChildCommand>
  {

    public UpdateExampleChildCommandValidator()
    {
      RuleFor(e => e.Child)
          .NotNull();
      RuleFor(e => e.Child.Name)
          .MaximumLength(200)
          .NotEmpty();
      RuleFor(e => e.Child.Type)
          .IsInEnum()
          .NotNull();
      RuleFor(e => e.Child.ParentId)
          .NotNull();
    }
  }
}
