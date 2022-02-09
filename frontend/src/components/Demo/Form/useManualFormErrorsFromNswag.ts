import { useCallback } from "react";
import { UseFormSetError } from "react-hook-form";
import { SwaggerException } from "services/backend/client.generated";
import { handleNSwagException } from "services/backend/handleNSwagException";
import { useLocales } from "services/locale/useLocales";

export const useManualFormErrorsFromNswag = <T>(setError: UseFormSetError<T>) => {
  const { t } = useLocales();

  const setNswagErrors = useCallback(
    (err: SwaggerException) => {
      Object.entries(handleNSwagException(err).attributeErrors).forEach(([attribute, errors]) => {
        const message = errors.reduce(
          (acc, x) => ({ ...acc, [x]: t("strings.errors.nswag." + x) }),
          {}
        );

        setError(attribute as any, {
          type: "manual",
          message: "Following errors occurred",
          types: message
        });
      });
    },
    [setError, t]
  );

  return setNswagErrors;
};
