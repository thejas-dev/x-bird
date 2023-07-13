import {useRouter} from 'next/navigation';
import {useRecoilState} from 'recoil'
import {currentUserState} from '../atoms/userAtom'
import SignInComponent from '../components/SignInComponent';
import {useEffect} from 'react';
import {loginRoute,registerRoute} from '../utils/ApiRoutes';
import {getProviders,getSession,useSession} from 'next-auth/react'
import axios from 'axios';

export default function Home({providers,session2}) {
	// body...
	// console.log(session2,providers)
	const router = useRouter();
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const {data:session} = useSession();

	useEffect(()=>{
		if(session){
			// console.log(session)
			handleValidation();
		}
	},[session])

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

	useEffect(()=>{
		if(currentUser){
			router.push('/')
		}	
	},[currentUser])
	

	return (
		<div className="h-screen w-full">
			<SignInComponent id={providers.google.id}/>
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