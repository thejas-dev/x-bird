import Image from 'next/image'
import Main from '../components/Main';
import {useEffect,useState} from 'react'
import {useRouter} from 'next/navigation'
import {useRecoilState} from 'recoil'
import {loginRoute,registerRoute,loginNGARoute} from '../utils/ApiRoutes';
import axios from 'axios';
import {currentUserState} from '../atoms/userAtom'
import {getProviders,getSession,useSession} from 'next-auth/react'
import {themeState} from '../atoms/userAtom'
import Head from 'next/head'

export default function Home({providers,session2}) {
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const router = useRouter();
	const {data:session} = useSession();
	const [loading,setLoading] = useState(true);
	const [theme,setTheme] = useRecoilState(themeState);
	const [mediaStream,setMediaStream] = useState('');

	useEffect(()=>{
		if(localStorage.getItem('x-bird-theme')){
			setTheme(localStorage.getItem('x-bird-theme'))
		}
	},[])



	useEffect(()=>{
		if(!currentUser){
			if(session){
				handleValidation()
			}else if(sessionStorage.getItem('trendzio-auth')) {
				handleNGAValidation()
			}else{				
				setLoading(false)
			}
		}else{
			setLoading(false)
		}
	},[])

	

	useEffect(()=>{
		if(!currentUser){
			if(session){
				handleValidation()
			}else{
				setLoading(false)
			}
		}	else{
			setLoading(false)
		}
	},[session])

	const handleNGALogin = async(email,password) =>{
    	const {data} = await axios.post(loginNGARoute,{
	      email,password
	    });	
	    setCurrentUser(data?.user)
	    setLoading(false);
	}

	const handleNGAValidation = async() => {
		if(sessionStorage.getItem('trendzio-auth')){
			let data = JSON.parse(sessionStorage.getItem('trendzio-auth'))
			handleNGALogin(data.email,data.password);
		}else{
			setLoading(false)
		}
	}

	const handleValidation = async() =>{
	    let email = session?.user.email
	    const {data} = await axios.post(loginRoute,{
	      email,
	    });
	    if(data.status === false){
	      const name = session2?.user?.name || session?.user.name;
	      const username = session2?.user?.name || session?.user.name;
	      const image = session2?.user?.image || session?.user.image;
	      const {data} = await axios.post(registerRoute,{
	        email,name,username,image
	      })
	      if(!localStorage.getItem('xbird')){
	        localStorage.setItem('xbird',JSON.stringify(data?.user.email));
	      }
	      setCurrentUser(data?.user);
	      setLoading(false);
	    }else{
	      if(!localStorage.getItem('xbird')){
	        localStorage.setItem('xbird',JSON.stringify(data?.user.email));
	      }
	      setCurrentUser(data?.user);
	      setLoading(false);
	    }
	  }

	  if(loading){
	  	return (
	  		<div className={`${theme}`}>
		  	<main className="fixed dark:bg-[#100C08] z-50 h-full backdrop-blur-lg w-full flex items-center justify-center">
	  			
	  			<span className="loader2">
	  				<img src="https://ik.imagekit.io/d3kzbpbila/thejashari_QSzOWJHFV?updatedAt=1690659361414" 
	  				className="absolute h-10 w-10 top-0 bottom-0 left-0 right-0 m-auto" alt=""/>
	  			</span>
	  			
	  		</main>
	  		</div>

	  	)
	  }

  return (
    <div className={`h-screen ${theme} w-full`}>
    	<Head>
		    <title>Trend.zio</title>
		    <link rel="shortcut icon" href="./favicon.ico"/>
		  </Head>
      <Main />
    </div>
  )
}

export async function getServerSideProps(context){
	const providers = await getProviders();
	const session2 = await getSession(context);
	return{
		props: {
			providers,session2
		}
	}

}