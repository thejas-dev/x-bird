import {useRouter} from 'next/navigation';
import {useRecoilState} from 'recoil'
import {currentUserState} from '../atoms/userAtom'
import SignInComponent from '../components/SignInComponent';
import {useEffect,useState} from 'react';
import {loginRoute,registerRoute} from '../utils/ApiRoutes';
import {getProviders,getSession,useSession} from 'next-auth/react'
import axios from 'axios';
import ImageKit from "imagekit"

export default function Home({providers,session2}) {
	// body...
	// console.log(session2,providers)
	const router = useRouter();
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const {data:session} = useSession();
	const [loading,setLoading] = useState(false);
	const [name,setName] = useState('');
	const [username,setUsername] = useState('');
	const [image,setImage] = useState('./default.png');
	const [email,setEmail] = useState('');
	const [currentWindow,setCurrentWindow] = useState('google');
	const [finalLoading,setFinalLoading] = useState(false);
	const [imgurl,setImgurl] = useState('');
	const imagekit = new ImageKit({
	    publicKey : process.env.NEXT_PUBLIC_IMAGEKIT_ID,
	    privateKey : process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE,
	    urlEndpoint : process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT
	});

	useEffect(()=>{
		if(session){
			// console.log(session)
			handleValidation();
		}
	},[session])

	//temp
	useEffect(()=>{handleValidation()},[])

	const imagePathCheck = (path) =>{
		if(path){
			if(path.split('/').includes('data:image')){
				return true;				
			}
		}
	}

	const handleValidation = async() =>{
		setLoading(true);
	    let email = session?.user.email
	    const {data} = await axios.post(loginRoute,{
	      email,
	    });
	    if(data.status === false){
	      setName(session?.user.name);
	      setUsername(session?.user.name);
	      setImage(session?.user.image);
	      setEmail(session?.user.email);
	      // const {data} = await axios.post(registerRoute,{
	      //   email,name,username,image
	      // })
	      // if(!localStorage.getItem('xbird')){
	      //   localStorage.setItem('xbird',JSON.stringify(data?.user.email));
	      // }
	      // setCurrentUser(data?.user);
	      setCurrentWindow('accountset')
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

	const url1Setter = () => {
		const file_input = document.getElementById('file3');
		const file = file_input?.files[0];
		if(file){
			const reader = new FileReader();
			reader.addEventListener('load',()=>{
				let uploaded_file = reader.result;
				if(imagePathCheck(uploaded_file)){
					setImage(uploaded_file)
				}
			})
			reader.readAsDataURL(file);			
		}
	}

	const createAccount = async() => {
		setFinalLoading(true)
		imagekit.upload({
	    file : image, //required
	    folder:"Images",
	    fileName : 'TNS_BIRD',   //required
		}).then(async(response) => {
			createAndRedirect(response.url);			
		}).catch(error => {
		    console.log(error.message)
		});
		
	}

	const createAndRedirect = async(imgurl) => {
		const {data} = await axios.post(registerRoute,{
			email,name,username,image:imgurl
		})
		if(!localStorage.getItem('xbird')){
			localStorage.setItem('xbird',JSON.stringify(data?.user.email));
		}
		setCurrentUser(data?.user);
	}
	

	return (
		<div className="h-screen w-full">
			<SignInComponent id="google" loading={loading} name={name}
			username={username} email={email} image={image} setName={setName} setUsername={setUsername} 
			currentWindow={currentWindow} setCurrentWindow={setCurrentWindow} url1Setter={url1Setter} 
			finalLoading={finalLoading} setFinalLoading={setFinalLoading} createAccount={createAccount} />
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

