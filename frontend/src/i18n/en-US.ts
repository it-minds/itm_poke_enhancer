import { Locale } from "./Locale";

export const table: Locale = {
  locale: "English (US)",

  formats: {
    number: {
      decimalSeparator: ".",
      thousandSeparator: ",",
      maxDecimals: 4
    },
    currency: {
      maxDecimals: 2,
      prefix: "$ "
    }
  },

  strings: {
    example: {
      title: "Hello World",
      byLine: "When data is loading it is displayed below",
      dataLine: "Child {{id}} of type {{type}}",

      actions: {
        addNew: "Add new Child"
      },

      form: {
        label: {
          name: "Enter name"
        },
        placeholder: {
          name: "Name"
        }
      }
    },

    errors: {
      nswag: {
        AspNetCoreCompatibleEmailValidator: "Input is not a valid email address.",
        EmailValidator: "Input is not a valid email address.",
        GreaterThanOrEqualValidator: "Input must be greater than or equal to '{ComparisonValue}'.",
        GreaterThanValidator: "Input must be greater than '{ComparisonValue}'.",
        LengthValidator:
          "Input must be between {MinLength} and {MaxLength} characters. You entered {TotalLength} characters.",
        MinimumLengthValidator:
          "The length of Input must be at least {MinLength} characters. You entered {TotalLength} characters.",
        MaximumLengthValidator:
          "The length of Input must be {MaxLength} characters or fewer. You entered {TotalLength} characters.",
        LessThanOrEqualValidator: "Input must be less than or equal to '{ComparisonValue}'.",
        LessThanValidator: "Input must be less than '{ComparisonValue}'.",
        NotEmptyValidator: "Input must not be empty.",
        NotEqualValidator: "Input must not be equal to '{ComparisonValue}'.",
        NotNullValidator: "Input must not be empty.",
        PredicateValidator: "The specified condition was not met for Input.",
        AsyncPredicateValidator: "The specified condition was not met for Input.",
        RegularExpressionValidator: "Input is not in the correct format.",
        EqualValidator: "Input must be equal to '{ComparisonValue}'.",
        ExactLengthValidator:
          "Input must be {MaxLength} characters in length. You entered {TotalLength} characters.",
        InclusiveBetweenValidator:
          "Input must be between {From} and {To}. You entered {PropertyValue}.",
        ExclusiveBetweenValidator:
          "Input must be between {From} and {To} (exclusive). You entered {PropertyValue}.",
        CreditCardValidator: "Input is not a valid credit card number.",
        ScalePrecisionValidator:
          "Input must not be more than {ExpectedPrecision} digits in total, with allowance for {ExpectedScale} decimals. {Digits} digits and {ActualScale} decimals were found.",
        EmptyValidator: "Input must be empty.",
        NullValidator: "Input must be empty.",
        EnumValidator: "Input has a range of values which does not include '{PropertyValue}'."
      }
    }
  }
};
