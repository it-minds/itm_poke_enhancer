import { forwardRef, ForwardRefRenderFunction } from "react";
import NumberFormat, { NumberFormatProps } from "react-number-format";
import { useLocales } from "services/locale/useLocales";

const LocaleNumber: ForwardRefRenderFunction<
  any,
  Omit<NumberFormatProps<unknown>, "thousandSeparator" | "decimalSeparator" | "decimalScale">
> = ({ ...props }, ref) => {
  const { formats } = useLocales();

  return (
    <NumberFormat
      thousandSeparator={formats.number.thousandSeparator}
      decimalSeparator={formats.number.decimalSeparator}
      decimalScale={formats.number.maxDecimals}
      ref={ref}
      {...props}
    />
  );
};

export default forwardRef(LocaleNumber);
