import TwitterApi from  'twitter-api-v2' 

export default async function handler(req, res) {
	let {refreshToken} = req.query;


	const client = new TwitterApi({ clientId: CLIENT_ID, clientSecret: CLIENT_SECRET });
	console.log(refreshToken)
	try{
		const { client: refreshedClient, accessToken, refreshToken: newRefreshToken } = await client.refreshOAuth2Token(refreshToken);

		const { data: userObject } = await refreshedClient.v2.me();
		const data = {
			userObject,
			accessToken,
			refreshToken,
			refreshedClient
		}
		res.status(200).send(userData);	
	}catch(err){
		console.log(err);
		res.status(400).send(err.message)
	}
}

import TwitterApi from  'twitter-api-v2' 

export default async function handler(req, res) {
	console.log("iran")
	const {id,accessToken} = req.query	
	const client = new TwitterApi(accessToken);
	console.log(id,accessToken)
	try{
		const followingsOfJackAsPaginator = await client.v2.following(id);
		const data = {
			followingsOfJackAsPaginator 
		}
		console.log(data)
		return res.status(200).send(data)
	}catch(err){
		console.log(err);
		res.status(400).send(err.message)
	}
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import TwitterApi from  'twitter-api-v2' 

export default function handler(req, res) {
  const { state, code, codeVerifier } = req.query;
  const CLIENT_ID = 'SjFRRG40N1JrN3FnTjhVc05MNzk6MTpjaQ'
  const	CLIENT_SECRET = 'Wzx7zLqLV9rS3QbAftLpOawY3ZGAbLJyL2RlSVsnuiNObOEGPG'
  const CALLBACK_URL = 'http://localhost:3000'

  try{
  	const client = new TwitterApi({ clientId: CLIENT_ID, clientSecret: CLIENT_SECRET });

  	client.loginWithOAuth2({ code, codeVerifier, redirectUri: CALLBACK_URL })
    .then(async ({ client: loggedClient, accessToken, refreshToken, expiresIn }) => {
     
      const { data: userObject } = await loggedClient.v2.me();
      const userData = {
      	loggedClient,
      	userObject,
      	accessToken,
      	refreshToken,
      	expiresIn
      }
      res.status(200).send(userData);
    })
    .catch((err) => {
    	console.log(err)
    	console.log(err.message)
    	res.status(err.data.status).send('Invalid verifier or access tokens!')
    });
  }catch(err){
  	console.log(err.message);
  	res.status(403).send('Something wrong!')

  }
 
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


