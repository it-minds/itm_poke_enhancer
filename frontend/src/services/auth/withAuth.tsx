import React, { FC, ReactNode, useEffect } from "react";

import { AuthContextProvider, useAuth } from "./useAuth";
import { AuthStage } from "./useAuthContextValue";

const AuthGuard: FC<{ authSkip?: boolean; unAuth: ReactNode; loading: ReactNode }> = ({
  children,
  unAuth,
  loading,
  authSkip = false
}) => {
  const { authStage, authCounter, checkAuth } = useAuth();

  useEffect(() => {
    if (authCounter != 0 && !authSkip) checkAuth();
  }, [authCounter, authSkip, checkAuth]);

  const component =
    authStage == AuthStage.UNAUTHENTICATED
      ? unAuth
      : authStage == AuthStage.CHECKING
      ? loading
      : children;

  return <>{component}</>;
};

type Settings = {
  /**
   * If the initial auth check should be disabled.
   */
  authSkip?: boolean;
  /**
   * What component to display if the user is unauthenticated.
   */
  unAuth?: ReactNode;
  /**
   * What component to display while authentication is checking.
   */
  loading?: ReactNode;
};

type SimpleFunctionComponent<P> = (_props: P) => React.ReactElement;

export const withAuth =
  <T,>(
    Component: SimpleFunctionComponent<T>,
    { authSkip = false, unAuth, loading }: Settings = {}
  ): SimpleFunctionComponent<T> =>
  // eslint-disable-next-line react/display-name
  ({ ...props }) => {
    const checkIfProvided = useAuth();

    const child = (
      <AuthGuard
        authSkip={authSkip}
        loading={loading ?? <div>loading...</div>}
        unAuth={unAuth ?? <div>unauthenticated!</div>}>
        <Component {...props} />
      </AuthGuard>
    );

    return checkIfProvided ? child : <AuthContextProvider>{child}</AuthContextProvider>;
  };
