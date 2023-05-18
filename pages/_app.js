import '../styles/globals.css'
import Head from 'next/head'
import { RecoilRoot } from "recoil";

export default function App({ Component, pageProps: { session, ...pageProps} }) {
  return (
  <>
  <Head>
    <title>xbird</title>
  </Head>
  	<RecoilRoot>
		<Component {...pageProps} />
	</RecoilRoot>
  </>
 )
}
