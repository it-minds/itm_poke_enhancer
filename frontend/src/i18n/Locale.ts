import { CommandErrorCode } from "services/backend/client.generated";

export interface Locale {
  locale: string; // !Must not be deleted. Used for providing the locale in the native language

  formats: {
    number: {
      decimalSeparator;
      thousandSeparator;
      maxDecimals: number;
    };
    currency: {
      prefix?: string;
      suffix?: string;
      maxDecimals: number;
    };
  };

  strings: {
    example: {
      title: string;
      byLine: string;
      dataLine: string;

      actions: {
        addNew: string;
      };

      form: {
        label: {
          name: string;
        };
        placeholder: {
          name: string;
        };
      };
    };

    errors: {
      nswag: Record<keyof typeof CommandErrorCode, string>;
    };
  };
}
