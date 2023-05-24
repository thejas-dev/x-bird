import Image from 'next/image'
import Main from '../components/Main';
import {useRouter} from 'next/navigation';
import {useRecoilState} from 'recoil'
import {loginRoute,registerRoute} from '../utils/ApiRoutes';
import axios from 'axios';
import {currentUserState} from '../atoms/userAtom'
import {useEffect} from 'react';
import {getProviders,getSession,useSession} from 'next-auth/react'

export default function Home({providers,session2}) {
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const router = useRouter();
	const {data:session} = useSession();

	useEffect(()=>{
		console.log(providers,session2,session)

	},[])

	useEffect(()=>{
		if(!currentUser){
			if(session){
				handleValidation()
			}else if(localStorage.getItem('xbird')){
				handleLogin(localStorage.getItem('xbird'));
			}else{
				router.push('./signIn')
			}
		}	
	},[])

	useEffect(()=>{
		if(!currentUser){
			if(session){
				handleValidation()
			}else if(localStorage.getItem('xbird')){
				handleLogin(localStorage.getItem('xbird'));
			}else{
				router.push('./signIn')
			}
		}	
	},[currentUser])

	const handleLogin = async() =>{
	    let email = session?.user.email
	    const {data} = await axios.post(loginRoute,{
	      email,
	    });
	    setCurrentUser(data?.user);
	}

	const handleValidation = async() =>{
	    let email = session?.user.email
	    const {data} = await axios.post(loginRoute,{
	      email,
	    });
	    if(data.status === false){
	      const name = session?.user.name;
	      const username = session?.user.name;
	      const image = session?.user.image;
	      const {data} = await axios.post(registerRoute,{
	        email,name,username,image
	      })
	      if(!localStorage.getItem('xbird')){
	        localStorage.setItem('xbird',JSON.stringify(data?.user.email));
	      }
	      setCurrentUser(data?.user);
	    }else{
	      if(!localStorage.getItem('xbird')){
	        localStorage.setItem('xbird',JSON.stringify(data?.user.email));
	      }
	      setCurrentUser(data?.user);
	    }
	  }

  return (
    <div className="h-screen w-full">
      <Main/>
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