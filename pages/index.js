import Image from 'next/image'
import Main from '../components/Main';
import {useState} from 'react'
import {useRouter} from 'next/navigation'
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
	const [loading,setLoading] = useState(true);

	useEffect(()=>{
		if(!currentUser){
			if(session2){
				handleValidation()
				console.log("having session")
			}else{
				setLoading(false)
			}
			// else if(localStorage.getItem('xbird')){
			// 	console.log("having storage")
			// 	handleLogin(localStorage.getItem('xbird'));
			// }
			// else{
			// 	router.push('./signIn')
			// 	console.log("routing")

			// }
		}else{
			setLoading(false)
		}
	},[])


	useEffect(()=>{
		if(!currentUser){
			if(session2){
				handleValidation()
			}else{
				setLoading(false)
			}
			// else if(localStorage.getItem('xbird')){
			// 	handleLogin(JSON.parse(localStorage.getItem('xbird')));
			// }else{
			// 	router.push('./signIn')
			// }
		}	else{
			setLoading(false)
		}
	},[currentUser])

	const handleLogin = async(email) =>{
    	const {data} = await axios.post(loginRoute,{
	      email
	    });	
	    setCurrentUser(data?.user)
	    setLoading(false);
	}

	const handleValidation = async() =>{
	    let email = session2?.user.email
	    const {data} = await axios.post(loginRoute,{
	      email,
	    });
	    if(data.status === false){
	      const name = session2?.user.name || session?.user.name;
	      const username = session2?.user.name || session?.user.name;
	      const image = session2?.user.image || session?.user.image;
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
		  	<div className="fixed z-50 h-full backdrop-blur-lg w-full flex items-center justify-center">
	  			
	  			<span className="loader2">
	  				<img src="twitter-icon.png" className="absolute h-10 w-10 top-0 bottom-0 left-0 right-0 m-auto" alt=""/>
	  			</span>
	  			
	  		</div>

	  	)
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