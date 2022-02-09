import { FC, ReactElement, useCallback, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  ExampleChildDto,
  ExampleChildFetchClient,
  SwaggerException
} from "services/backend/client.generated";
import { useNSwagClient } from "services/backend/useNSwagClient";

import { useManualFormErrorsFromNswag } from "./useManualFormErrorsFromNswag";

interface Props {
  children(_data: InjectedProps): ReactElement;
}

interface InjectedProps {
  loading: boolean;
  valid: boolean;
}

const SubmitChildForm: FC<Props> = ({ children }) => {
  const { genClient } = useNSwagClient(ExampleChildFetchClient, true);

  const {
    setError,
    reset,
    formState: { isDirty, isValid },
    handleSubmit
  } = useFormContext<ExampleChildDto>();

  const setNswagErrors = useManualFormErrorsFromNswag(setError);

  const [loading, setLoading] = useState(false);
  const valid = useMemo(() => !isDirty || !isValid, [isDirty, isValid]);

  const postForm = useCallback(
    async (child: ExampleChildDto) => {
      setLoading(true);
      try {
        const exampleClient = await genClient();
        await exampleClient.exampleChild_CreateChild(child);
        reset();
      } catch (err) {
        console.error(err);
        if (SwaggerException.isSwaggerException(err)) {
          setNswagErrors(err);
        }
      } finally {
        setLoading(false);
      }
    },
    [genClient, reset, setNswagErrors]
  );

  return (
    <form onSubmit={handleSubmit(postForm)}>
      {children({
        loading,
        valid
      })}
    </form>
  );
};

export default SubmitChildForm;
