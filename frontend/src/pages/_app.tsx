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
import { Center, Loader, Flex } from '@mantine/core';

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
    router.replace('/login');
    return (
      <div
        style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <Loader size="lg" />
      </div>
    )
  } else if (isLoginPage && isUserAuthenticated) {
    router.replace('/');
  }

  // else: let them pass!

  return (
    <StoreProvider>
      <Layout
        noHeader={props.router.pathname === '/component/[component]'}
        data={props.pageProps.allComponents}
      >
        <Component {...pageProps} />{' '}
      </Layout>
    </StoreProvider>
  );
}

export const ProtectRoute = ({ children }) => {
  const { state } = useContext(AuthContext);
  const isUserAuthenticated = state.userToken === null ? false : true;

  if (state.isLoading) {
    return (
      <div
        style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <Loader size="lg" />
      </div>
    )
  }

  return children;
};

export default function App(props: AppProps) {
  return (
    <AuthProvider>
      <ApiProvider>
        <Head>
          <title>Legal Paperweights</title>
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
          <link rel="icon" href={favicon.src} />
        </Head>
        <ProtectRoute>
          <AuthFlow {...props} />
        </ProtectRoute>
      </ApiProvider>
    </AuthProvider>
  );
}
