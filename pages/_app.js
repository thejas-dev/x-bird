import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react';
import Head from 'next/head'
import { RecoilRoot } from "recoil";
import {useEffect} from 'react';
import {useRouter} from 'next/navigation';

import {Progress} from '../components';
import {useProgressStore} from '../store';

export default function App({ Component, pageProps: { session, ...pageProps} }) {

  const setIsAnimating = useProgressStore((state)=>state.setIsAnimating)
  const isAnimating = useProgressStore((state)=>state.isAnimating)
  const router = useRouter();

  useEffect(()=>{
    const handleStart = () => {setIsAnimating(true)};
    const handleStop = () => {setIsAnimating(false)};

    router.events.on('routeChangeStart',handleStart);
    router.events.on('routeChangeComplete',handleStop);
    router.events.on('routeChangeError',handleStop);

    return () => {
      router.events.off('routeChangeStart',handleStart);
      router.events.off('routeChangeComplete',handleStop);
      router.events.off('routeChangeError',handleStop);      
    } 

  },[router])
  
  useEffect(() => {
    // Check if the user agent indicates the Instagram in-app browser
    const userAgent = window.navigator.userAgent.toLowerCase();
    if(userAgent.includes('instagram')){
      router.push('/notallowed')
    }

    return () => {
    };
  }, []);
  
  return (
  <>
  <Head>
    <title>Trend.zio</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="shortcut icon" href="./favicon.ico"/>
  </Head>
  <SessionProvider session={session}>
  	<RecoilRoot>
    <Progress isAnimating={isAnimating} />
		<Component {...pageProps} />
	</RecoilRoot>
	</SessionProvider>
  </>
 )
}
