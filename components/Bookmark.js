import {useState,useEffect} from 'react';
import {useRecoilState} from 'recoil'
import {currentChatState,currentUserState} from '../atoms/userAtom'
import {getPostByIdRoute,updatedPostRoute,updateUser,updateUserBookmarks,updateUserRetweets} from '../utils/ApiRoutes';
import axios from 'axios';
import EmojiPicker from 'emoji-picker-react';
import DateDiff from 'date-diff';
import millify from 'millify';
import {BsCardImage,BsGraphUpArrow,BsFillShareFill,BsThreeDots} from 'react-icons/bs';
import {AiOutlineRetweet,AiOutlineHeart,AiFillHeart} from 'react-icons/ai';
import {TbGif} from 'react-icons/tb';
import {FaRegComment} from 'react-icons/fa';
import TweetCard from './TweetCard';

export default function Bookmark({currentWindow,setCurrentWindow,openOverlay,setOpenOverlay,
	setOverlayFor,OverlayFor}) {
	// body...
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [bookmarkTweets,setBookmarkTweets] = useState([]);
	const [loading,setLoading] = useState(false);	

	useEffect(()=>{
		if(currentUser){
			fetchBookmarks()
		}
	},[currentUser]);

	const makeMePink = (j) => {
		const element = document.getElementById(`like-${j}`)
		element.classList.add('text-pink-500','animate-bounce')		
	}

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
			const res = splitres[1] + " " + splitres[2]
			return res
		} 
	}

	const fetchBookmarks = async() => {
		if(currentUser?.bookmarks?.length>0){
			setLoading(true)
			setBookmarkTweets([]);
			for(let i = 0; i<currentUser?.bookmarks?.length; i++){
				const {data} = await axios.get(`${getPostByIdRoute}/${currentUser.bookmarks[i]}`);
				if(data?.post[0]){
					setBookmarkTweets(bookmarkTweets=>[...bookmarkTweets,data.post[0]]);
				}
				if(i+1 === currentUser?.bookmarks?.length){
					setLoading(false);
				}
			}	
		}
	}

	const makeMeSpin = (j) => {
		const element = document.getElementById(`retweet-${j}`)
		element.classList.add('animate-bounce');
	}

	const retweetThisTweet = async(j) => {
		if(currentUser){
			const {data} = await axios.get(`${getPostByIdRoute}/${bookmarkTweets[j]._id}`);
			if(data?.post[0]){
				const post = data.post[0];
				let retweetedBy = post.retweetedBy;
				const user = {
					name:currentUser.name,
					id:currentUser._id,
					username:currentUser.username,
					image:currentUser.image
				}
				// console.log(likes,user)
				const check = retweetedBy.some(element=>{
					if(element.id === user.id){
						return true;
					}
					return false
				})
				// console.log(check)
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
				const res = await axios.post(`${updatedPostRoute}/${bookmarkTweets[j]._id}`,updatedPost);
				const main = [...bookmarkTweets];
				main[j] = res.data.obj;
				setBookmarkTweets(main);

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
			}
		}
	}

	const likeThisTweet = async(j) => {
		if(currentUser){
			const {data} = await axios.get(`${getPostByIdRoute}/${bookmarkTweets[j]._id}`);
			if(data?.post[0]){
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
				const res = await axios.post(`${updatedPostRoute}/${bookmarkTweets[j]._id}`,updatedPost);
				const main = [...bookmarkTweets];
				main[j] = res.data.obj;
				setBookmarkTweets(main);

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
			}
		}
	}

	const viewThisTweet = async(j) => {
		if(currentUser){
			const {data} = await axios.get(`${getPostByIdRoute}/${bookmarkTweets[j]._id}`);
			if(data.post[0]){
				const post = data.post[0];
				let views = post.views;
				const check = views.some(element=>{
					if(element === currentUser._id){
						return true;
					}
					return false
				})
				if(!check){
					views.push(currentUser._id);
					const updatedPost = {...post, 'views':views}
					const res = await axios.post(`${updatedPostRoute}/${bookmarkTweets[j]._id}`,updatedPost);
					let main = [...bookmarkTweets];
					main[j] = res.data.obj;
					setMainFeed(main);
				}				
			}
		}
	}

	return(
		<div className="lg:w-[44.6%] relative  md:w-[70%] xs:w-[90%] w-[100%] flex flex-col h-full border-r-[1.3px] border-gray-200 dark:border-gray-600 scrollbar-none overflow-y-scroll">
			<div className="sticky top-0 gap-8 w-full backdrop-blur-lg z-30 flex items-center md:px-4 px-2 py-1 hover:bg-gray-100/80 dark:hover:bg-gray-900/80 
			transition-all duration-200 ease-in-out cursor-pointer bg-white/50 dark:bg-[#100C08]/50">
				<div className="flex flex-col select-none">
					<h1 className="text-xl text-black font-semibold dark:text-gray-200">Bookmarks</h1>
					<h1 className="text-sm text-gray-500 ">@{currentUser?.username}</h1>
				</div>
			</div>
			<div className={`h-full w-full backdrop-blur-lg bg-white dark:bg-[#100C08] flex items-center justify-center absolute z-50 ${!loading && 'hidden'}`}>
				<span class="loader3"></span>
			</div>
			<div className="flex flex-col w-full mb-10 h-full">
				{
					bookmarkTweets?.length > 0 ?
					<div className="flex flex-col w-full mb-10 h-full">
						{
							bookmarkTweets.map((main,j)=>(
								<TweetCard main={main} j={j} key={j} setCurrentWindow={setCurrentWindow} calDate={calDate} 
								currentWindow={currentWindow} BsThreeDots={BsThreeDots} FaRegComment={FaRegComment} millify={millify} AiOutlineRetweet={AiOutlineRetweet}
								retweetThisTweet={retweetThisTweet} makeMeSpin={makeMeSpin} likeThisTweet={likeThisTweet} makeMePink={makeMePink}
								AiFillHeart={AiFillHeart} AiOutlineHeart={AiOutlineHeart} currentUser={currentUser}
								BsGraphUpArrow={BsGraphUpArrow} BsFillShareFill={BsFillShareFill} viewThisTweet={viewThisTweet}
								/>
							))
						}
					</div>
					:
					<div className="h-full w-full flex items-center justify-center">
						<div className="flex flex-col relative gap-8 w-auto select-none">
							<img src="https://abs.twimg.com/responsive-web/client-web/book-in-bird-cage-400x200.v1.366bcfc9.png" alt=""
							className=""/>
							<div className="flex px-5 gap-[10px] flex-col">
								<h1 className="text-3xl md:text-start text-center dark:text-gray-200 text-black font-bold">Save trends for later</h1>
								<h1 className="text-md text-center md:text-start text-gray-600">Don’t let the good ones fly away! Bookmark Trends to easily find them again in the future.</h1>
							</div>
						</div>
					</div>
				}

			</div>

		</div>


	)
}




// <div key={j} className={`w-full ${j===0 ? 'border-b-[1.6px]':'border-y-[1.6px]'} p-3 flex basis-auto md:gap-4 sm:gap-2 gap-2 
// border-gray-300/70 hover:bg-gray-200/40 dark:hover:bg-gray-900/40 dark:border-gray-800/70 transition-all no_highlights
// z-0 duration-200 ease-in cursor-pointer`}>
// 	<img src={main.user.image} alt="" className="rounded-full select-none h-12 w-12 shadow-md hover:shadow-xl hover:shadow-sky-600/30"/>
// 	<div className="flex flex-col w-full overflow-hidden">
// 		<div className='flex gap-1 w-full shrink truncate justify-between' >
// 			<div className="flex gap-1 truncate shrink items-center ">
// 				<h1 
// 				onClick={()=>{
// 					setCurrentWindow('Profile')
// 					window.history.replaceState({id:100},'Default',`?profile=${main?.user?.id}`);
// 				}}
// 				className="text-lg truncate font-semibold text-black dark:text-gray-200 select-none hover:cursor-pointer hover:underline">
// 					{main?.user?.name}
// 				</h1>
// 				<h1 
// 				onClick={()=>{
// 					setCurrentWindow('Profile')
// 					window.history.replaceState({id:100},'Default',`?profile=${main?.user?.id}`);
// 				}}
// 				className="text-gray-500 text-md truncate select-none hidden sm:block">@{main.user.username}</h1>
// 				<h1 
// 				onClick={()=>{
// 					window.history.replaceState({id:100},'Tweet',`?trend=${main._id}`);
// 					setCurrentWindow('tweet')
// 				}}
// 				className="text-gray-500 text-md truncate  whitespace-nowrap select-none "> - {
// 					calDate(main.createdAt)
// 				}</h1>
// 			</div>
// 			<div className="p-1 rounded-full md:hover:bg-sky-300/20 transition-all duration-200 ease-in-out group">
// 				<BsThreeDots className="text-gray-500 group-hover:text-sky-500 transition-all duration-200 ease-in-out h-5 w-5"/>
// 			</div>
// 		</div>
// 		<div 
// 		onClick={()=>{
// 			window.history.replaceState({id:100},'Tweet',`?trend=${main._id}`);setCurrentWindow('tweet')
// 		}}
// 		className="w-full text-lg">
// 			<h1 className="w-full text-gray-900 dark:text-gray-200 select-none break-words">{main.text}</h1>
// 		</div>	
// 		<div 
// 		onClick={()=>{
// 			window.history.replaceState({id:100},'Tweet',`?trend=${main._id}`);setCurrentWindow('tweet')
// 		}}
// 		className={`rounded-2xl ${main.images.length>0 && 'mt-3'} grid rounded-2xl ${main.images.length>1 ? 'grid-cols-2' : 'grid-cols-1'} gap-1 overflow-hidden`}>
// 			{
// 				main.images.length>0 &&
// 					main.images.map((ur,i)=>(
// 					<div className="relative group flex items-center justify-center cursor-pointer overflow-hidden" key={i}>
// 						<div className="absolute h-full w-full z-10 transition-all duration-200 
// 						ease-in-out group-hover:bg-gray-500/10"/>
// 						<img src={ur} alt="" className="select-none w-full aspect-square transition-all duration-300 ease-in-out"/>
// 					</div>
// 					))

// 			}
// 		</div>
// 		<div className="mt-3 lg:pr-10 md:pr-2 pr-0 justify-between w-full md:w-[85%] lg:w-[100%] xl:w-[90%] flex items-center flex-wrap">
// 			<div 
// 			onClick={()=>{
// 				window.history.replaceState({id:100},'Tweet',`?trend=${main._id}`);
// 				setCurrentWindow('tweet')
// 			}}
// 			className="flex group md:gap-[6px] gap-[3px] items-center">
// 				<div className="p-[10px] group-hover:bg-sky-300/30 dark:group-hover:bg-sky-800/30 transition-all duration-200 ease-in-out rounded-full">
// 					<FaRegComment className="h-4 w-4 group-hover:text-sky-500 transition-all duration-200 ease-in-out text-gray-600"/>
// 				</div>
// 				<h1 className="text-md text-gray-500 group-hover:text-sky-500">
// 					{millify(main.comments.length)}
// 				</h1>
// 			</div>
// 			<div 
// 			onClick={()=>{retweetThisTweet(j);makeMeSpin(j)}}
// 			className="flex group md:gap-[6px] gap-[3px] items-center">
// 				<div className="p-[10px] group-hover:bg-green-300/30 dark:group-hover:bg-green-800/30 transition-all duration-200 ease-in-out rounded-full">
// 					<AiOutlineRetweet id={`retweet-${j}`} className={`h-5 group-hover:text-green-500 transition-all duration-200 ease-in-out w-5 text-gray-600
// 					${main.retweetedBy.some(element=>{
// 						if(element.id === currentUser?._id){
// 							return true;
// 						}
// 						return false
// 					}) &&  'text-green-500' }
// 					`}/>
// 				</div>
// 				<h1 className={`text-md text-gray-500
// 				${main.retweetedBy.some(element=>{
// 					if(element.id === currentUser?._id){
// 						return true;
// 					}
// 					return false
// 				}) &&  'text-green-500' }
// 				group-hover:text-green-500`}>
// 					{millify(main.retweetedBy.length)}
// 				</h1>
// 			</div>
// 			<div
// 			onClick={()=>{likeThisTweet(j);makeMePink(j)}}
// 			className="flex group md:gap-[6px] gap-[3px] items-center">
// 				<div className="p-[10px] group-hover:bg-pink-300/30 dark:group-hover:bg-pink-800/30 transition-all duration-200 ease-in-out rounded-full">
// 					{
// 						main.likes.some(element=>{
// 							if(element.id === currentUser?._id){
// 								return true;
// 							}
// 							return false
// 						}) ? 
// 						<AiFillHeart id={`like-${j}`} className="h-5 group-hover:text-pink-500 transition-all duration-200 ease-in-out w-5 text-pink-600"/>
// 						:
// 						<AiOutlineHeart 
// 						id={`like-${j}`}
// 						className="h-5 group-hover:text-pink-500 transition-all duration-200 ease-in-out w-5 text-gray-600"/>
// 					}
// 				</div>
// 				<h1 className={`text-md text-gray-500 group-hover:text-pink-500 
// 				${main.likes.some(element=>{
// 					if(element.id === currentUser?._id){
// 						return true;
// 					}
// 					return false
// 				}) &&  'text-pink-500' }
// 				`}>
// 					{millify(main.likes.length)}
// 				</h1>
// 			</div>
// 			<div className="group md:gap-[6px] gap-[3px] hidden xs:flex items-center">
// 				<div className="p-[10px] group-hover:bg-sky-300/30 dark:group-hover:bg-sky-800/30 transition-all duration-200 ease-in-out rounded-full">
// 					<BsGraphUpArrow className="h-4 w-4 group-hover:text-sky-500 transition-all duration-200 ease-in-out text-gray-600"/>
// 				</div>
// 				<h1 className="text-md text-gray-500 group-hover:text-sky-500">
// 					{millify(main.views.length)}
// 				</h1>
// 			</div>
// 			<div 
// 			onClick={()=>{

// 			}}
// 			className="flex group md:gap-[6px] gap-[3px] items-center">
// 				<div className="p-[10px] group-hover:bg-sky-300/30 dark:group-hover:bg-sky-800/30 transition-all duration-200 ease-in-out rounded-full">
// 					<BsFillShareFill className="h-4 w-4 group-hover:text-sky-500 transition-all duration-200 ease-in-out text-gray-600"/>
// 				</div>
// 			</div>
// 		</div>


// 	</div>	
// </div>