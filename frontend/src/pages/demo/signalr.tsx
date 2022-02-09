import { Spinner } from "@chakra-ui/spinner";
import SignalRReceive from "components/Demo/SignalRReceive";
import SignalRSend from "components/Demo/SignalRSend";
import { Locale } from "i18n/Locale";
import { GetStaticProps, NextPage } from "next";
import { I18nProps } from "next-rosetta";
import React from "react";
import { withAuth } from "services/auth/withAuth";
import { useHubProvider } from "services/signalR/useHubProvider";

const SignalRPage: NextPage = () => {
  const {
    hub,
    Provider: ExampleHubProvider,
    isConnected
  } = useHubProvider("exampleHub", {
    autoCloseOnUnmount: true
  });

  if (!isConnected) return <Spinner />;

  return (
    <ExampleHubProvider value={hub}>
      Hub: {hub.getConnection().state}
      <SignalRSend />
      <SignalRReceive />
    </ExampleHubProvider>
  );
};

export const getStaticProps: GetStaticProps<I18nProps<Locale>> = async context => {
  const locale = context.locale || context.defaultLocale;
  const { table = {} } = await import(`../../i18n/${locale}`);

  return {
    props: { table }
  };
};

export default withAuth(SignalRPage);
