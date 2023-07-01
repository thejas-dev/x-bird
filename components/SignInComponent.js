

import {signIn} from 'next-auth/react'

export default function SignInComponent({id}) {
	// body...
	


	return (
		<div className="h-[100%] flex w-full items-center justify-center ">
			<div className="rounded-2xl flex flex-col border-[1px] border-gray-200/80 shadow-md px-4 py-3 pb-5">
				<h1 className="text-2xl font-bold text-black">New to X-Bird?</h1>
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