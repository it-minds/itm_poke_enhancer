import ThemeShowcase from "components/Demo/ThemeShowcase";
import { Locale } from "i18n/Locale";
import { GetStaticProps, NextPage } from "next";
import { I18nProps } from "next-rosetta";
import React from "react";

const ThemeDemoPage: NextPage = () => {
  return <ThemeShowcase />;
};

export const getStaticProps: GetStaticProps<I18nProps<Locale>> = async context => {
  const locale = context.locale || context.defaultLocale;
  const { table = {} } = await import(`../../i18n/${locale}`); //!Note you might need to change the path depending on page depth

  return {
    props: { table }
  };
};

ThemeDemoPage.displayName = "page name";

export default ThemeDemoPage;
