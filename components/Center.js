import {FiChevronDown,FiChevronUp} from 'react-icons/fi';
import {useState,useEffect,useRef} from 'react';
import {BsCardImage,BsEmojiSmile,BsGraphUpArrow,BsFillShareFill,BsThreeDots,BsFillPeopleFill} from 'react-icons/bs';
import {AiOutlineRetweet,AiOutlineHeart,AiFillHeart} from 'react-icons/ai';
import {TbGif} from 'react-icons/tb';
import {FaRegComment} from 'react-icons/fa';
import {useRecoilState} from 'recoil';
import {BiWorld} from 'react-icons/bi';
import {currentChatState,homeState,currentUserState,showLoginNowState,mainFeedState,
loaderState,sidebarState,followingFeedState,forYouState,bottomHideState} from '../atoms/userAtom'
import {MdSchedule} from 'react-icons/md'
import {HiOutlineLocationMarker} from 'react-icons/hi';
import {createTweet,getAllPosts,getPostByIdRoute,updatedPostRoute,
	updateUser,updateUserTweets,updateUserRetweets,getAllFollowingPosts} from '../utils/ApiRoutes';
import axios from 'axios'
import {RxCross2} from 'react-icons/rx';
import millify from 'millify';
import ImageKit from "imagekit";
import EmojiPicker from 'emoji-picker-react';
import DateDiff from 'date-diff';
import {socket} from '../service/socket';
import TweetCard from './TweetCard'


let imageUrl = [];

export default function Center({setCurrentWindow,currentWindow}) {
	// body...
	const [home,setHome] = useRecoilState(homeState);
	const [currentChat,setCurrentChat] = useRecoilState(currentChatState);
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [showLoginNow,setShowLoginNow] = useRecoilState(showLoginNowState);
	const [mainFeed,setMainFeed] = useRecoilState(mainFeedState);
	const [foryou,setForyou] = useRecoilState(forYouState);
	const [followingFeed,setFollowingFeed] = useRecoilState(followingFeedState);
	const [tweetText,setTweetText] = useState('');	
	const [path,setPath] = useState('');
	const [url,setUrl] = useState([]);
	const [url2,setUrl2] = useState('');
	const [refreshPost,setRefreshPost] = useState('');
	const [loader,setLoader] = useRecoilState(loaderState);
	const [loading,setLoading] = useState(false);
	const ref = useRef()
	const [emojiInput,setEmojiInput] = useState(false);
	const [openSidebar,setOpenSidebar] = useRecoilState(sidebarState);
  	const [bottomHide,setBottomHide] = useRecoilState(bottomHideState)	
	const [mainFeedNotAdded,setMainFeedNotAdded] = useState(true);
	const [tweetPublic,setTweetPublic] = useState(true);
	const [openTweetVisiblityTab,setOpenTweetVisiblityTab] = useState(false)

	const imagekit = new ImageKit({
	    publicKey : process.env.NEXT_PUBLIC_IMAGEKIT_ID,
	    privateKey : process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE,
	    urlEndpoint : process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT
	});

	const pathCheck = (path) =>{
		if(path){
			if(path.split('.').includes('jpg')){
				return true;
			}else if(path.split('.').includes('jpeg')){
				return true;
			}else if(path.split('.').includes('png')){
				return true;
			}
		}
	}

	useEffect(()=>{
		if(home === 'For you'){
			setMainFeed(foryou);
		}else{
			setMainFeed(followingFeed);
		}
	},[home,foryou,followingFeed])

	useEffect(()=>{
		let ele = document.getElementById('tweetCardArea');
		let startY = 0;
		let scrollY = 0;

		ele.addEventListener('touchstart', function(e) {
		  startY = e.touches[0].clientY;
		});

		ele.addEventListener('touchmove', function(e) {
		  scrollY = startY - e.touches[0].clientY;
		  if(scrollY > 40){
		  	setBottomHide(true)
		  }
		  if(scrollY < -40){		  	
		  	setBottomHide(false)
		  }
		});
	},[])

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

	const uploadImage = (i=0) => {

		imagekit.upload({
		    file : url[i], //required
		    folder:"Images",
		    fileName : 'x-bird', 
		    extensions: [
		        {
		            name: "google-auto-tagging",
		            maxTags: 5,
		            minConfidence: 95
		        }
	    	]  //required
		}).then(response => {
			if(i+1 === url.length){
				tweetNow([...imageUrl,response.url])
				imageUrl = [...imageUrl,response.url];	
			}else{
				imageUrl = [...imageUrl,response.url];
				uploadImage(i+1)
			}
		}).catch(error => {
		    console.log(error.message)
		});
	}

	useEffect(()=>{
		socket.on('refetch-post',(data)=>{
			// refreshPost(data);
			setRefreshPost(data)
		})
		return ()=>{
			socket.off('refetch-post')
		}

	},[])

	useEffect(()=>{
		if(refreshPost){
			refetchPost(refreshPost);
			setRefreshPost('');
		}
	},[refreshPost])



	const removeImage = (i) => {
		let newArr = [...url];
		newArr.splice(i,1);
		setUrl(newArr);
	}

	useEffect(()=>{
		const image_input = document.querySelector('#file1');
		if(image_input){
			setPath('');
			image_input.addEventListener('change',()=>{
				const reader = new FileReader();
			
				reader.addEventListener('load',()=>{
					setUrl2(reader.result);
				});
				reader.readAsDataURL(image_input.files[0]);
			})
		}
	
	},[path])

	useEffect(()=>{
		fetchTimeLine();
		if(currentUser){
			fetchFollowingFeed();
		}
	},[])
 	
 	const fetchFollowingFeed = async() => {
		const following = currentUser?.following
		const {data} = await axios.post(getAllFollowingPosts,{
			following
		})
		let followFeed = [...data?.postsWithData, ...foryou];
		setFollowingFeed(followFeed);
	}

	const addFollowFeedWithForYou = async() => {
		if(mainFeedNotAdded){
			let followFeed = [...followingFeed, ...foryou];
			setFollowingFeed(followFeed);
			setMainFeedNotAdded(false)
		}
	}

	const fetchTimeLine = async() => {
		const {data} = await axios.post(getAllPosts,{
			categories:currentUser?.categories
		});
		if(data?.postsWithData){
			const result = data?.postsWithData
			setMainFeed(result);
			setForyou(result);
		}else{
			const result = data?.data?.reverse()
			setMainFeed(result);
			setForyou(result);
		}
	}

	useEffect(()=>{
		function autoResize() {
			this.style.height = 'auto',
			this.style.height = this.scrollHeight + 'px'
		}
		const ele = document.getElementById('tweetArea');
		if(ele){
			ele.addEventListener('input',autoResize,false);
		}

	},[])

	useEffect(()=>{
		if(url2 && url.length<4){
			setUrl(url=>[...url,url2]);
			setUrl2('')
		}
	},[url2])

	const openFileInput = () => {
		if(url.length<4){
			document.getElementById('file1').click();
		}
	}

	const tweet = async() => {
		if(currentUser){
			if(tweetText.length > 2 || url.length>0){
				setLoader(true);
				if(url.length>0){
					uploadImage()				
				}else{
					tweetNow();
				}
			}			
		}
	}

	const tweetNow = async(imageArray) => {
		const text = tweetText || '';
		const user = {
			id:currentUser._id,
			name:currentUser.name,
			image:currentUser.image,
			username:currentUser.username
		}	
		const images = url.length>0 ? imageArray : [];	
		const {data} = await axios.post(createTweet,{text,user,images,public:tweetPublic});
		setUrl([]);
		imageUrl = []
		setTweetText('');
		setLoader(false);
		setMainFeed(mainFeed=>[data.post,...mainFeed]);
		const tweets = [data.post._id,...currentUser.tweets]
		const res = await axios.post(`${updateUserTweets}/${currentUser._id}`,{
			tweets
		})
		setCurrentUser(res.data.obj);
	}

	const makeMePink = (j) => {
		const element = document.getElementById(`like-${j}`)		
	}

	const makeMeSpin = (j) => {
		const element = document.getElementById(`retweet-${j}`)
		element.classList.add('animate-bounce');
	}

	const refetchPost = async(data2) => {
		if(data2){
			// console.log(data2,mainFeed)
			const idx = await mainFeed.findIndex(element=>{
				// console.log(element._id,' ',data2)
				if(element._id === data2){
					return true
				}
				return false
			})
			// console.log(idx)
			const {data} = await axios.get(`${getPostByIdRoute}/${mainFeed[idx]._id}`);
			const post = data.post[0];
			let posts = [...mainFeed];
			posts[idx] = post;
			setMainFeed(posts)
		}
	}

	const likeThisTweet = async(j) => {
		if(currentUser){
			const {data} = await axios.get(`${getPostByIdRoute}/${mainFeed[j]._id}`);
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
			const res = await axios.post(`${updatedPostRoute}/${mainFeed[j]._id}`,updatedPost);
			const main = [...mainFeed];
			main[j] = res.data.obj;
			setMainFeed(main);

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
			socket.emit('refetch-post',mainFeed[j]._id)
			
		}else{
			setShowLoginNow(true)
		}
	}



	const retweetThisTweet = async(j) => {
		if(currentUser){
			const {data} = await axios.get(`${getPostByIdRoute}/${mainFeed[j]._id}`);
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
			const res = await axios.post(`${updatedPostRoute}/${mainFeed[j]._id}`,updatedPost);
			let main = [...mainFeed];
			main[j] = res.data.obj;
			setMainFeed(main);

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
			socket.emit('refetch-post',mainFeed[j]._id)
		}else{
			setShowLoginNow(true)
		}
	}
	

	const viewThisTweet = async(j) => {
		if(currentUser){
			const {data} = await axios.get(`${getPostByIdRoute}/${mainFeed[j]._id}`);
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
				const res = await axios.post(`${updatedPostRoute}/${mainFeed[j]._id}`,updatedPost);
				let main = [...mainFeed];
				main[j] = res.data.obj;
				setMainFeed(main);
			}
		}
	}

	// console.log(currentUser)

	const openEmojiInput = () => setEmojiInput(!emojiInput)


	

	return (
		<div id="tweetCardArea" className={`lg:w-[44.6%] relative md:w-[70%] xs:w-[90%] w-[100%] flex flex-col h-full border-r-[1.3px] border-gray-200
		dark:border-gray-600 scrollbar-none 
		${mainFeed?.length > 0 ? 'overflow-y-scroll' : 'overflow-hidden'} scroll-smooth`}>
			
			{
				currentWindow === 'Home' ?
				<div className="h-full relative w-full " >
					<div className="sticky z-40 top-0 backdrop-blur-md bg-white/50 dark:bg-[#100C08]/50 border-b-[1.3px] dark:border-gray-600 
					border-gray-200 w-full flex flex-col">
						<h1 className="ml-5 xs:block hidden mt-4 text-2xl text-black dark:text-gray-100 font-semibold">
							Home
						</h1>
						<div className="w-full xs:hidden flex items-center pt-3 justify-center">
							<img src={currentUser?.image || 'twitter-icon.png'} 
							onClick={()=>setOpenSidebar(true)}
							className="left-3 absolute top-3 cursor-pointer left-5 h-8 w-8 rounded-full"/>
							<center>
								<img src="twitter-icon.png" className="h-9 cursor-pointer w-9"/>
							</center>
						</div>
						<div className="mt-2 xs:hidden block bg-gray-200/40 dark:bg-gray-800/40 w-full h-[1px]"/>
						<div className="xs:mt-4 mt-2 flex w-full">
							<div 
							onClick={()=>setHome('For you')}
							className={`${currentUser ? 'w-[50%]' : 'w-[100%]' } cursor-pointer sm:hover:bg-gray-200/80 sm:dark:hover:bg-gray-900/60 transition-all duration-200 
							ease-in-out flex items-center justify-center`}>
								<div className={`py-3 border-b-[3px] ${home=== 'For you' ? 'border-sky-600' : 'border-transparent'}`}>
									<h1 className={`text-md select-none font-semibold ${home === 'For you' ? "text-black font-bold dark:text-gray-200" : "text-gray-600"}`}>
										For you
									</h1>
								</div>
							</div>
							{
								currentUser &&
								<div 
								onClick={()=>{setHome('Following');addFollowFeedWithForYou()}}
								className="w-[50%] cursor-pointer sm:hover:bg-gray-200/80 sm:dark:hover:bg-gray-900/60 transition-all duration-200 
								ease-in-out flex items-center justify-center">
									<div className={`py-3 border-b-[3px] ${home=== 'Following' ? 'border-sky-600' : 'border-transparent'}`}>
										<h1 className={`text-md select-none font-semibold ${home === 'Following' ? "text-black font-bold dark:text-gray-200" : "text-gray-600"}`}>
											Following
										</h1>
									</div>
								</div>
							}
						</div>
					</div>	
					<div className={`mt-2 md:px-5 px-3 sm:gap-2 md:gap-4 gap-2 w-full flex border-b-[1.3px] dark:border-gray-600 border-gray-200 ${home !== 'For you' && 'hidden'} ${!currentUser && 'hidden'}`}>
						
						<img src={currentUser?.image} alt="" className="h-12 w-12 hidden select-none sm:block rounded-full"/>
						<div className=" w-full mt-2 flex flex-col">
							<div className="flex">
								<div 
								onClick={()=>setOpenTweetVisiblityTab(!openTweetVisiblityTab)}
								className="cursor-pointer relative rounded-full border-[1px] border-gray-400/60 py-[2px] px-3 gap-2 flex items-center text-sky-500">
									<div className={`absolute ${openTweetVisiblityTab ? 'top-[32px]' : '-top-[1000px]'} z-30 left-0 overflow-hidden transition-all duration-300 ease-in-out rounded-xl flex flex-col
									bg-white dark:bg-gray-800/30 dark:backdrop-blur-lg border-[1.4px] dark:border-gray-700/50 border-gray-300/50`}>
										<div 
										onClick={()=>{setTweetPublic(true);setOpenTweetVisiblityTab(false)}}
										className="px-2 py-1 cursor-pointer hover:bg-gray-200/20 dark:hover:bg-gray-800/70 transition-all duration-200 ease-in-out">
											<h1 className="text-sky-500 text-md flex items-center gap-2 font-semibold"><BiWorld className="h-6 w-6"/> Everyone</h1>
										</div>
										<div 
										onClick={()=>{setTweetPublic(false);setOpenTweetVisiblityTab(false)}}
										className="px-2 py-1 cursor-pointer hover:bg-gray-200/20 dark:hover:bg-gray-800/70 transition-all duration-200 ease-in-out">
											<h1 className="text-sky-500 text-md flex items-center gap-2 font-semibold"><BsFillPeopleFill className="h-6 w-6"/> Followers</h1>
										</div>
									</div>
									{
										tweetPublic ? 
										<h1 className="select-none text-sky-600 font-semibold text-md flex items-center gap-1"><BiWorld className="h-5 w-5"/> Everyone</h1>
										:
										<h1 className="select-none text-sky-600 font-semibold text-md flex items-center gap-1"><BsFillPeopleFill className="h-5 w-5"/> Followers</h1>										
									}
									{
										openTweetVisiblityTab ? 
										<FiChevronUp className="h-4 w-4 text-sky-600 mt-1"/>
										:
										<FiChevronDown className="h-4 w-4 text-sky-600 mt-1"/>
									}
								</div>
							</div>
							{
								loader && <div class="loader h-[3px] w-full mt-2"></div>
							}
							<div className="mt-4 w-full peer">
 								<textarea type="text" id="tweetArea"
 								value={tweetText}
 								onChange={(e)=>setTweetText(e.target.value)}
 								className={`text-xl resize-none overflow-hidden h-7 w-full placeholder:text-gray-500 ${loader ? 'text-gray-400/70 dark:text-gray-700/70' : 'text-gray-900 dark:text-gray-100'} bg-transparent outline-none`}
 								placeholder="What is happening?!"
 								/>
							</div>
							{
								url.length>0 &&
								<div className={`mt-4 relative grid rounded-2xl ${url.length>1 ? 'grid-cols-2' : 'grid-cols-1'} gap-2 overflow-hidden w-full`}>
									{
										url.map((ur,i)=>(
										<div className="relative group flex items-center justify-center cursor-pointer overflow-hidden" key={i}>
											<div className="absolute h-full w-full z-10 transition-all duration-200 
											ease-in-out group-hover:bg-black/30"/>
											<div 
											onClick={()=>removeImage(i)}
											className="rounded-full p-1 hover:bg-red-600 transition-all 
											duration-200 ease-out bg-gray-800 absolute top-[6px] z-20 left-[6px]">
												<RxCross2 className="md:h-5 h-4 w-4 md:w-5 text-white"/>
											</div>
											<img src={ur} alt="" className="select-none w-full aspect-square transition-all duration-300 ease-in-out group-hover:scale-90"/>
										</div>
										))
									}
									{loader &&  <div className="absolute z-5 bg-gray-500/60 h-full w-full animate-pulse"/> }									
								</div>

							}
							<div className="mt-4 h-[1px] w-full dark:bg-gray-500/80 peer-focus-within:bg-sky-500/70 bg-gray-200/80"/>
							<div className="flex items-center justify-between py-3">
								<div className="flex items-center">
									<div className="cursor-pointer rounded-full p-2 hover:bg-sky-200/60 dark:hover:bg-sky-800/40 transition-all duration-200 ease-in-out">
										<BsCardImage onClick={openFileInput} className={`h-5 w-5 ${url.length<4 ? 'text-sky-500':'text-gray-500'} `}/>
										<input type="file" id="file1" accept="image/*" 
										value={path}
										onChange={(e)=>setPath(e.target.value)}
										hidden
										/>
									</div>
									<div className="cursor-pointer rounded-full p-2 hover:bg-sky-200/60 dark:hover:bg-sky-800/40 transition-all duration-200 ease-in-out">
										<TbGif className="h-5 w-5 text-sky-500"/>
									</div>
									<div className="relative cursor-pointer hidden sm:block rounded-full p-2 hover:bg-sky-200/60 dark:hover:bg-sky-800/40 transition-all duration-200 ease-in-out">
										<BsEmojiSmile onClick={openEmojiInput} className="h-5 w-5 text-sky-500 z-30"/>
										{
											emojiInput &&
											<div className="absolute top-10 -left-[75px] z-30">
												<EmojiPicker theme="dark" onEmojiClick={(emoji)=>{
													setTweetText((tweetText)=>{return tweetText+' '+emoji.emoji})
												}}/>
											</div>											
										}
									</div>
									<div className="cursor-pointer rounded-full p-2 hover:bg-sky-200/60 dark:hover:bg-sky-800/40 transition-all duration-200 ease-in-out">
										<MdSchedule className="h-5 w-5 text-sky-500"/>
									</div>
									<div className="cursor-pointer rounded-full p-2 hover:bg-sky-200/60 dark:hover:bg-sky-800/40 transition-all duration-200 ease-in-out">
										<HiOutlineLocationMarker className="h-5 w-5 text-sky-500"/>
									</div>
								</div>
								<button 
								onClick={()=>tweet()}
								className={`px-5 py-[6px] select-none rounded-full text-white font-bold ${((tweetText.length>2 || url.length>0) && !loader) ? 'bg-sky-500 dark:bg-sky-500' : 'bg-sky-300 dark:bg-sky-900'}`}>
									Tweet
								</button>
							</div>
						</div>	
					</div>
					
					<div className={`w-full backdrop-blur-lg bg-white/50 dark:bg-[#100C08]/50 flex items-center justify-center overflow-hidden absolute z-30 transition-all duration-300 ease-out 
					${mainFeed.length > 0 ? 'h-[0%]' : 'h-[50%]'}`}>
						<span className="loader4">
							<img src="twitter-icon.png" className="absolute -rotate-[45deg] h-[46px] w-[46px] top-0 bottom-0 left-0 right-0 m-auto" alt=""/>
						</span>
					</div>
					<div className="flex flex-col w-full pb-10 mb-10 h-full">
						{
							mainFeed?.map((main,j)=>{
								
							
								return (
								<TweetCard  main={main} j={j} key={j} setCurrentWindow={setCurrentWindow} calDate={calDate}
								BsThreeDots={BsThreeDots} FaRegComment={FaRegComment} millify={millify} AiOutlineRetweet={AiOutlineRetweet}
								retweetThisTweet={retweetThisTweet} makeMeSpin={makeMeSpin} likeThisTweet={likeThisTweet} makeMePink={makeMePink}
								AiFillHeart={AiFillHeart} AiOutlineHeart={AiOutlineHeart} currentUser={currentUser}
								BsGraphUpArrow={BsGraphUpArrow} BsFillShareFill={BsFillShareFill} viewThisTweet={viewThisTweet}
								/>

							)}
							)
						}
					</div>
					
				</div>
				:
				<>
				</>
			}
			
		</div>

	)
}