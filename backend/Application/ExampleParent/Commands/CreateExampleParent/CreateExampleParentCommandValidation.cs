using FluentValidation;

namespace Application.ExampleParents.Commands.CreateExampleChildList
{
  public class CreateExampleParentCommandValidation : AbstractValidator<CreateExampleParentCommand>
  {
    public CreateExampleParentCommandValidation()
    {
      RuleFor(e => e.Parent.Name)
          .MaximumLength(200)
          .NotEmpty();
    }
  }
}
