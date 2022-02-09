import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  ListItem,
  UnorderedList
} from "@chakra-ui/react";
import React, { FC } from "react";
import { useController, UseControllerProps } from "react-hook-form";
import { CommandErrorCode } from "services/backend/client.generated";

interface Props<T> {
  controller: UseControllerProps<T>;
  label?: string;
  placeholder?: string;
  errors?: CommandErrorCode[];
}

const MyInput = <T,>({ controller, label = "", placeholder = "" }: Props<T>): ReturnType<FC> => {
  const {
    field: { onChange, onBlur, value, ref, name },
    fieldState: { invalid, isDirty, error }
  } = useController(controller);

  return (
    <FormControl isInvalid={(!isDirty && invalid) || error != null}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Input
        onChange={onChange}
        value={value as any}
        ref={ref}
        onBlur={onBlur}
        placeholder={placeholder}
      />
      <FormErrorMessage display="block">
        {error?.type}: {error?.message}
        <UnorderedList>
          {error?.type === "manual" &&
            Object.values(error.types).map(x => <ListItem key={x as string}>{x}</ListItem>)}
        </UnorderedList>
      </FormErrorMessage>
    </FormControl>
  );
};

export default MyInput;
