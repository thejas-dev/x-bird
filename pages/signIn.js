import {useRouter} from 'next/navigation';
import {useRecoilState} from 'recoil'
import {currentUserState} from '../atoms/userAtom'
import SignInComponent from '../components/SignInComponent';
import {useEffect,useState} from 'react';
import {loginRoute,registerRoute,registerNGARoute,loginNGARoute,checkNGA} from '../utils/ApiRoutes';
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
	const [ngaGmail,setNgaGmail] = useState('');
	const [ngaPassword,setNgaPassword] = useState('');
	const [ngaConfirmPassword,setNgaConfirmPassword] = useState('');
	const [incorrectPass,setIncorrectPass] = useState('');
	const [passwordNotMatch,setPasswordNotMatch] = useState(false);
	const [creatingNGAAccount,setCreatingNGAAccount] = useState(false);
	const [accountAlreadyExist,setAccountAlreadyExist] = useState(false);
	const [imageSet,setImageSet] = useState(false);


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
	      let username = session?.user?.name?.split(' ')[0]
	      setUsername(username);
	      setImage(session?.user.image);
	      setImageSet(true);
	      setEmail(session?.user.email);
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
					setImageSet(true)
					setImage(uploaded_file)
				}
			})
			reader.readAsDataURL(file);			
		}
	}

	const createAccount = async() => {
		if(creatingNGAAccount){
			setFinalLoading(true)
			imagekit.upload({
		    file : image === './default.png' ? 'https://ik.imagekit.io/d3kzbpbila/default_2cwdqa7Vg.png?updatedAt=1690648406325' : image, 
		    folder:"Images",
		    fileName : 'TNS_BIRD',   //required
			}).then(async(response) => {
				createNGAAndRedirect(response.url);			
			}).catch(error => {
			    console.log(error.message)
			});	
		}else{
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
		
	}

	const createNGAAndRedirect = async(imgurl) => {
		const {data} = await axios.post(registerNGARoute,{
			email:ngaGmail,
			image:imgurl,
			name,
			password:ngaPassword,
			username
		})
		if(data.status === true) {
			if(!localStorage.getItem('xbird')){
				localStorage.setItem('xbird',JSON.stringify(data?.user.email));
			}
			let tempdata = {
				email:ngaGmail,password:ngaPassword
			}
			sessionStorage.setItem('trendzio-auth',JSON.stringify(tempdata));
			setCurrentUser(data?.user);			
		}else{
			location.reload()
		}
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
	
	const loginAccountNGA = async() => {
		if (/@gmail\.com$/.test(ngaGmail)) {
			setLoading(true);		
			const {data} = await axios.post(loginNGARoute,{
				email:ngaGmail,password:ngaPassword
			})
			if(data.status === false){
				setIncorrectPass(true);
				setLoading(false);
			}else{
				setIncorrectPass(false);
				let tempdata = {email:ngaGmail,password:ngaPassword}
				sessionStorage.setItem('trendzio-auth',JSON.stringify(tempdata));
				setCurrentUser(data.user);
			}		    
		}else{
			setNgaGmail('');
			setLoading(false);
		}
	}

	const registerAccountNGA = async() => {
		if (/@gmail\.com$/.test(ngaGmail)) {
			if(ngaPassword === ngaConfirmPassword){
				setLoading(true)
				const {data} = await axios.post(checkNGA,{
					email:ngaGmail
				})
				if(data.status === true){
					setPasswordNotMatch(false);
					setName(ngaGmail.split('@')[0])
					setUsername(ngaGmail.split('@')[0]?.split(' ')[0])
					setCurrentWindow('accountset')
					setCreatingNGAAccount(true);
					setAccountAlreadyExist(false);
					setLoading(false)
				}else{
					setAccountAlreadyExist(true);
					setPasswordNotMatch(false);
					setLoading(false)
				}
			}else{
				setPasswordNotMatch(true)
				setAccountAlreadyExist(false);
			}
		}else{
			setNgaGmail('')
		}
	}

	return (
		<div className="h-screen w-full">
			<SignInComponent id="google" loading={loading} name={name}
			username={username} email={email} image={image} setName={setName} setUsername={setUsername} 
			currentWindow={currentWindow} setCurrentWindow={setCurrentWindow} url1Setter={url1Setter} 
			finalLoading={finalLoading} setFinalLoading={setFinalLoading} createAccount={createAccount} 
			ngaGmail={ngaGmail} setNgaGmail={setNgaGmail} ngaPassword={ngaPassword} setNgaPassword={setNgaPassword}
			ngaConfirmPassword={ngaConfirmPassword} setNgaConfirmPassword={setNgaConfirmPassword}
			loginAccountNGA={loginAccountNGA} registerAccountNGA={registerAccountNGA} incorrectPass={incorrectPass}
			setIncorrectPass={setIncorrectPass} passwordNotMatch={passwordNotMatch} 
			setPasswordNotMatch={setPasswordNotMatch} setAccountAlreadyExist={setAccountAlreadyExist} 
			accountAlreadyExist={accountAlreadyExist} imageSet={imageSet}
			/>
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

