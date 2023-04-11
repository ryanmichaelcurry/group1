import { AppProps } from 'next/app';
import Head from 'next/head';
import { Layout } from '../components/Layout/Layout';
import favicon from '../public/favicon.svg';
import '../fonts/GreycliffCF/styles.css';
import { useRouter } from 'next/router';

import React, { createContext, useContext, useEffect } from 'react';
import { ApiContext, ApiProvider } from '../context/ApiContext';
import { AuthContext, AuthProvider } from '../context/AuthContext';

export function AuthFlow(props: AppProps) {
  const router = useRouter();
  const { state } = useContext(AuthContext);
  const { Component, pageProps } = props;

  useEffect(() => {
    const { pathname } = router;
    const isLoginPage = pathname === '/login';
    const isUserAuthenticated = state.user == null ? false : true; // Replace with your authentication logic

    console.log(isLoginPage);

    if (!isUserAuthenticated && !state.isLoading) {
      router.replace('/login');
    } else if (isLoginPage && isUserAuthenticated && !state.isLoading) {
      router.replace('/home');
    }
  }, [state]);

  if (!state.isLoading) {
    return (
      <Layout
        noHeader={props.router.pathname === '/component/[component]'}
        data={props.pageProps.allComponents}
      >
        <Component {...pageProps} />{' '}
      </Layout>
    );
  } else {
    return <h1>Loading...</h1>;
  }
}

export default function App(props: AppProps) {
  return (
    <AuthProvider>
      <ApiProvider>
        <Head>
          <title>Legal Paperweights</title>
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
          <link rel="icon" href={favicon.src} />
        </Head>

        <AuthFlow {...props} />
      </ApiProvider>
    </AuthProvider>
  );
}
