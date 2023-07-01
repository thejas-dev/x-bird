import {FiChevronDown} from 'react-icons/fi';
import {useState,useEffect} from 'react';
import {BsCardImage,BsEmojiSmile,BsGraphUpArrow,BsFillShareFill,BsThreeDots} from 'react-icons/bs';
import {AiOutlineRetweet,AiOutlineHeart,AiFillHeart} from 'react-icons/ai';
import {TbGif} from 'react-icons/tb';
import {FaRegComment} from 'react-icons/fa';
import {useRecoilState} from 'recoil'
import {currentChatState,currentUserState,mainFeedState,loaderState} from '../atoms/userAtom'
import {MdSchedule} from 'react-icons/md'
import {HiOutlineLocationMarker} from 'react-icons/hi';
import {createTweet,getAllPosts,getPostByIdRoute,updatedPostRoute,
	updateUser,updateUserTweets,updateUserRetweets} from '../utils/ApiRoutes';
import axios from 'axios'
import {RxCross2} from 'react-icons/rx';
import millify from 'millify';
import ImageKit from "imagekit";
import EmojiPicker from 'emoji-picker-react';
import DateDiff from 'date-diff'

let imageUrl = [];

export default function Center({setCurrentWindow,currentWindow}) {
	// body...
	const [home,setHome] = useState('For you');
	const [currentChat,setCurrentChat] = useRecoilState(currentChatState);
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [mainFeed,setMainFeed] = useRecoilState(mainFeedState);
	const [tweetText,setTweetText] = useState('');	
	const [path,setPath] = useState('');
	const [url,setUrl] = useState([]);
	const [url2,setUrl2] = useState('');
	// const [imageUrl,setImageUrl] = useState([]);
	const [loader,setLoader] = useRecoilState(loaderState);
	const [loading,setLoading] = useState(false);
	const [emojiInput,setEmojiInput] = useState(false);
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

	const calDate = (date) => {
		const date1 = new Date();
		const date2 = new Date(date)
		var diff = new DateDiff(date1, date2);
		if(diff.minutes() <= 60){
			return Math.trunc(diff.minutes()) + 'm'
		}else if(diff.hours() <= 24){
			return Math.trunc(diff.hours()) + 'h'
		}else if(diff.days() <= 30){
			return Math.trunc(diff.days()) + 'd'
		}else if(diff.months() <= 12){
			return Math.trunc(diff.minutes()) + 'M'
		}else if(diff.years() <= 12){
			return Math.trunc(diff.years()) + 'y'
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
	},[])

	const fetchTimeLine = async() => {
		const {data} = await axios.get(getAllPosts);
		setMainFeed(data.data.reverse())
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
		const {data} = await axios.post(createTweet,{text,user,images});
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
		element.classList.add('text-pink-500','animate-bounce')		
	}

	const makeMeSpin = (j) => {
		const element = document.getElementById(`retweet-${j}`)
		element.classList.add('animate-bounce');
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
			
		}
	}
	// console.log(mainFeed)

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
			const main = [...mainFeed];
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
			
		}
	}
	
	// console.log(currentUser)

	const openEmojiInput = () => setEmojiInput(!emojiInput)


	

	return (
		<div className="lg:w-[44.6%] relative md:w-[70%] xs:w-[90%] w-[100%] flex flex-col h-full border-r-[1.3px] border-gray-200 scrollbar-none overflow-y-scroll scroll-smooth">
			<div className={`h-full w-full backdrop-blur-lg bg-white/50 flex items-center justify-center absolute z-50 ${!loading && 'hidden'}`}>
				<span class="loader4">
					<img src="twitter-icon.png" className="absolute -rotate-[45deg] h-[46px] w-[46px] top-0 bottom-0 left-0 right-0 m-auto" alt=""/>
				</span>
			</div>
			{
				currentWindow === 'Home' ?
				<div className="h-full relative w-full " >
					<div className="sticky z-40 top-0 backdrop-blur-md bg-white/50 border-b-[1.3px] border-gray-200 w-full flex flex-col">
						<h1 className="ml-5 xs:block hidden mt-4 text-2xl font-semibold">
							Home
						</h1>
						<div className="w-full xs:hidden flex items-center pt-3 justify-center">
							<img src="twitter-icon.png" className="left-3 absolute top-3 cursor-pointer left-5 h-8 w-8 rounded-full"/>
							<center>
								<img src="twitter-icon.png" className="h-7 cursor-pointer w-7"/>
							</center>
						</div>
						<div className="mt-4 flex w-full">
							<div 
							onClick={()=>setHome('For you')}
							className="w-[50%] cursor-pointer hover:bg-gray-200/80 transition-all duration-200 
							ease-in-out flex items-center justify-center">
								<div className={`py-3 border-b-[3px] ${home=== 'For you' ? 'border-sky-600' : 'border-transparent'}`}>
									<h1 className={`text-md select-none font-semibold ${home === 'For you' ? "text-black font-bold" : "text-gray-600"}`}>
										For you
									</h1>
								</div>
							</div>
							<div 
							onClick={()=>setHome('Following')}
							className="w-[50%] cursor-pointer hover:bg-gray-200/80 transition-all duration-200 
							ease-in-out flex items-center justify-center">
								<div className={`py-3 border-b-[3px] ${home=== 'Following' ? 'border-sky-600' : 'border-transparent'}`}>
									<h1 className={`text-md select-none font-semibold ${home === 'Following' ? "text-black font-bold" : "text-gray-600"}`}>
										Following
									</h1>
								</div>
							</div>
						</div>
					</div>	
					<div className="mt-2 md:px-5 px-3 sm:gap-2 md:gap-4 gap-2 w-full flex border-b-[1.3px] border-gray-200">
						
						<img src={currentUser?.image} alt="" className="h-12 w-12 hidden select-none sm:block rounded-full"/>
						<div className=" w-full mt-2 flex flex-col">
							<div className="flex ">
								<div className="cursor-pointer rounded-full border-[1px] border-gray-400/60 py-[2px] px-3 gap-2 flex items-center text-sky-500">
									<h1 className="select-none text-sky-600 font-semibold text-md">Everyone</h1>
									<FiChevronDown className="h-4 w-4 text-sky-600 mt-1"/>
								</div>
							</div>
							{
								loader && <div class="loader h-[3px] w-full mt-2"></div>
							}
							<div className="mt-4 w-full">
 								<textarea type="text" id="tweetArea"
 								value={tweetText}
 								onChange={(e)=>setTweetText(e.target.value)}
 								className={`text-xl resize-none overflow-hidden h-7 w-full placeholder:text-gray-500 ${loader ? 'text-gray-400/70' : 'text-gray-900'} bg-transparent outline-none`}
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
							<div className="mt-4 h-[1px] w-full bg-gray-200/80"/>
							<div className="flex items-center justify-between py-3">
								<div className="flex items-center">
									<div className="cursor-pointer rounded-full p-2 hover:bg-sky-200/60 transition-all duration-200 ease-in-out">
										<BsCardImage onClick={openFileInput} className={`h-5 w-5 ${url.length<4 ? 'text-sky-500':'text-gray-500'} `}/>
										<input type="file" id="file1" accept="image/*" 
										value={path}
										onChange={(e)=>setPath(e.target.value)}
										hidden
										/>
									</div>
									<div className="cursor-pointer rounded-full p-2 hover:bg-sky-200/60 transition-all duration-200 ease-in-out">
										<TbGif className="h-5 w-5 text-sky-500"/>
									</div>
									<div className="relative cursor-pointer hidden sm:block rounded-full p-2 hover:bg-sky-200/60 transition-all duration-200 ease-in-out">
										<BsEmojiSmile onClick={openEmojiInput} className="h-5 w-5 text-sky-500 z-30"/>
										{
											emojiInput &&
											<div className="absolute top-10 -left-[75px] z-30">
												<EmojiPicker Theme="dark" onEmojiClick={(emoji)=>{
													setTweetText((tweetText)=>{return tweetText+' '+emoji.emoji})
												}}/>
											</div>											
										}
									</div>
									<div className="cursor-pointer rounded-full p-2 hover:bg-sky-200/60 transition-all duration-200 ease-in-out">
										<MdSchedule className="h-5 w-5 text-sky-500"/>
									</div>
									<div className="cursor-pointer rounded-full p-2 hover:bg-sky-200/60 transition-all duration-200 ease-in-out">
										<HiOutlineLocationMarker className="h-5 w-5 text-sky-500"/>
									</div>
								</div>
								<button 
								onClick={()=>tweet()}
								className={`px-5 py-[6px] select-none rounded-full text-white font-bold ${tweetText.length>2 || url.length>0 ? 'bg-sky-500' : 'bg-sky-300'}`}>
									Tweet
								</button>
							</div>
						</div>	
					</div>
					<div className="flex flex-col w-full mb-10 h-full">
						{
							mainFeed.map((main,j)=>(
								<div key={j} className={`w-full ${j===0 ? 'border-b-[1.6px]':'border-y-[1.6px]'} p-3 flex basis-auto md:gap-4 sm:gap-2 gap-2 
								border-gray-300/70 hover:bg-gray-200/40 transition-all z-0 duration-200 ease-in cursor-pointer`}>
									<img 
									onClick={()=>{
										setCurrentWindow('Profile')
										window.history.replaceState({id:100},'Default',`?profile=${main.user.id}`);
									}}
									src={main.user.image} alt="" className="rounded-full select-none h-12 w-12 shadow-md hover:shadow-xl hover:shadow-sky-600/30"/>
									<div className="flex flex-col w-full overflow-hidden">
										<div className='flex gap-1 w-full shrink truncate justify-between' >
											<div className="flex gap-1 truncate shrink items-center ">
												<h1 
												onClick={()=>{
													setCurrentWindow('Profile')
													window.history.replaceState({id:100},'Default',`?profile=${main.user.id}`);
												}}
												className="text-lg truncate font-semibold text-black select-none hover:cursor-pointer hover:underline">
													{main.user.name}
												</h1>
												<h1 
												onClick={()=>{
													setCurrentWindow('Profile')
													window.history.replaceState({id:100},'Default',`?profile=${main.user.id}`);
												}}
												className="text-gray-500 text-md truncate select-none hidden sm:block">@{main.user.username}</h1>
												<h1 
												onClick={()=>{
													window.history.replaceState({id:100},'Tweet',`?tweet=${main._id}`);
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
											window.history.replaceState({id:100},'Tweet',`?tweet=${main._id}`);setCurrentWindow('tweet')
										}}
										className="w-full text-lg">
											<h1 className="w-full text-gray-900 select-none break-words">{main.text}</h1>
										</div>	
										<div 
										onClick={()=>{
											window.history.replaceState({id:100},'Tweet',`?tweet=${main._id}`);setCurrentWindow('tweet')
										}}
										className={`rounded-2xl ${main.images.length>0 && 'mt-3'} grid rounded-2xl ${main.images.length>1 ? 'grid-cols-2' : 'grid-cols-1'} gap-1 overflow-hidden`}>
											{
												main.images.length>0 &&
													main.images.map((ur,i)=>(
													<div className="relative group flex items-center justify-center cursor-pointer overflow-hidden" key={i}>
														<div className="absolute h-full w-full z-10 transition-all duration-200 
														ease-in-out group-hover:bg-gray-500/10"/>
														<img src={ur} alt="" className="select-none w-full aspect-square transition-all duration-300 ease-in-out"/>
													</div>
													))

											}
										</div>
										<div className="mt-3 lg:pr-10 md:pr-2 pr-0 justify-between w-full md:w-[85%] lg:w-[100%] xl:w-[90%] flex items-center flex-wrap">
											<div 
											onClick={()=>{
												window.history.replaceState({id:100},'Tweet',`?tweet=${main._id}`);
												setCurrentWindow('tweet')
											}}
											className="flex group md:gap-[6px] gap-[3px] items-center">
												<div className="p-[10px] group-hover:bg-sky-300/30 transition-all duration-200 ease-in-out rounded-full">
													<FaRegComment className="h-4 w-4 group-hover:text-sky-500 transition-all duration-200 ease-in-out text-gray-600"/>
												</div>
												<h1 className="text-md text-gray-500 group-hover:text-sky-500">
													{millify(main.comments.length)}
												</h1>
											</div>
											<div 
											onClick={()=>{retweetThisTweet(j);makeMeSpin(j)}}
											className="flex group md:gap-[6px] gap-[3px] items-center">
												<div className="p-[10px] group-hover:bg-green-300/30 transition-all duration-200 ease-in-out rounded-full">
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
											onClick={()=>{likeThisTweet(j);makeMePink(j)}}
											className="flex group md:gap-[6px] gap-[3px] items-center">
												<div className="p-[10px] group-hover:bg-pink-300/30 transition-all duration-200 ease-in-out rounded-full">
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
												<div className="p-[10px] group-hover:bg-sky-300/30 transition-all duration-200 ease-in-out rounded-full">
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
												<div className="p-[10px] group-hover:bg-sky-300/30 transition-all duration-200 ease-in-out rounded-full">
													<BsFillShareFill className="h-4 w-4 group-hover:text-sky-500 transition-all duration-200 ease-in-out text-gray-600"/>
												</div>
											</div>
										</div>


									</div>	
								</div>

							))
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