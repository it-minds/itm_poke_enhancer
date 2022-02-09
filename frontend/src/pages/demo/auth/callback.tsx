import { Locale } from "i18n/Locale";
import { GetStaticProps, NextPage } from "next";
import { I18nProps } from "next-rosetta";
import { useEffect } from "react";

const IndexPage: NextPage = () => {
  useEffect(() => {
    if (window.opener) {
      // get the URL parameters which will include the auth token
      const params = window.location.search;
      window.opener.postMessage(params, window.origin);
      window.close();
    } else {
      throw Error("This page shouldn't be accessed from a non-popup window");
    }
  });
  // some text to show the user
  return <p>Please wait...</p>;
};

export const getStaticProps: GetStaticProps<I18nProps<Locale>> = async context => {
  const locale = context.locale || context.defaultLocale;
  const { table = {} } = await import(`../../../i18n/${locale}`);

  return {
    props: { table }
  };
};

export default IndexPage;
