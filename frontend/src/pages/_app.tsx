import "../styles.global.css";
import "isomorphic-unfetch";

import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps, NextWebVitalsMetric } from "next/app";
import Head from "next/head";
import { I18nProvider } from "next-rosetta";
import React, { ReactElement } from "react";
import { LocaleContextProvider } from "services/locale/useLocales";
import { ThemeContextProvider } from "services/theme/useSwitchTheme";

export function reportWebVitals(metric: NextWebVitalsMetric): void {
  // TODO consider removing before moving into production. Or limit the scope.
  // Read more: https://nextjs.org/docs/advanced-features/measuring-performance
  console.debug(metric);
}

const MyApp = ({ Component, pageProps, __N_SSG }: AppProps): ReactElement => {
  // usePWA(); //! OPT IN

  return (
    <main>
      <Head>
        <title>APPNAMEHERE</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#2196f3" />
        <meta name="description" content="APPNAMEHERE" />
        <meta name="robots" content="noindex" />

        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/images/icons/icon-192x192.png"></link>
      </Head>
      <noscript>
        <h1>JavaScript must be enabled!</h1>
      </noscript>
      <I18nProvider table={pageProps.table}>
        <LocaleContextProvider>
          <ThemeContextProvider>
            {theme => {
              return (
                <ChakraProvider theme={theme}>
                  <Component {...pageProps} />
                </ChakraProvider>
              );
            }}
          </ThemeContextProvider>
        </LocaleContextProvider>
      </I18nProvider>
    </main>
  );
};

export default MyApp;
