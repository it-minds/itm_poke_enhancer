import { forwardRef, ForwardRefRenderFunction } from "react";
import NumberFormat, { NumberFormatProps } from "react-number-format";
import { useLocales } from "services/locale/useLocales";

const LocaleCurrency: ForwardRefRenderFunction<
  any,
  Omit<
    NumberFormatProps<any>,
    "thousandSeparator" | "decimalSeparator" | "decimalScale" | "prefix" | "suffix"
  >
> = (props, ref) => {
  const { formats } = useLocales();

  return (
    <NumberFormat
      thousandSeparator={formats.number.thousandSeparator}
      decimalSeparator={formats.number.decimalSeparator}
      decimalScale={formats.currency.maxDecimals}
      {...(formats.currency.prefix && { prefix: formats.currency.prefix })}
      {...(formats.currency.suffix && { suffix: formats.currency.suffix })}
      ref={ref}
      {...props}
    />
  );
};

export default forwardRef(LocaleCurrency);
