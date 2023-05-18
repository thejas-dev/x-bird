import TwitterApi from  'twitter-api-v2' 

export default async function handler(req, res) {
	let {refreshToken} = req.query;

	const CLIENT_ID = 'SjFRRG40N1JrN3FnTjhVc05MNzk6MTpjaQ'
  	const	CLIENT_SECRET = 'Wzx7zLqLV9rS3QbAftLpOawY3ZGAbLJyL2RlSVsnuiNObOEGPG'

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
