import {HiOutlineCamera} from 'react-icons/hi';
import {useEffect,useState} from 'react';	
import {signIn} from 'next-auth/react'

export default function SignInComponent({loading,id,name,setName,setUsername,currentWindow,setCurrentWindow,
	username,email,image,url1Setter,finalLoading,setFinalLoading,createAccount}) {
	// body...
	const [path3,setPath3] = useState('');


	


	return (
		<div className="h-[100%] bg-[#e6f2ff] p-2 relative flex w-full items-center justify-center ">
			<div className={` flex justify-center left-0 top-0 z-50 items-center bg-white/80 transition-all duration-300 ease-in-out ${finalLoading ? 'absolute' : 'hidden'} h-full w-full`}>
				<span className="loader4 flex items-center justify-center">
					<img src="twitter-icon.png" alt="" className="h-[50px] w-[50px] -rotate-[40deg]"/>
				</span> 
			</div>
			{
				currentWindow === 'google' ?
				<div className="relative overflow-hidden rounded-2xl flex flex-col border-[1px] bg-white border-gray-200/80 shadow-md px-4 py-3 pb-5">
					<div className={`bg-white/70 ${loading ? 'absolute' : 'hidden' }  absolute top-0 left-0 h-full w-full flex items-center justify-center`}>
						<span className="loader6"/>
					</div>
					<h1 className="text-2xl font-bold text-black">New to TNS-Bird?</h1>
					<h1 className="text-md text-gray-500 mt-5 ">Login now to get your own personalized timeline!</h1>
					<div 
					onClick={()=>{signIn(id)}}
					className="flex justify-center mt-5 w-full py-3 rounded-full border-[1.7px] hover:bg-gray-200/50 cursor-pointer 
					duration-200 ease-in-out transition-all border-gray-300">
						<div className="gap-2 flex items-center">
							<img src="https://img.freepik.com/free-icon/google_318-258888.jpg" 
							alt="not found" className="h-5 w-5 "/>
							<h1 className="text-black text-gray-900 font-semibold">Login with google</h1>
						</div>
					</div>
				</div>
				:
				currentWindow === 'accountset' ? 
				<div className='lg:w-[35%] md:w-[50%] w-[90%] lg:h-[60%] md:h-[60%] h-[60%] border-[1px] bg-white border-gray-200/80 shadow-md py-3 pb-5 flex flex-col rounded-2xl'>
					<h1 className="md:text-2xl text-xl font-bold text-black px-4">Set up your account</h1>
					<div className="h-[1px] w-full bg-gray-300/50 my-3"/>
					<div className="h-full w-full flex-col flex justify-center">
						<div className="w-full px-4 py-3">
							<div className="w-full flex flex-col border-[1.5px] px-2 py-1 rounded-lg focus-within:border-sky-400  border-gray-300/60">
								<h1 className="text-sm text-gray-500" id="name" >Name</h1>
								<input type="text" placeholder="Enter your name" 
								onFocus={()=>document.getElementById('name').classList.add('text-sky-500')}
								onBlur={()=>document.getElementById('name').classList.remove('text-sky-500')}
								value={name}
								onChange={(e)=>setName(e.target.value)}
								className="w-full text-lg
								text-black placeholder:text-gray-500/70 outline-none "/>
							</div>
						</div>
						<div className="w-full px-4 py-3">
							<div className="w-full flex flex-col border-[1.5px] px-2 py-1 rounded-lg focus-within:border-sky-400  border-gray-300/60">
								<h1 className="text-sm text-gray-500" id="Username" >@Username</h1>
								<input type="text" placeholder="Enter your Username" 
								onFocus={()=>document.getElementById('Username').classList.add('text-sky-500')}
								onBlur={()=>document.getElementById('Username').classList.remove('text-sky-500')}
								value={username}
								onChange={(e)=>setUsername(e.target.value)}
								className="w-full text-lg
								text-black placeholder:text-gray-500/70 outline-none "/>
							</div>
						</div>
						<div className="w-full flex items-center mt-2 justify-center">
							<button 
							onClick={()=>setCurrentWindow('imageset')}
							className="rounded-full py-2 text-lg hover:bg-sky-600 transition-all duration-200 ease px-10 bg-sky-500 text-white font-semibold">
								Continue
							</button>
						</div>
					</div>

				</div>
				:
				<div className='lg:w-[35%] md:w-[50%] w-[90%] lg:h-[60%] md:h-[60%] h-[60%] border-[1px] 
				bg-white border-gray-200/80 shadow-md py-3 pb-5 relative flex flex-col rounded-2xl z-10'>
					
					<h1 className="md:text-2xl text-xl font-bold text-black px-4">Set profile picture</h1>
					<div className="h-[1px] w-full bg-gray-300/50 my-3"/>
					<div className="w-full flex items-center overflow-hidden justify-center h-full">
						<div className="relative overflow-hidden md:h-[200px] h-[150px] w-[150px] md:w-[200px] rounded-full border-[2px] border-dashed border-sky-400">
							<img src={image} alt="" className="rounded-full h-full w-full"/>
							<div className="absolute inset-0 m-auto z-40 h-[99.5%] w-[99.5%] bg-black/10 transition-all duration-200 ease-in-out hover:bg-black/30"/>
							<div 
							onClick={()=>document.getElementById('file3').click()}
							className="absolute peer z-50 md:h-10 h-8 w-8 md:w-10 md:p-[6px] p-1 rounded-full bg-black/40 hover:bg-black/30 top-0 left-0 right-0 bottom-0 m-auto">
								<HiOutlineCamera className="h-full w-full text-white"/>
							</div>
							<input type="file" accept="image/*" id="file3"
							value={path3} onChange={(e)=>{setPath3(e.target.value);url1Setter()}}
							hidden/>
						</div>
					</div>
					<div className="w-full absolute -bottom-5 flex items-center mt-2 justify-center">
						<button 
						onClick={()=>{createAccount()}}
						className="rounded-full py-2 text-lg hover:bg-sky-600 transition-all duration-200 ease px-10 bg-sky-500 text-white font-semibold">
							Create
						</button>
					</div>

				</div>

			}
		</div>

	)
}



// async function getLink() {
	// 	// body...
	// 	// const authLink = await client.generateAuthLink(CALLBACK_URL);
	// 	if(localStorage.getItem('temporary')){
	// 		makeClient();
	// 	}else if(localStorage.getItem('x-bird-refresh')){
	// 		refreshClient();
	// 	}else{
	// 		goToTwitterLink();			
	// 	}	
	// }

	// const goToTwitterLink = async() => {
	// 	const { url, codeVerifier, state } = client.generateOAuth2AuthLink(CALLBACK_URL, { scope: ['tweet.read', 'users.read', 'offline.access'] });
	// 		// const authLink = await client.generateAuthLink(CALLBACK_URL, { linkMode: 'authorize' });

	// 		localStorage.setItem('temporary',codeVerifier);
	// 		// const link = authLink.url;
	// 		location = url
	// }

	// const makeClient = async() => {
	// 	if(!location.search){
	// 		goToTwitterLink()
	// 		return
	// 	}
	// 	const code = location.search.split('&')[1].split('=')[1]
	// 	const state = location.search.split('&')[0].split('=')[1]
	// 	const codeVerifier = localStorage.getItem('temporary');
	// 	localStorage.removeItem('temporary');
	// 	fetch(`http://localhost:3000/api/callback?state=${state}&code=${code}&codeVerifier=${codeVerifier}`).then((res)=>{
	// 		return res.json()
	// 	}).then(async(data)=>{
	// 		console.log(data);
	// 		setId(data.userObject.id)
	// 		setAccessToken(data.accessToken);
	// 		setRefreshToken(data.refreshToken);
	// 		localStorage.setItem('x-bird-refresh',data.refreshToken);
	// 		getFollowings(data.userObject.id)
	// 	}).catch(err=>{
	// 		console.log(err.message)
	// 	})
	// }
	

	// const refreshClient = async() => {
	// 	const refreshClient = localStorage.getItem('x-bird-refresh');
	// 	fetch(`http://localhost:3000/api/refreshUser?refreshToken=${refreshClient}`,{
	// 		method:'POST'
	// 	}).then((res)=>res.json()).then((data)=>{
	// 		console.log(data,data.userObject);
	// 		setId(data.userObject.id);
	// 		setAccessToken(data.accessToken);
	// 		setRefreshToken(data.refreshToken);
	// 		localStorage.setItem('x-bird-refresh',data.refreshToken);
	// 	}).catch(err=>{
	// 		console.log(err.message)
	// 		goToTwitterLink()
	// 	})
	// }

	// const getFollowings = async() => {
	// 	fetch(`http://localhost:3000/api/following?id=${id}&accessToken=${accessToken}`).then((res)=>{
	// 		return res.json()
	// 	}).then(async(data)=>{
	// 		console.log(data)
	// 	}).catch(err=>{
	// 		console.log(err.message);
	// 	})
	// }