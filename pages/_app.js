import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react';
import Head from 'next/head'
import { RecoilRoot } from "recoil";

export default function App({ Component, pageProps: { session, ...pageProps} }) {
  return (
  <>
  <Head>
    <title>Trend.zio</title>
    <link rel="shortcut icon" href="./favicon.ico"/>
  </Head>
  <SessionProvider session={session}>
  	<RecoilRoot>
		<Component {...pageProps} />
	</RecoilRoot>
	</SessionProvider>
  </>
 )
}
