import { AppProps } from 'next/app';
import Head from 'next/head';
import { Layout } from '../components/Layout/Layout';
import favicon from '../public/favicon.svg';
import '../fonts/GreycliffCF/styles.css';
import UserContextProvider from './component/UserContext'

import { createContext, useContext } from 'react';
import { ApiContext, ApiProvider } from '../context/ApiContext';
import { AuthContext, AuthProvider } from '../context/AuthContext';

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <AuthProvider>
        <ApiProvider>
            
        <Head>
          <title>Legal Paperweights</title>
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
          <link rel="icon" href={favicon.src} />
        </Head>
        
        <Layout
          noHeader={props.router.pathname === '/component/[component]'}
          data={props.pageProps.allComponents}
        >
          <Component {...pageProps} />
                  </Layout>
        
      </ApiProvider>
    </AuthProvider>

  );
}
