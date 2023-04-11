import { AppProps } from 'next/app';
import Head from 'next/head';
import { Layout } from '../components/Layout/Layout';
import favicon from '../public/favicon.svg';
import '../fonts/GreycliffCF/styles.css';
import { useRouter } from 'next/router';

import React, { createContext, useContext, useEffect } from 'react';
import { ApiContext, ApiProvider } from '../context/ApiContext';
import { AuthContext, AuthProvider } from '../context/AuthContext';
import { StoreContext, StoreProvider } from '../context/StoreContext';

export function AuthFlow(props: AppProps) {
  const router = useRouter();
  const { state } = useContext(AuthContext);
  const { Component, pageProps } = props;

  const { pathname } = router;
  const isLoginPage = pathname === '/login';
  console.log(state);
  const isUserAuthenticated = state.userToken === null ? false : true;

  console.log('isUserAuthenticated', isUserAuthenticated);

  if (!isUserAuthenticated && !isLoginPage) {
    console.log('/login');
    router.replace('/login');
  } else if (isLoginPage && isUserAuthenticated) {
    router.replace('/');
  }

  return (
    <Layout
      noHeader={props.router.pathname === '/component/[component]'}
      data={props.pageProps.allComponents}
    >
      <Component {...pageProps} />{' '}
    </Layout>
  );
}

export const ProtectRoute = ({ children }) => {
  const { state } = useContext(AuthContext);
  const isUserAuthenticated = state.userToken === null ? false : true;

  if (state.isLoading) {
    return <h1>Loading...</h1>;
  }

  return children;
};

export default function App(props: AppProps) {
  return (
    <AuthProvider>
      <ApiProvider>
        <StoreProvider>
          <Head>
            <title>Legal Paperweights</title>
            <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
            <link rel="icon" href={favicon.src} />
          </Head>
          <ProtectRoute>
            <AuthFlow {...props} />
          </ProtectRoute>
        </StoreProvider>
      </ApiProvider>
    </AuthProvider>
  );
}
