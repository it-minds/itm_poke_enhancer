import { Button } from "@chakra-ui/button";
import React, { FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ExampleChildDto } from "services/backend/client.generated";
import { useLocales } from "services/locale/useLocales";

import MyInput from "./Input";
import NumberFormattedInput from "./NumberFormattedInput";
import SubmitChildForm from "./SubmitFormWithErrors";

const FormWithErrors: FC = () => {
  const { t } = useLocales();

  const formState = useForm<ExampleChildDto>({
    mode: "onBlur",
    defaultValues: {
      name: "",
      parentId: undefined
    }
  });

  return (
    <FormProvider {...formState}>
      <SubmitChildForm>
        {({ valid, loading }) => (
          <>
            <MyInput
              controller={{
                control: formState.control,
                name: "name",
                rules: {
                  minLength: 3 // Note there is a discrepancy between backend and frontend for example reasons.
                }
              }}
              label={t("strings.example.form.label.name")}
              placeholder={t("strings.example.form.placeholder.name")}
            />
            <NumberFormattedInput
              controller={{
                control: formState.control,
                name: "parentId",
                rules: {
                  max: 100
                }
              }}
              allowNegative={false}
              decimalScale={0}
              placeholder="Just a random number test"
            />
            <Button mt={4} isDisabled={valid} colorScheme="teal" type="submit" isLoading={loading}>
              Submit
            </Button>
          </>
        )}
      </SubmitChildForm>
    </FormProvider>
  );
};

export default FormWithErrors;
