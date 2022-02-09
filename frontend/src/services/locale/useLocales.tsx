import "ts-array-ext/reduceAsync";

import { useMemoAsync } from "hooks/useMemoAsync";
import { Locale } from "i18n/Locale";
import { useRouter } from "next/router";
import { useI18n } from "next-rosetta";
import { createContext, FC, useContext, useMemo } from "react";

const useLocaleContextValue = () => {
  const { locale, locales } = useRouter();
  const { t, table } = useI18n<Locale>();

  const formats = useMemo(() => {
    return (table(locale) as Locale).formats;
  }, [locale, table]);

  const localeNameMap = useMemoAsync<Record<string, string>>(
    async () => {
      return await locales.reduceAsync<Record<string, string>>(async (acc, cur) => {
        const localeFile = await require("../../i18n/" + cur);
        acc[cur] = (localeFile.table as Locale).locale;
        return acc;
      }, {});
    },
    [],
    {}
  );

  return { t, locale, locales, localeNameMap, formats };
};

const LocalesContext = createContext<ReturnType<typeof useLocaleContextValue>>(null);

export const LocaleContextProvider: FC = ({ children }) => {
  const value = useLocaleContextValue();

  return <LocalesContext.Provider value={value}>{children}</LocalesContext.Provider>;
};

export const useLocales = () => useContext(LocalesContext);
