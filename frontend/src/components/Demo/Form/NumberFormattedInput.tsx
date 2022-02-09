import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { ListItem, UnorderedList } from "@chakra-ui/layout";
import LocaleNumber from "components/Common/LocaleNumber";
import React, { FC } from "react";
import { useController, UseControllerProps } from "react-hook-form";
import { NumberFormatProps } from "react-number-format";

type Props<T> = {
  controller: UseControllerProps<T>;
  label?: string;
  placeholder?: string;
} & Pick<NumberFormatProps<unknown>, "allowNegative" | "allowLeadingZeros" | "decimalScale">;

const NumberFormattedInput = <T,>({
  controller,
  label = "",
  placeholder = "",
  ...rest
}: Props<T>): ReturnType<FC<Props<T>>> => {
  const {
    field: { onChange, onBlur, value, ref, name },
    fieldState: { invalid, isDirty, error }
  } = useController(controller);

  return (
    <FormControl isInvalid={(!isDirty && invalid) || error != null}>
      <FormLabel htmlFor={name}>{label}</FormLabel>

      <LocaleNumber
        customInput={Input}
        onBlur={onBlur}
        placeholder={placeholder}
        value={Number(value)}
        ref={ref}
        onValueChange={v => {
          onChange(v.value);
        }}
        {...rest}
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

NumberFormattedInput.displayName = "NumberFormattedInput";

export default NumberFormattedInput;
