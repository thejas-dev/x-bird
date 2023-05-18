import TwitterApi from 'twitter-api-v2';
import {useState,useEffect} from 'react'
import Left from './Left';
import Right from './Right'
import Center from './Center'
import Bottom from './Bottom'
import Message from './Message'

export default function Main() {
	// body...
	const client = new TwitterApi({ clientId: 'SjFRRG40N1JrN3FnTjhVc05MNzk6MTpjaQ', clientSecret: 'Wzx7zLqLV9rS3QbAftLpOawY3ZGAbLJyL2RlSVsnuiNObOEGPG' });
	const CALLBACK_URL = 'http://localhost:3000'
	const [id,setId] = useState(0);
	const [accessToken,setAccessToken] = useState('');
	const [bearerToken,setBearerToken] = useState('');
	const [refreshToken,setRefreshToken] = useState('');
	const [currentWindow,setCurrentWindow] = useState('Home');


	

	return(
		<div className="h-[100%] flex w-full justify-center">
			<Left currentWindow  = {currentWindow} setCurrentWindow = {setCurrentWindow} />
			{
				currentWindow === 'Messages'?
				<Message currentWindow  = {currentWindow} setCurrentWindow = {setCurrentWindow}  />
				:
				<Center currentWindow  = {currentWindow} setCurrentWindow = {setCurrentWindow}  />

			}
			<Right currentWindow  = {currentWindow} setCurrentWindow = {setCurrentWindow}  />		
			<Bottom  currentWindow  = {currentWindow} setCurrentWindow = {setCurrentWindow} />	


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