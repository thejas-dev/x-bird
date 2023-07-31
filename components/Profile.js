import {useState,useEffect} from 'react';
import {useRecoilState} from 'recoil'
import {currentUserState,displayUserState,showLoginNowState} from '../atoms/userAtom'
import {HiOutlineArrowLeft} from 'react-icons/hi';
import {AiOutlineLink,AiOutlineCalendar} from 'react-icons/ai';
import {FaRegComment} from 'react-icons/fa';
import millify from 'millify';
import {BsGraphUpArrow,BsFillShareFill,BsThreeDots} from 'react-icons/bs';
import {AiOutlineRetweet,AiOutlineHeart,AiFillHeart} from 'react-icons/ai';
import {MdOutlineLocationOn} from 'react-icons/md';
import {getPostByIdRoute,updatedPostRoute,getUserByIdRoute,updateUser,updateUserRetweets,
	updateUserFollowing,updateUserFollowers,removePost,updateUserTweets} from '../utils/ApiRoutes';
import DateDiff from 'date-diff';
import axios from 'axios'
import {motion} from 'framer-motion'
import {socket} from '../service/socket';
import ReactPlayer from 'react-player';
import {useRouter} from 'next/router';

let userTweets = [];

export default function Profile({currentWindow,setCurrentWindow,setOpenOverlay,openOverlay,
	overlayFor,setOverlayFor,needToReloadProfile,setNeedToReloadProfile,editProfile}) {
	// body...
	const [displayUser,setDisplayUser] = useRecoilState(displayUserState);
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [currentUserTweets,setCurrentUserTweets] = useState([]);
	const [currentUserLikes,setCurrentUserLikes] = useState([]);
	const [headings,setHeadings] = useState([]);
	const [currentHeading,setCurrentHeading] = useState('Trends');
	const [ownAccount,setOwnAccount] = useState(false);
	const [currentUserRetweets,setCurrentUserRetweets] = useState([]);
	const [accountFound,setAccountFound] = useState(false);
	const [userFollowing,setUserFollowing] = useState(false);
	const [tweetFetched,setTweetFetched] = useState(false);	
	const [loading,setLoading] = useState(true);
	const [showLoginNow,setShowLoginNow] = useRecoilState(showLoginNowState);
	const [postLoading,setPostLoading] = useState(false);
	const router = useRouter();

	const fetchTweets = async() => {
		if(displayUser && displayUser?.tweets?.length > 0){
			setPostLoading(true)
			setCurrentUserTweets([]);
			// let tweet = []
			for(let i = 0; i<displayUser?.tweets?.length; i++){
				const {data} = await axios.get(`${getPostByIdRoute}/${displayUser.tweets[i]}`);
				if(data.post[0]){
					setCurrentUserTweets(currentUserTweets => [...currentUserTweets,data.post[0]])
					// tweet = [...tweet,data.post[0]];
					if(i===0){
						// setCurrentUserTweets(tweet);
						setTweetFetched(true);
						setPostLoading(false)
					}					
				}
			}
		}
	}

	const fetchLikes = async() => {
		if(displayUser && displayUser?.likes?.length > 0){
			setPostLoading(true)
			setCurrentUserLikes([]);
			for(let i = 0; i<displayUser?.likes?.length; i++){
				const {data} = await axios.get(`${getPostByIdRoute}/${displayUser.likes[i]._id}`);
				setCurrentUserLikes(currentUserLikes=>[...currentUserLikes,data.post[0]]);
				if(i===0){
					setPostLoading(false)					
				}
			}
		}
	}

	const fetchRetweets = async() => {
		if(displayUser && displayUser?.retweets?.length > 0){
			setPostLoading(true)
			setCurrentUserRetweets([]);
			for(let i = 0; i<displayUser?.retweets?.length; i++){
				const {data} = await axios.get(`${getPostByIdRoute}/${displayUser.retweets[i]}`);
				setCurrentUserRetweets(currentUserRetweets=>[...currentUserRetweets,data.post[0]]);
				if(i===0){
					setPostLoading(false)					
				}
			}
		}
	}

	useEffect(() => {
	  const handleRouteChange = (url) => {
	    findUserFun(url.split('=')[1])
	    // console.log(url)
	  };

	  // Add the event listener for route changes
	  router.events.on('routeChangeComplete', handleRouteChange);

	  // Remove the event listener when the component is unmounted to prevent memory leaks
	  return () => {
	    router.events.off('routeChangeComplete', handleRouteChange);
	  };
	}, []);

	const findUserFun = (url) => {
		setLoading(true);
		if(url && currentUser){
			const id = url;
			if(id === currentUser._id){
				setAccountFound(true);
				setDisplayUser(currentUser);
				setOwnAccount(true);
				setLoading(false)
			}else{
				findUserByUrl(url);
			}
		}else if(url){
			findUserByUrl(url)
		}else{
			setAccountFound(true);
			setDisplayUser(currentUser);
			setOwnAccount(true);
			setLoading(false)
		}
	}


	useEffect(()=>{
		setLoading(true);
		if(router?.query?.profile && currentUser){
			const id = router?.query?.profile;
			if(id === currentUser._id){
				setAccountFound(true);
				setDisplayUser(currentUser);
				setOwnAccount(true);
				setLoading(false)
			}else{
				findUser();
			}
		}else if(router?.query?.profile){
			findUser()
		}else{
			setAccountFound(true);
			setDisplayUser(currentUser);
			setOwnAccount(true);
			setLoading(false)
		}
	},[])
	// console.log(currentUser)

	useEffect(()=>{
		if(needToReloadProfile){
			findUser();
			setCurrentUserLikes([]);
			setCurrentUserTweets([]);
			setCurrentUserRetweets([]);
			setNeedToReloadProfile(false);
		}
	},[needToReloadProfile])

	const findUserByUrl = async(url) => {
		setLoading(true);
		// console.log(location.search.split('=')[1])
		const {data} = await axios.get(`${getUserByIdRoute}/${url}`);
		if(data.status === false){
			setAccountFound(false);
			setLoading(false);
		}else{
			setAccountFound(true);
			setDisplayUser(data?.user);
			setLoading(false);
		}
	}

	const findUser = async() => {
		setLoading(true);
		// console.log(location.search.split('=')[1])
		const {data} = await axios.get(`${getUserByIdRoute}/${location.search.split('=')[1]}`);
		if(data.status === false){
			setAccountFound(false);
			setLoading(false);
		}else{
			setAccountFound(true);
			setDisplayUser(data?.user);
			setLoading(false);
		}
	}

	useEffect(()=>{
		if(displayUser){
			if(!tweetFetched && currentUserTweets?.length < 1){
				setCurrentUserTweets([]);
				fetchTweets()
			}
			const check = displayUser?.followers?.some(element=>{
				if(element.id === currentUser?._id){
					return true;
				}
				return false
			})		
			if(check){
				setUserFollowing(true);
			}else{
				setUserFollowing(false);
			}
			if(displayUser._id === currentUser._id){
				setOwnAccount(true);
			}else{
				setOwnAccount(false)
			}
			if(currentHeading === 'Trends'){
				
			}else if(currentHeading === 'Likes') {
				fetchLikes();
			}else{
				fetchRetweets()
			}
		}	
	},[displayUser])



	const calDate = (date) => {
		const date1 = new Date();
		const date2 = new Date(date)
		var diff = new DateDiff(date1, date2);
		// console.log(date2.toString().split(' '))
		if(diff.minutes() <= 60){
			return Math.trunc(diff.minutes()) + 'm'
		}else if(diff.hours() <= 24){
			return Math.trunc(diff.hours()) + 'h'
		}else if(diff.days() <= 30){
			return Math.trunc(diff.days()) + 'd'
		}else{
			const splitres = date2?.toString().split(' ')
			const res = splitres[1] + ' ' + splitres[2]
			return res
		} 
	}

	useEffect(()=>{
		const data = [
		{
			title:'Trends'
		},
		{
			title:'Likes'
		},
		{
			title:'Retrends'
		}
		]
		setHeadings(data)
	},[])

	// console.log(currentUserTweets)

	const makeMePink = (j) => {
		const element = document.getElementById(`like-${j}`)
		element.classList.add('text-pink-500','animate-bounce')		
	}

	const makeMeSpin = (j) => {
		const element = document.getElementById(`retweet-${j}`)
		element.classList.add('animate-bounce');
	}

	const likeThisLikeTweet = async(j) => {
		if(displayUser){
			let tweets = currentUserLikes;
			const {data} = await axios.get(`${getPostByIdRoute}/${currentUserLikes[j]._id}`);
			const post = data.post[0];
			let likes = post.likes;
			const user = {
				name:currentUser.name,
				id:currentUser._id,
				username:currentUser.username,
				image:currentUser.image
			}
			// console.log(likes,user)
			const check = likes.some(element=>{
				if(element.id === user.id){
					return true;
				}
				return false
			})
			// console.log(check)
			if(!check){
				likes.push(user);
			}else{
				const idx = likes.findIndex(element=>{
					if(element.id === user.id){
						return true
					}
					return false
				})
				likes.splice(idx,1);
			}
			const updatedPost = {...post, 'likes':likes }
			const res = await axios.post(`${updatedPostRoute}/${currentUserLikes[j]._id}`,updatedPost);
			tweets[j] = res.data.obj;
			setCurrentUserLikes(tweets);

			const check2 = await currentUser.likes.some(element=>{
				if(element._id === res.data.obj._id){
					return true;
				}
				return false
			})
			
			if(!check2){
				const userLiked = [res.data.obj, ...currentUser.likes];
				const result = await axios.post(`${updateUser}/${currentUser._id}`,{
					userLiked
				})
				setCurrentUser(result.data.obj);
			}else{
				const idx = await currentUser.likes.findIndex(element=>{
					if(element._id === res.data.obj._id){
						return true
					}
					return false
				})
				let userLiked = [...currentUser.likes];
				await userLiked.splice(idx,1);
				const result = await axios.post(`${updateUser}/${currentUser._id}`,{
					userLiked
				})
				setCurrentUser(result.data.obj);
			}
			socket.emit('refetch-post',currentUserLikes[j]._id)
		}
	}

	const likeThisTweet = async(j) => {
		if(displayUser && currentUser){
			let tweets = currentUserTweets;
			const {data} = await axios.get(`${getPostByIdRoute}/${currentUserTweets[j]._id}`);
			const post = data.post[0];
			let likes = post.likes;
			const user = {
				name:currentUser.name,
				id:currentUser._id,
				username:currentUser.username,
				image:currentUser.image
			}
			// console.log(likes,user)
			const check = likes.some(element=>{
				if(element.id === user.id){
					return true;
				}
				return false
			})
			// console.log(check)
			if(!check){
				likes.push(user);
			}else{
				const idx = likes.findIndex(element=>{
					if(element.id === user.id){
						return true
					}
					return false
				})
				likes.splice(idx,1);
			}
			const updatedPost = {...post, 'likes':likes }
			const res = await axios.post(`${updatedPostRoute}/${currentUserTweets[j]._id}`,updatedPost);
			tweets[j] = res.data.obj;
			setCurrentUserTweets(tweets);

			const check2 = await currentUser.likes.some(element=>{
				if(element._id === res.data.obj._id){
					return true;
				}
				return false
			})
			
			if(!check2){
				const userLiked = [res.data.obj, ...currentUser.likes];
				const result = await axios.post(`${updateUser}/${currentUser._id}`,{
					userLiked
				})
				setCurrentUser(result.data.obj);
			}else{
				const idx = await currentUser.likes.findIndex(element=>{
					if(element._id === res.data.obj._id){
						return true
					}
					return false
				})
				let userLiked = [...currentUser.likes];
				await userLiked.splice(idx,1);
				const result = await axios.post(`${updateUser}/${currentUser._id}`,{
					userLiked
				})
				setCurrentUser(result.data.obj);
			}
			socket.emit('refetch-post',currentUserTweets[j]._id)
		}else{
			setShowLoginNow(true)
		}
	}


	const likeThisRetweet = async(j) => {
		if(displayUser){
			let tweets = currentUserRetweets;
			const {data} = await axios.get(`${getPostByIdRoute}/${currentUserRetweets[j]._id}`);
			const post = data.post[0];
			let likes = post.likes;
			const user = {
				name:currentUser.name,
				id:currentUser._id,
				username:currentUser.username,
				image:currentUser.image
			}
			// console.log(likes,user)
			const check = likes.some(element=>{
				if(element.id === user.id){
					return true;
				}
				return false
			})
			// console.log(check)
			if(!check){
				likes.push(user);
			}else{
				const idx = likes.findIndex(element=>{
					if(element.id === user.id){
						return true
					}
					return false
				})
				likes.splice(idx,1);
			}
			const updatedPost = {...post, 'likes':likes }
			const res = await axios.post(`${updatedPostRoute}/${currentUserRetweets[j]._id}`,updatedPost);
			tweets[j] = res.data.obj;
			setCurrentUserRetweets(tweets);

			const check2 = await currentUser.likes.some(element=>{
				if(element._id === res.data.obj._id){
					return true;
				}
				return false
			})
			
			if(!check2){
				const userLiked = [res.data.obj, ...currentUser.likes];
				const result = await axios.post(`${updateUser}/${currentUser._id}`,{
					userLiked
				})
				setCurrentUser(result.data.obj);
			}else{
				const idx = await currentUser.likes.findIndex(element=>{
					if(element._id === res.data.obj._id){
						return true
					}
					return false
				})
				let userLiked = [...currentUser.likes];
				await userLiked.splice(idx,1);
				const result = await axios.post(`${updateUser}/${currentUser._id}`,{
					userLiked
				})
				setCurrentUser(result.data.obj);
			}
			socket.emit('refetch-post',currentUserRetweets[j]._id)
		}
	}

	useEffect(()=>{
		if(currentHeading === 'Trends'){
			fetchTweets()
		}else if(currentHeading === 'Likes') {
			fetchLikes();
		}else{
			fetchRetweets()
		}
	},[currentHeading])

	const retweetThisTweet = async(j) => {
		if(currentUser){
			let tweets = currentUserRetweets;
			const {data} = await axios.get(`${getPostByIdRoute}/${currentUserRetweets[j]._id}`);
			const post = data.post[0];
			let retweetedBy = post.retweetedBy;
			const user = {
				name:currentUser.name,
				id:currentUser._id,
				username:currentUser.username,
				image:currentUser.image
			}
			const check = retweetedBy.some(element=>{
				if(element.id === user.id){
					return true;
				}
				return false
			})
			if(!check){
				retweetedBy.push(user);
			}else{
				const idx = retweetedBy.findIndex(element=>{
					if(element.id === user.id){
						return true
					}
					return false
				})
				retweetedBy.splice(idx,1);
			}
			const updatedPost = {...post, 'retweetedBy':retweetedBy }
			const res = await axios.post(`${updatedPostRoute}/${currentUserRetweets[j]._id}`,updatedPost);
			
			tweets[j] = res.data.obj;
			setCurrentUserRetweets(tweets);

			const check2 = await currentUser.retweets.some(element=>{
				if(element === res.data.obj._id){
					return true;
				}
				return false
			})
			
			if(!check2){
				const retweets = [res.data.obj._id, ...currentUser.retweets];
				// const tweets = [data.post._id,...currentUser.tweets]
				const result = await axios.post(`${updateUserRetweets}/${currentUser._id}`,{
					retweets
				})
				setCurrentUser(result.data.obj);
			}else{
				const idx = await currentUser.retweets.findIndex(element=>{
					if(element === res.data.obj._id){
						return true
					}
					return false
				})
				let retweets = [...currentUser.retweets];
				await retweets.splice(idx,1);
				const result = await axios.post(`${updateUserRetweets}/${currentUser._id}`,{
					retweets
				})
				setCurrentUser(result.data.obj);
			}
			socket.emit('refetch-post',currentUserRetweets[j]._id)			
		}
	}
	// console.log(currentUser)

	const retweetThisLikedTweet = async(j) => {
		if(currentUser){
			let tweets = currentUserLikes;
			const {data} = await axios.get(`${getPostByIdRoute}/${currentUserLikes[j]._id}`);
			const post = data.post[0];
			let retweetedBy = post.retweetedBy;
			const user = {
				name:currentUser.name,
				id:currentUser._id,
				username:currentUser.username,
				image:currentUser.image
			}
			const check = retweetedBy.some(element=>{
				if(element.id === user.id){
					return true;
				}
				return false
			})
			if(!check){
				retweetedBy.push(user);
			}else{
				const idx = retweetedBy.findIndex(element=>{
					if(element.id === user.id){
						return true
					}
					return false
				})
				retweetedBy.splice(idx,1);
			}
			const updatedPost = {...post, 'retweetedBy':retweetedBy }
			const res = await axios.post(`${updatedPostRoute}/${currentUserLikes[j]._id}`,updatedPost);
			
			tweets[j] = res.data.obj;
			setCurrentUserLikes(tweets);

			const check2 = await currentUser.retweets.some(element=>{
				if(element === res.data.obj._id){
					return true;
				}
				return false
			})
			
			if(!check2){
				const retweets = [res.data.obj._id, ...currentUser.retweets];
				// const tweets = [data.post._id,...currentUser.tweets]
				const result = await axios.post(`${updateUserRetweets}/${currentUser._id}`,{
					retweets
				})
				setCurrentUser(result.data.obj);
			}else{
				const idx = await currentUser.retweets.findIndex(element=>{
					if(element === res.data.obj._id){
						return true
					}
					return false
				})
				let retweets = [...currentUser.retweets];
				await retweets.splice(idx,1);
				const result = await axios.post(`${updateUserRetweets}/${currentUser._id}`,{
					retweets
				})
				setCurrentUser(result.data.obj);
			}
			socket.emit('refetch-post',currentUserLikes[j]._id)	
		}
	}

	const retweetThisOwnTweet = async(j) => {
		if(currentUser){
			let tweets = currentUserTweets;
			const {data} = await axios.get(`${getPostByIdRoute}/${currentUserTweets[j]._id}`);
			const post = data.post[0];
			let retweetedBy = post.retweetedBy;
			const user = {
				name:currentUser.name,
				id:currentUser._id,
				username:currentUser.username,
				image:currentUser.image
			}
			const check = retweetedBy.some(element=>{
				if(element.id === user.id){
					return true;
				}
				return false
			})
			if(!check){
				retweetedBy.push(user);
			}else{
				const idx = retweetedBy.findIndex(element=>{
					if(element.id === user.id){
						return true
					}
					return false
				})
				retweetedBy.splice(idx,1);
			}
			const updatedPost = {...post, 'retweetedBy':retweetedBy }
			const res = await axios.post(`${updatedPostRoute}/${currentUserTweets[j]._id}`,updatedPost);
			
			tweets[j] = res.data.obj;
			setCurrentUserTweets(tweets);

			const check2 = await currentUser.retweets.some(element=>{
				if(element === res.data.obj._id){
					return true;
				}
				return false
			})
			
			if(!check2){
				const retweets = [res.data.obj._id, ...currentUser.retweets];
				// const tweets = [data.post._id,...currentUser.tweets]
				const result = await axios.post(`${updateUserRetweets}/${currentUser._id}`,{
					retweets
				})
				setCurrentUser(result.data.obj);
			}else{
				const idx = await currentUser.retweets.findIndex(element=>{
					if(element === res.data.obj._id){
						return true
					}
					return false
				})
				let retweets = [...currentUser.retweets];
				await retweets.splice(idx,1);
				const result = await axios.post(`${updateUserRetweets}/${currentUser._id}`,{
					retweets
				})
				setCurrentUser(result.data.obj);
			}
			socket.emit('refetch-post',currentUserTweets[j]._id)
		}else{
			setShowLoginNow(true)
		}
	}

	const followUser = async() => {
		const user = {
			name:currentUser.name,
			id:currentUser._id,
			username:currentUser.username,
			image:currentUser.image
		}
		const gonnaFollow = {
			name:displayUser.name,
			id:displayUser._id,
			username:displayUser.username,
			image:displayUser.image
		}

		const {data} = await axios.get(`${getUserByIdRoute}/${displayUser._id}`);
		let followers = data.user.followers;

		const check = await followers.some(element=>{
			if(element.id === currentUser._id){
				return true;
			}
			return false
		})
		// console.log(check)
		if(check){
			const idx = await displayUser.followers.findIndex(element=>{
				if(element.id === currentUser._id){
					return true
				}
				return false
			})
			const idx2 = await currentUser.following.findIndex(element=>{
				if(element.id === displayUser._id){
					return true
				}
				return false
			})
			// console.log(idx,idx2);
			let followers = [...displayUser.followers];
			await followers.splice(idx,1);
			let following = [...currentUser.following];
			await following.splice(idx2,1);
			const res = await axios.post(`${updateUserFollowers}/${displayUser._id}`,{followers});
			setDisplayUser(res.data.obj);
			const result = await axios.post(`${updateUserFollowing}/${currentUser._id}`,{following});
			setCurrentUser(result.data.obj);
			socket.emit("refetch-user",{
				to:displayUser._id				
			})
		}else{
			const followers = [user,...data.user.followers];
			const following = [gonnaFollow, ...currentUser.following];
			const res = await axios.post(`${updateUserFollowers}/${displayUser._id}`,{followers});
			setDisplayUser(res.data.obj);
			const result = await axios.post(`${updateUserFollowing}/${currentUser._id}`,{following});
			setCurrentUser(result.data.obj);
			socket.emit("refetch-user",{
				to:displayUser._id				
			})
		}
	}


	const deleteThisOwnTweet = async(j) => {
		let tweets = [...currentUser.tweets];
		const idx = await tweets.findIndex(element=>{
			if(element === currentUserTweets[j]._id){
				return true
			}
			return false
		})
		tweets.splice(idx,1);
		setPostLoading(true);
		const res = await axios.post(`${updateUserTweets}/${currentUser._id}`,{
			tweets
		});
		const {data} = await axios.post(removePost,{
			id:currentUserTweets[j]._id
		})
		fetchTweets()

	}

	return (
		<div className="lg:w-[44.6%] relative  md:w-[70%] xs:w-[90%] w-[100%] flex flex-col h-full border-r-[1.3px] border-gray-200 
		dark:border-gray-600 scrollbar-none overflow-y-scroll overflow-x-hidden">
			<div className={`h-full w-full absolute flex items-center justify-center bg-white dark:bg-[#100C08] z-30 ${accountFound && 'hidden'}`}>
				<div className="flex flex-col relative gap-8 w-auto select-none">
					<img src="https://abs.twimg.com/responsive-web/client-web/book-in-bird-cage-400x200.v1.366bcfc9.png" alt=""
					className=""/>
					<div className="flex absolute gap-[10px] top-[100%] flex-col w-full items-center">
						<h1 className="text-3xl md:text-start text-center text-black dark:text-gray-200 font-bold">Account not found</h1>
						<h1 className="text-md text-center md:text-start text-gray-600 dark:text-gray-500">May your idol flew away.</h1>
					</div>
				</div>
			</div>
			<div className="sticky z-40 top-0 gap-8 w-full backdrop-blur-lg z-30 flex items-center hover:bg-gray-100/80 dark:hover:bg-gray-900/80 
			transition-all duration-200 ease-in-out cursor-pointer md:px-4 px-2 py-1 dark:bg-[#100C08]/50 bg-white/50">
				<HiOutlineArrowLeft 
				onClick={()=>{setCurrentWindow('Home');setDisplayUser('')}}
				className="h-[18px] cursor-pointer w-[18px] text-black dark:text-gray-200"/>
				<div className={`flex select-none flex-col ${!accountFound && 'hidden'}`}>
					<h1 className="md:text-xl text-lg text-black dark:text-gray-200 font-semibold">{displayUser?.name}</h1>
					<h1 className="text-md text-gray-500 ">{displayUser?.tweets?.length} Trends</h1>
				</div>
			</div>
			<div className={`h-full w-full backdrop-blur-lg bg-white dark:bg-[#100C08] flex items-center justify-center absolute z-50 ${!loading && 'hidden'}`}>
				<span className="loader3"></span>
			</div>
			<div className="relative w-full lg:h-[210px] md:h-[180px] sm:h-[170px] h-[160px] dark:bg-blue-800/20 bg-blue-200/50">
				{
					displayUser?.backgroundImage ?
					<img src={displayUser?.backgroundImage} alt="" className="lg:h-[210px] md:h-[180px] sm:h-[170px] h-[160px] w-full"/>
					:
					<div className="lg:h-[210px] md:h-[180px] sm:h-[170px] h-[160px] w-full"/>

				}
				<div className="p-1 cursor-pointer absolute lg:-bottom-[36%] md:-bottom-[40%] -bottom-[35%] bg-white dark:bg-[#100C08] rounded-full left-3 md:left-5">
					<img src={displayUser?.image} alt="" className="md:h-[150px] h-[100px] z-10 md:w-[150px] w-[100px] rounded-full"/>
				</div>
			</div>	
			<div className="w-full flex flex-col px-3 md:px-4">
				<div className="flex md:mt-6 mt-3 justify-end w-full">
					{
						ownAccount?
						<button 
						onClick={editProfile}
						className="px-4 py-[6px] rounded-full text-black dark:text-gray-200 font-semibold hover:bg-gray-200/70 dark:hover:bg-gray-800/70 transition-all 
						duration-200 ease-in-out border-[1.5px] border-gray-400/60 dark:border-gray-600/60">
							Edit profile
						</button>
						:
						<button 
						onClick={()=>{
							if(currentUser){
								followUser()
							}else{
								setShowLoginNow(true)
							}
						}}
						className={`px-4 py-[6px] rounded-full ${!currentUser && 'opacity-50' } font-semibold hover:scale-105 active:scale-95 transition-all 
						duration-200 ease-in-out border-[1.5px] border-gray-400/60
						${
							userFollowing ? 'bg-transparent text-black dark:text-gray-200' : 'bg-black text-white dark:bg-gray-200 dark:text-black '
						}
						`}>
							{
								userFollowing ? 'Following' : 'Follow'
							}
						</button>
					}
				</div>
				<div className="flex flex-col mt-6 w-full">
					<h1 className="text-xl truncate font-bold text-black dark:text-gray-200">
						{displayUser?.name}
					</h1>
					<h1 className="text-gray-500 dark:text-gray-400 text-md truncate">@{displayUser?.username}</h1>
					<h1 className={`text-black dark:text-gray-300 text-md ${displayUser?.bio && 'mt-[10px]' }`}>{displayUser?.bio}</h1>
					{
						displayUser?.website &&
						<div className="mt-[7px] flex flex-col gap-[3px]">
							{
								displayUser?.website?.includes(',') ?
								displayUser?.website?.split(',')?.map((web,j)=>(
									<div className="flex items-center gap-[3px]" key={j}>
										<AiOutlineLink className="h-5 w-5 text-gray-600 dark:text-gray-400"/>
										<h1 className="text-sky-600 dark:text-sky-400 hover:underline text-md"><a href={web} target="_blank">{web}</a></h1>
									</div>
								))
								:
								<div className="flex items-center gap-[3px]">
									<AiOutlineLink className="h-5 w-5 text-gray-600 dark:text-gray-400"/>
									<h1 className="text-sky-600 dark:text-sky-400 hover:underline text-md"><a href={displayUser?.website} target="_blank">{displayUser?.website}</a></h1>
								</div>
							}
						</div>
					}
					<div className="mt-[7px] flex items-center gap-[8px]">
						{
							displayUser?.location && 
							<div className="flex items-center gap-[3px]">
								<MdOutlineLocationOn className="h-5 w-5 text-gray-600"/>
								<h1 className="text-gray-500 hover:cursor-pointer text-[16px]">{displayUser?.location}</h1>
							</div>	
						}
						<div className="flex items-center gap-[3px]">
							<AiOutlineCalendar className="h-5 w-5 text-gray-600"/>
							<h1 className="text-gray-500 hover:cursor-pointer text-[16px]">Joined {new Date(displayUser?.createdAt).toDateString().split(' ')[1]} {new Date(displayUser?.createdAt).toDateString().split(' ')[3]}</h1>
						</div>
					</div>
					<div className="flex mt-[14px] md:gap-6 gap-4">
						<h1 
						onClick={()=>{
							setOverlayFor('Following');
							setOpenOverlay(displayUser?.following)
						}}
						className="text-gray-600 dark:text-gray-500 text-md cursor-pointer hover:underline"><span className="text-black dark:text-gray-200">{displayUser?.following?.length}</span> Following</h1>
						<h1 
						onClick={()=>{
							setOverlayFor('Followers');
							setOpenOverlay(displayUser?.followers)
						}}
						className="text-gray-600 dark:text-gray-500 text-md cursor-pointer hover:underline"><span className="text-black dark:text-gray-200">{displayUser?.followers?.length}</span> Followers</h1>
					</div>
				</div>
			</div>
			<div className="mt-3 border-b-[1px] border-gray-200/80 dark:border-gray-800/80 flex items-center w-full">
				{
					headings?.map((head,i)=>(
						<div key={i}
						onClick={()=>{
							if(currentUser){
								setCurrentHeading(head.title)
							}else{
								setShowLoginNow(true)
							}
						}}
						className={`relative whitespace-nowrap w-[100%] px-7 flex items-center justify-center 
						${currentHeading === head.title ? 'text-black dark:text-gray-200':'text-gray-500 dark:text-gray-400'} py-3 
						hover:bg-gray-200/70 dark:hover:bg-gray-800/70 transition-bg duration-200 font-semibold select-none cursor-pointer ease-in-out no_highlights`}>
							{head.title}
							<div className={`absolute bottom-0 w-[50%] rounded-full h-[4px] ${currentHeading === head.title ? 'bg-sky-500':'bg-transparent'}`}/>
						</div>

					))
				}
			</div>
			<div className="flex flex-col w-full relative">
				<div className={`h-full top-0 w-full backdrop-blur-lg bg-white/50 dark:bg-[#100C08]/40 flex items-center justify-center 
				absolute z-20 ${postLoading ? 'right-0' : '-right-[100%]'} transition-all duration-300 ease-in-out`}>
					<span className="loader4">
						<img src="https://ik.imagekit.io/d3kzbpbila/thejashari_QSzOWJHFV?updatedAt=1690659361414" 
						className="absolute -rotate-[45deg] h-[46px] w-[46px] top-0 bottom-0 left-0 right-0 m-auto" alt=""/>
					</span>
				</div>

				{		
					currentHeading === 'Trends' ?
					currentUserTweets?.map((main,j)=>(
						<motion.div 
						initial={{
							opacity:0,
						}}
						whileInView={{opacity:1}}
						transition={{duration:0.4}}
						viewport={{ once: true }}
						key={j} className={`w-full border-b-[1.6px] p-3 flex basis-auto md:gap-4 sm:gap-2 gap-2 
						border-gray-300/70 dark:border-gray-700/70 hover:bg-gray-200/40 dark:hover:bg-gray-900/50 
						transition-all z-0 duration-200 ease-in cursor-pointer no_highlights`}>
							<img 
							onClick={()=>{
								window.history.replaceState({id:100},'Tweet',`?trend=${main._id}`);
								setCurrentWindow('tweet')
							}}
							src={main?.user?.image} alt="" className="rounded-full select-none h-12 w-12 shadow-md hover:shadow-xl hover:shadow-sky-600/30"/>
							<div className="flex flex-col w-full overflow-hidden">
								<div className='flex gap-1 w-full shrink truncate justify-between' >
									<div className="flex gap-1 truncate shrink items-center ">
										<h1 
										onClick={()=>{
											window.history.replaceState({id:100},'Tweet',`?trend=${main._id}`);
											setCurrentWindow('tweet')
										}}
										className="text-lg truncate font-semibold text-black dark:text-gray-200 select-none hover:cursor-pointer hover:underline">
											{main.user.name}
										</h1>
										<h1 
										onClick={()=>{
											window.history.replaceState({id:100},'Tweet',`?trend=${main._id}`);
											setCurrentWindow('tweet')
										}}
										className="text-gray-500 text-md truncate select-none hidden sm:block">@{main.user.username}</h1>
										<h1 
										onClick={()=>{
											window.history.replaceState({id:100},'Tweet',`?trend=${main._id}`);
											setCurrentWindow('tweet')
										}}
										className="text-gray-500 text-md truncate  whitespace-nowrap select-none "> - {
											calDate(main.createdAt)
										}</h1>
									</div>
									<div className="p-1 relative rounded-full md:hover:bg-sky-300/20 dark:md:hover:bg-sky-800/20 transition-all duration-200 ease-in-out group">
										<div 
										id={`post-${j}`}
										onClick={()=>{
											deleteThisOwnTweet(j);
										}}
										className="absolute px-2 py-1 rounded-xl backdrop-blur-lg border-[1px] 
										right-8 z-50 top-0 bottom-0 my-auto flex items-center justify-center border-red-500 
										text-black dark:text-gray-200 hidden font-semibold hover:bg-gray-200/70 dark:hover:bg-gray-800/70 transition-all duration-200 ease-in-out">
											Delete Post
										</div>
										<BsThreeDots 
										onClick={()=>{
											let btn = document.getElementById(`post-${j}`)
											if(btn.classList.value.includes('hidden')){
												btn.classList.remove('hidden');
											}else{
												btn.classList.add('hidden')
											}

										}}
										className="text-gray-500 group-hover:text-sky-500 transition-all duration-200 ease-in-out h-5 w-5"/>
									</div>
								</div>
								<div 
								onClick={()=>{
									window.history.replaceState({id:100},'Tweet',`?trend=${main._id}`);setCurrentWindow('tweet')
								}}
								className="w-full text-lg">
									<h1 className="w-full text-gray-900 dark:text-gray-300 select-none break-words">{main.text}</h1>
								</div>	
								<div 
								onClick={()=>{
									window.history.replaceState({id:100},'Tweet',`?trend=${main._id}`);setCurrentWindow('tweet')
								}}
								className={`rounded-2xl ${main.images.length>0 && 'mt-3'} grid rounded-2xl ${main.images.length>1 ? 'grid-cols-2' : 'grid-cols-1'} gap-1 overflow-hidden`}>
									{
										main.images.length>0 &&
											main.images.map((ur,i)=>(
											<div className="relative group flex items-center justify-center cursor-pointer overflow-hidden" key={i}>
												<div className="absolute h-full w-full z-10 transition-all duration-200 
												ease-in-out group-hover:bg-gray-500/10 dark:group-hover:bg-gray-700/10"/>
												<img src={ur} alt="" className="select-none w-full h-full transition-all duration-300 ease-in-out"/>
											</div>
											))

									}
									{
										main?.videos &&
										<div className="relative rounded-md mt-2 overflow-hidden">												
											<ReactPlayer url={main?.videos} controls={true} width='100%' height='100%'/>								
										</div>
									}
								</div>
								<div className="mt-3 lg:pr-10 md:pr-2 pr-0 justify-between w-full md:w-[85%] lg:w-[100%] xl:w-[90%] flex items-center flex-wrap">
									<div 
									onClick={()=>{
										window.history.replaceState({id:100},'Tweet',`?trend=${main._id}`);
										setCurrentWindow('tweet')
									}}
									className="flex group md:gap-[6px] gap-[3px] items-center">
										<div className="p-[10px] group-hover:bg-sky-300/30 dark:group-hover:bg-sky-700/30 transition-all duration-200 ease-in-out rounded-full">
											<FaRegComment className="h-4 w-4 group-hover:text-sky-500 transition-all duration-200 ease-in-out text-gray-600"/>
										</div>
										<h1 className="text-md text-gray-500 group-hover:text-sky-500">
											{millify(main.comments.length)}
										</h1>
									</div>
									<div 
									onClick={()=>{retweetThisOwnTweet(j);
										if(currentUser){
											makeMeSpin(j)
										}
									}}
									className="flex group md:gap-[6px] gap-[3px] items-center">
										<div className="p-[10px] sm:group-hover:bg-green-300/30 sm:dark:group-hover:bg-green-700/30 active:scale-50 transition-all duration-200 ease-in-out rounded-full">
											<AiOutlineRetweet id={`retweet-${j}`} className={`h-5 group-hover:text-green-500 transition-all duration-200 ease-in-out w-5 text-gray-600
											${main.retweetedBy.some(element=>{
												if(element.id === currentUser?._id){
													return true;
												}
												return false
											}) &&  'text-green-500' }
											`}/>
										</div>
										<h1 className={`text-md text-gray-500
										${main.retweetedBy.some(element=>{
											if(element.id === currentUser?._id){
												return true;
											}
											return false
										}) &&  'text-green-500' }
										group-hover:text-green-500`}>
											{millify(main.retweetedBy.length)}
										</h1>
									</div>
									<div
									onClick={()=>{
										likeThisTweet(j);
										if(currentUser)
											{makeMePink(j)
										}
									}}
									className="flex group md:gap-[6px] gap-[3px] items-center">
										<div className="p-[10px] sm:group-hover:bg-pink-300/30 sm:dark:group-hover:bg-pink-700/30 active:scale-50 transition-all duration-200 ease-in-out rounded-full">
											{
												main?.likes?.some(element=>{
													if(element.id === currentUser?._id){
														return true;
													}
													return false
												}) ? 
												<AiFillHeart id={`like-${j}`} className="h-5 group-hover:text-pink-500 transition-all duration-200 ease-in-out w-5 text-pink-600"/>
												:
												<AiOutlineHeart 
												id={`like-${j}`}
												className="h-5 group-hover:text-pink-500 transition-all duration-200 ease-in-out w-5 text-gray-600"/>
											}
										</div>
										<h1 className={`text-md text-gray-500 group-hover:text-pink-500 
										${main.likes.some(element=>{
											if(element.id === currentUser?._id){
												return true;
											}
											return false
										}) &&  'text-pink-500' }
										`}>
											{millify(main.likes.length)}
										</h1>
									</div>
									<div className="group md:gap-[6px] gap-[3px] hidden xs:flex items-center">
										<div className="p-[10px] group-hover:bg-sky-300/30 dark:group-hover:bg-sky-700/30 transition-all duration-200 ease-in-out rounded-full">
											<BsGraphUpArrow className="h-4 w-4 group-hover:text-sky-500 transition-all duration-200 ease-in-out text-gray-600"/>
										</div>
										<h1 className="text-md text-gray-500 group-hover:text-sky-500">
											{millify(main.views.length)}
										</h1>
									</div>
									<div 
									onClick={()=>{

									}}
									className="flex group md:gap-[6px] gap-[3px] items-center">
										<div className="p-[10px] group-hover:bg-sky-300/30 dark:group-hover:bg-sky-700/30 transition-all duration-200 ease-in-out rounded-full">
											<BsFillShareFill className="h-4 w-4 group-hover:text-sky-500 transition-all duration-200 ease-in-out text-gray-600"/>
										</div>
									</div>
								</div>


							</div>	
						</motion.div>

					))
					:
					currentHeading === 'Likes' ? 
					currentUserLikes?.map((main,j)=>(
						<motion.div 
						initial={{
							opacity:0,
						}}
						whileInView={{opacity:1}}
						transition={{duration:0.4}}
						viewport={{ once: true }}
						key={j} className={`w-full border-b-[1.6px] p-3 flex basis-auto md:gap-4 sm:gap-2 gap-2 
						border-gray-300/70 dark:border-gray-700/70 dark:hover:bg-gray-900/40 hover:bg-gray-200/40 
						transition-all z-0 duration-200 ease-in cursor-pointer no_highlights`}>
							<img onClick={()=>{
								window.history.replaceState({id:100},'Tweet',`?trend=${main._id}`);
								setCurrentWindow('tweet')
							}}
							src={main?.user?.image} alt="" className="rounded-full select-none h-12 w-12 shadow-md hover:shadow-xl hover:shadow-sky-600/30"/>
							<div className="flex flex-col w-full overflow-hidden">
								<div className='flex gap-1 w-full shrink truncate justify-between' >
									<div className="flex gap-1 truncate shrink items-center ">
										<h1 onClick={()=>{
											window.history.replaceState({id:100},'Tweet',`?trend=${main._id}`);
											setCurrentWindow('tweet')
										}}
										className="text-lg truncate font-semibold text-black dark:text-gray-200 select-none hover:cursor-pointer hover:underline">
											{main.user.name}
										</h1>
										<h1 
										onClick={()=>{
											window.history.replaceState({id:100},'Tweet',`?trend=${main._id}`);
											setCurrentWindow('tweet')
										}}
										className="text-gray-500 text-md truncate select-none hidden sm:block">@{main.user.username}</h1>
										<h1 
										onClick={()=>{
											window.history.replaceState({id:100},'Tweet',`?trend=${main._id}`);
											setCurrentWindow('tweet')
										}}
										className="text-gray-500 text-md truncate  whitespace-nowrap select-none "> - {
											calDate(main.createdAt)
										}</h1>
									</div>
									<div className="p-1 rounded-full md:hover:bg-sky-300/20 transition-all duration-200 ease-in-out group">
										<BsThreeDots className="text-gray-500 group-hover:text-sky-500 transition-all duration-200 ease-in-out h-5 w-5"/>
									</div>
								</div>
								<div 
								onClick={()=>{
									window.history.replaceState({id:100},'Tweet',`?trend=${main._id}`);setCurrentWindow('tweet')
								}}
								className="w-full text-lg">
									<h1 className="w-full text-gray-900 dark:text-gray-300 select-none break-words">{main.text}</h1>
								</div>	
								<div 
								onClick={()=>{
									window.history.replaceState({id:100},'Tweet',`?trend=${main._id}`);setCurrentWindow('tweet')
								}}
								className={`rounded-2xl ${main.images.length>0 && 'mt-3'} grid rounded-2xl ${main.images.length>1 ? 'grid-cols-2' : 'grid-cols-1'} gap-1 overflow-hidden`}>
									{
										main.images.length>0 &&
											main.images.map((ur,i)=>(
											<div className="relative group flex items-center justify-center cursor-pointer overflow-hidden" key={i}>
												<div className="absolute h-full w-full z-10 transition-all duration-200 
												ease-in-out group-hover:bg-gray-500/10 dark:group-hover:bg-gray-700/10"/>
												<img src={ur} alt="" className="select-none w-full h-full transition-all duration-300 ease-in-out"/>
											</div>
											))

									}
									{
										main?.videos &&
										<div className="relative rounded-md mt-2 overflow-hidden">												
											<ReactPlayer url={main?.videos} controls={true} width='100%' height='100%'/>								
										</div>
									}
								</div>
								<div className="mt-3 lg:pr-10 md:pr-2 pr-0 justify-between w-full md:w-[85%] lg:w-[100%] xl:w-[90%] flex items-center flex-wrap">
									<div 
									onClick={()=>{
										window.history.replaceState({id:100},'Tweet',`?trend=${main._id}`);
										setCurrentWindow('tweet')
									}}
									className="flex group md:gap-[6px] gap-[3px] items-center">
										<div className="p-[10px] group-hover:bg-sky-300/30 dark:group-hover:bg-sky-700/30 transition-all duration-200 ease-in-out rounded-full">
											<FaRegComment className="h-4 w-4 group-hover:text-sky-500 transition-all duration-200 ease-in-out text-gray-600"/>
										</div>
										<h1 className="text-md text-gray-500 group-hover:text-sky-500">
											{millify(main.comments.length)}
										</h1>
									</div>
									<div 
									onClick={()=>retweetThisLikedTweet(j)}
									className="flex group md:gap-[6px] gap-[3px] items-center">
										<div className="p-[10px] sm:group-hover:bg-green-300/30 sm:dark:group-hover:bg-green-700/30 active:scale-50 transition-all duration-200 ease-in-out rounded-full">
											<AiOutlineRetweet className={`h-5 group-hover:text-green-500 transition-all duration-200 ease-in-out w-5 text-gray-600
											${main.retweetedBy.some(element=>{
												if(element.id === currentUser?._id){
													return true;
												}
												return false
											}) &&  'text-green-500' }
											`}/>
										</div>
										<h1 className={`text-md text-gray-500
										${main.retweetedBy.some(element=>{
											if(element.id === currentUser?._id){
												return true;
											}
											return false
										}) &&  'text-green-500' }
										group-hover:text-green-500`}>
											{millify(main.retweetedBy.length)}
										</h1>
									</div>
									<div
									onClick={()=>{likeThisLikeTweet(j);makeMePink(j)}}
									className="flex group md:gap-[6px] gap-[3px] items-center">
										<div className="p-[10px] sm:group-hover:bg-pink-300/30 sm:dark:group-hover:bg-pink-700/30 active:scale-50 transition-all duration-200 ease-in-out rounded-full">
											{
												main.likes.some(element=>{
													if(element.id === currentUser?._id){
														return true;
													}
													return false
												}) ? 
												<AiFillHeart id={`like-${j}`} className="h-5 group-hover:text-pink-500 transition-all duration-200 ease-in-out w-5 text-pink-600"/>
												:
												<AiOutlineHeart 
												id={`like-${j}`}
												className="h-5 group-hover:text-pink-500 transition-all duration-200 ease-in-out w-5 text-gray-600"/>
											}
										</div>
										<h1 className={`text-md text-gray-500 group-hover:text-pink-500 
										${main.likes.some(element=>{
											if(element.id === currentUser?._id){
												return true;
											}
											return false
										}) &&  'text-pink-500' }
										`}>
											{millify(main.likes.length)}
										</h1>
									</div>
									<div className="group md:gap-[6px] gap-[3px] hidden xs:flex items-center">
										<div className="p-[10px] group-hover:bg-sky-300/30 dark:group-hover:bg-sky-700/30 transition-all duration-200 ease-in-out rounded-full">
											<BsGraphUpArrow className="h-4 w-4 group-hover:text-sky-500 transition-all duration-200 ease-in-out text-gray-600"/>
										</div>
										<h1 className="text-md text-gray-500 group-hover:text-sky-500">
											{millify(main.views.length)}
										</h1>
									</div>
									<div 
									onClick={()=>{

									}}
									className="flex group md:gap-[6px] gap-[3px] items-center">
										<div className="p-[10px] group-hover:bg-sky-300/30 group-hover:bg-sky-700/30 transition-all duration-200 ease-in-out rounded-full">
											<BsFillShareFill className="h-4 w-4 group-hover:text-sky-500 transition-all duration-200 ease-in-out text-gray-600"/>
										</div>
									</div>
								</div>


							</div>	
						</motion.div>

					))
					:
					currentUserRetweets?.map((main,j)=>(
						<motion.div 
						initial={{
							opacity:0,
						}}
						whileInView={{opacity:1}}
						transition={{duration:0.4}}
						viewport={{ once: true }}
						key={j} className={`w-full border-b-[1.6px] p-3 pt-7 relative flex basis-auto md:gap-4 sm:gap-2 gap-2 
						border-gray-300/70 dark:border-gray-700/70 dark:hover:bg-gray-900/40 hover:bg-gray-200/40 
						transition-all z-0 duration-200 ease-in cursor-pointer no_highlights`}>
						<div 
						onClick={()=>{
							setCurrentWindow('Profile')
							window.history.replaceState({id:100},'Default',`?profile=${displayUser._id}`);
						}}
						className="absolute hover:underline top-1 left-[10%] flex items-center text-sm font-semibold gap-[10px] dark:text-gray-500 text-gray-600">
							<AiOutlineRetweet className="h-4 w-4"/> {
								ownAccount ? 'You Retweeted' : `Retrend by ${displayUser?.name}`
							}
						</div>
							<img onClick={()=>{
								window.history.replaceState({id:100},'Tweet',`?trend=${main._id}`);
								setCurrentWindow('tweet')
							}}
							src={main?.user?.image} alt="" className="rounded-full select-none h-12 w-12 shadow-md hover:shadow-xl hover:shadow-sky-600/30"/>
							<div className="flex flex-col w-full overflow-hidden">
								<div className='flex gap-1 w-full shrink truncate justify-between' >
									<div className="flex gap-1 truncate shrink items-center ">
										<h1 onClick={()=>{
											window.history.replaceState({id:100},'Tweet',`?trend=${main._id}`);
											setCurrentWindow('tweet')
										}}
										className="text-lg truncate font-semibold text-black dark:text-gray-200 select-none hover:cursor-pointer hover:underline">
											{main.user.name}
										</h1>
										<h1 
										onClick={()=>{
											window.history.replaceState({id:100},'Tweet',`?trend=${main._id}`);
											setCurrentWindow('tweet')
										}}
										className="text-gray-500 text-md truncate select-none hidden sm:block">@{main.user.username}</h1>
										<h1 
										onClick={()=>{
											window.history.replaceState({id:100},'Tweet',`?trend=${main._id}`);
											setCurrentWindow('tweet')
										}}
										className="text-gray-500 text-md truncate  whitespace-nowrap select-none "> - {
											calDate(main.createdAt)
										}</h1>
									</div>
									<div className="p-1 rounded-full md:hover:bg-sky-300/20 dark:md:hover:bg-sky-700/20 transition-all duration-200 ease-in-out group">
										<BsThreeDots className="text-gray-500 group-hover:text-sky-500 transition-all duration-200 ease-in-out h-5 w-5"/>
									</div>
								</div>
								<div 
								onClick={()=>{
									window.history.replaceState({id:100},'Tweet',`?trend=${main._id}`);setCurrentWindow('tweet')
								}}
								className="w-full text-lg">
									<h1 className="w-full text-gray-900 select-none dark:text-gray-200 break-words">{main.text}</h1>
								</div>	
								<div 
								onClick={()=>{
									window.history.replaceState({id:100},'Tweet',`?trend=${main._id}`);setCurrentWindow('tweet')
								}}
								className={`rounded-2xl ${main.images.length>0 && 'mt-3'} grid rounded-2xl ${main.images.length>1 ? 'grid-cols-2' : 'grid-cols-1'} gap-1 overflow-hidden`}>
									{
										main.images.length>0 &&
											main.images.map((ur,i)=>(
											<div className="relative group flex items-center justify-center cursor-pointer overflow-hidden" key={i}>
												<div className="absolute h-full w-full z-10 transition-all duration-200 
												ease-in-out group-hover:bg-gray-500/10 dark:group-hover:bg-gray-700/10 "/>
												<img src={ur} alt="" className="select-none w-full h-full transition-all duration-300 ease-in-out"/>
											</div>
											))

									}
									{
										main?.videos &&
										<div className="relative rounded-md mt-2 overflow-hidden">												
											<ReactPlayer url={main?.videos} controls={true} width='100%' height='100%'/>								
										</div>
									}
								</div>
								<div className="mt-3 lg:pr-10 md:pr-2 pr-0 justify-between w-full md:w-[85%] lg:w-[100%] xl:w-[90%] flex items-center flex-wrap">
									<div 
									onClick={()=>{
										window.history.replaceState({id:100},'Tweet',`?trend=${main._id}`);
										setCurrentWindow('tweet')
									}}
									className="flex group md:gap-[6px] gap-[3px] items-center">
										<div className="p-[10px] group-hover:bg-sky-300/30 dark:group-hover:bg-sky-700/30 transition-all duration-200 ease-in-out rounded-full">
											<FaRegComment className="h-4 w-4 group-hover:text-sky-500 transition-all duration-200 ease-in-out text-gray-600"/>
										</div>
										<h1 className="text-md text-gray-500 group-hover:text-sky-500">
											{millify(main.comments.length)}
										</h1>
									</div>
									<div 
									onClick={()=>retweetThisTweet(j)}
									className="flex group md:gap-[6px] gap-[3px] items-center">
										<div className="p-[10px] sm:group-hover:bg-green-300/30 sm:dark:group-hover:bg-green-700/30 active:scale-50 transition-all duration-200 ease-in-out rounded-full">
											<AiOutlineRetweet className={`h-5 group-hover:text-green-500 transition-all duration-200 ease-in-out w-5 text-gray-600
											${main.retweetedBy.some(element=>{
												if(element.id === currentUser?._id){
													return true;
												}
												return false
											}) &&  'text-green-500' }
											`}/>
										</div>
										<h1 className={`text-md text-gray-500
										${main.retweetedBy.some(element=>{
											if(element.id === currentUser?._id){
												return true;
											}
											return false
										}) &&  'text-green-500' }
										group-hover:text-green-500`}>
											{millify(main.retweetedBy.length)}
										</h1>
									</div>
									<div
									onClick={()=>{likeThisRetweet(j);makeMePink(j)}}
									className="flex group md:gap-[6px] gap-[3px] items-center">
										<div className="p-[10px] sm:group-hover:bg-pink-300/30 sm:dark:group-hover:bg-pink-700/30 active:scale-50 transition-all duration-200 ease-in-out rounded-full">
											{
												main.likes.some(element=>{
													if(element.id === currentUser?._id){
														return true;
													}
													return false
												}) ? 
												<AiFillHeart id={`like-${j}`} className="h-5 group-hover:text-pink-500 transition-all duration-200 ease-in-out w-5 text-pink-600"/>
												:
												<AiOutlineHeart 
												id={`like-${j}`}
												className="h-5 group-hover:text-pink-500 transition-all duration-200 ease-in-out w-5 text-gray-600"/>
											}
										</div>
										<h1 className={`text-md text-gray-500 group-hover:text-pink-500 
										${main.likes.some(element=>{
											if(element.id === currentUser?._id){
												return true;
											}
											return false
										}) &&  'text-pink-500' }
										`}>
											{millify(main.likes.length)}
										</h1>
									</div>
									<div className="group md:gap-[6px] gap-[3px] hidden xs:flex items-center">
										<div className="p-[10px] group-hover:bg-sky-300/30 dark:group-hover:bg-sky-700/30 transition-all duration-200 ease-in-out rounded-full">
											<BsGraphUpArrow className="h-4 w-4 group-hover:text-sky-500 transition-all duration-200 ease-in-out text-gray-600"/>
										</div>
										<h1 className="text-md text-gray-500 group-hover:text-sky-500">
											{millify(main.views.length)}
										</h1>
									</div>
									<div 
									onClick={()=>{

									}}
									className="flex group md:gap-[6px] gap-[3px] items-center">
										<div className="p-[10px] group-hover:bg-sky-300/30 dark:group-hover:bg-sky-700/30 transition-all duration-200 ease-in-out rounded-full">
											<BsFillShareFill className="h-4 w-4 group-hover:text-sky-500 transition-all duration-200 ease-in-out text-gray-600"/>
										</div>
									</div>
								</div>


							</div>	
						</motion.div>

					))
				}
				<motion.div 
				initial={{
					opacity:0,
				}}
				whileInView={{opacity:1}}
				transition={{duration:0.4}}
				viewport={{ once: true }}
				className={`h-full bg-sky-100/30 dark:bg-gray-800/30 pt-14 w-full flex flex-col items-center justify-center`} >
					<div class="iloader"></div>
				</motion.div>
			</div>
		</div>

	)
}
