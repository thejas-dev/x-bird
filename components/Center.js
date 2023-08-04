import {FiChevronDown,FiChevronUp} from 'react-icons/fi';
import {useState,useEffect,useRef} from 'react';
import {BsCardImage,BsEmojiSmile,BsGraphUpArrow,BsFillShareFill,BsThreeDots,BsFillPeopleFill} from 'react-icons/bs';
import {AiOutlineRetweet,AiOutlineHeart,AiFillHeart,AiOutlinePlusCircle,AiOutlineSearch} from 'react-icons/ai';
import {MdVideoLibrary,MdArrowUpward} from 'react-icons/md';
import {FaRegComment} from 'react-icons/fa';
import {useRecoilState} from 'recoil';
import {BiWorld} from 'react-icons/bi';
import {currentChatState,homeState,currentUserState,showLoginNowState,mainFeedState,
	loaderState,sidebarState,followingFeedState,forYouState,bottomHideState,needToRefetchState,
	mainFeedNotAddedState,soundAllowedState
	} from '../atoms/userAtom'
import {MdSchedule} from 'react-icons/md'
import {HiOutlineLocationMarker} from 'react-icons/hi';
import {createTweet,getAllPosts,getPostByIdRoute,updatedPostRoute,
	updateUser,updateUserTweets,updateUserRetweets,getAllFollowingPosts,
	songSearchRoute} from '../utils/ApiRoutes';
import axios from 'axios'
import {RxCross2} from 'react-icons/rx';
import millify from 'millify';
import ImageKit from "imagekit";
import EmojiPicker from 'emoji-picker-react';
import DateDiff from 'date-diff';
import {socket} from '../service/socket';
import TweetCard from './TweetCard'
import ReactPlayer from 'react-player'
import SongCard from './SongCard'

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
	const [needToRefetch,setNeedToRefetch] = useRecoilState(needToRefetchState)
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
	const [mainFeedNotAdded,setMainFeedNotAdded] = useRecoilState(mainFeedNotAddedState);
	const [tweetPublic,setTweetPublic] = useState(true);
	const [openTweetVisiblityTab,setOpenTweetVisiblityTab] = useState(false);
	const [firstTimeFeed,setFirstTimeFeed] = useState(false);
	const [audioUrl,setAudioUrl] = useState('');
	const [path6,setPath6] = useState('');
	const [audioFileName,setAudioFileName] = useState('');
	const [warnAboutAudio,setWarnAboutAudio] = useState('');
	const [path8,setPath8] = useState('');
	const [videoUrl,setVideoUrl] = useState('');
	const [songUrl,setSongUrl] = useState('');
	const [openSongSelection,setOpenSongSelection] = useState(false);
	const [soundAllowed,setSoundAllowed] = useRecoilState(soundAllowedState);
	const [searchSongValue,setSearchSongValue] = useState('Anirudh');
	const [songSearchResults,setSongSearchResults] = useState([]);
	const [notFirstTime,setNotFirstTime] = useState(false);

	const imagekit = new ImageKit({
	    publicKey : process.env.NEXT_PUBLIC_IMAGEKIT_ID,
	    privateKey : process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE,
	    urlEndpoint : process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT
	});

	const audioPathCheck = (path) =>{
		if(path){
			if(path.split('/').includes('data:audio')){
				return true;
			}
		}
	}

	const pathCheck = (path) =>{
		if(path){
			if(path.split('/').includes('data:image')){
				return true;
			}
			return false
		}
	}

	useEffect(()=>{
		if(home === 'For you'){
			setSoundAllowed(false)
			setMainFeed(foryou);
		}else{
			setSoundAllowed(false)
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
		  if(scrollY > 20){
		  	setBottomHide(true)
		  }
		  if(scrollY < -10){		  	
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

	const uploadAudioAndTweet = async(imageArray) => {
		imagekit.upload({
		    file : audioUrl, //required
		    folder:"Audios",
		    fileName : 'trendzio', 
		    extensions: [
		        {
		            name: "google-auto-tagging",
		            maxTags: 5,
		            minConfidence: 95
		        }
	    	]  //required
		}).then(response => {
			tweetNow(imageArray,response.url);
			setAudioUrl('');
		}).catch(error => {
			setLoader(false)
		    setWarnAboutAudio('Unsupported audio file type. Please select an audio file in MP3, WAV, OGG format, etc.')
		    setTimeout(()=>{setWarnAboutAudio('')},5000)
		});

	}

	const uploadVideo = () => {


		imagekit.upload({
			file:videoUrl,
			folder:"Videos",
			fileName:'trendzio',
			extensions:[
				{
		            name: "google-auto-tagging",
		            maxTags: 5,
		            minConfidence: 95
		        }
			]
		}).then(response=>{
			// console.log(response.url)
			tweetNowWithVideo(response.url);
			setVideoUrl('');
		}).catch(error => {
			setLoader(false);
		    setWarnAboutAudio(error.message);
			setTimeout(()=>{setWarnAboutAudio('')},5000)
		});
	}

	const uploadImage = (i=0) => {
		imagekit.upload({
		    file : url[i], //required
		    folder:"Images",
		    fileName : 'trendzio', 
		    extensions: [
		        {
		            name: "google-auto-tagging",
		            maxTags: 5,
		            minConfidence: 95
		        }
	    	]  //required
		}).then(response => {
			if(i+1 === url.length){
				if(audioUrl){
					uploadAudioAndTweet([...imageUrl,response.url]);
					imageUrl = [...imageUrl,response.url];
				}else if(songUrl){
					tweetNow([...imageUrl,response.url],songUrl);
					imageUrl = [...imageUrl,response.url];
					setSongUrl('');					
				}else{
					tweetNow([...imageUrl,response.url])
					imageUrl = [...imageUrl,response.url];					
				}
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

	

	const url8Setter = async () => {
	  const videoElementTemp = document.getElementById('file8');
	  const video_input = videoElementTemp.files[0];
	  if (video_input) {
	    // Check if the file is a video format
	    if (video_input.type.startsWith('video/')) {
	      // Create a FileReader
	      const reader = new FileReader();

	      // Set up the onload event handler to convert video to base64
	      reader.onload = () => {
	        // The result property contains the base64 string
	        const base64String = reader.result;
	        setVideoUrl(base64String); // Assign the base64 string to videoUrl
	        setPath8('');
	      };

	      // Read the video file as Data URL (which will be the base64 representation)
	      reader.readAsDataURL(video_input);
	    } else {
	      console.log('Invalid video format. Please upload a valid video.');
	    }
	  }
	};


	const url6Setter = async() => {
		const audio_input = document.querySelector('#audioFile');
		setAudioFileName(audio_input?.files[0]?.name)
		if(audio_input){
			
		    const file = audio_input.files[0];
		    const audio = new Audio();
		    if(file){
		    	audio.addEventListener('loadedmetadata', () => {
			      const durationInSeconds = audio.duration;
			      if (durationInSeconds > 31) {
			      	setPath6('');
			        // File duration is longer than 30 seconds
			        setWarnAboutAudio("Audio file should be 30 seconds or less.");
			       	setTimeout(()=>{setWarnAboutAudio('')},5000)
			       	setAudioUrl('');
			      } else {
			        // File duration is within the allowed limit
			        const reader = new FileReader();
			        reader.addEventListener('load', () => {
			          if (audioPathCheck(reader.result)) {
			            setAudioUrl(reader.result);
			            setSongUrl('');
			            setPath6('');
			          }else{
			          	setPath6('');
			          	setAudioUrl('');
			          }
			        });
			        reader.readAsDataURL(file);
			      }
			    });

			    audio.src = URL.createObjectURL(file);	
		    }
		    
		}
	}

	const url3Setter = async() => {
		const image_input = document.querySelector('#file1');

		const readNextImage = (index) => {
		  if (index >= image_input.files.length) {
			setPath('');		
		    return;
		  }

		  const file = image_input.files[index];
		  const reader = new FileReader();
		  reader.addEventListener('load', () => {
		  	if(reader.result && pathCheck(reader.result)){
		  		// console.log(reader.result,pathCheck(reader.result))
		    	setUrl2(reader.result);
		  	}
		    readNextImage(index + 1);
		  });

		  reader.readAsDataURL(file);
		};

		readNextImage(0);
	}


	useEffect(()=>{
		fetchTimeLine();
		if(currentUser){
			setFollowingFeed([])			
			fetchFollowingFeed();
		}
	},[])
 	
	useEffect(()=>{
		if(currentUser && !firstTimeFeed){
			setFirstTimeFeed(true)
			setMainFeed([])
			refetchFeed();
		}
	},[currentUser])

	useEffect(()=>{
		if(needToRefetch){
			refetchFeed()
		}
	},[needToRefetch])

	const refetchFeed = () => {
		fetchTimeLine();
		if(currentUser){
			setFollowingFeed([])
			fetchFollowingFeed();
		}
	}

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
			const followingFeedIds = new Set(followingFeed.map(post => post._id.toString()));

			const filteredMainFeed = foryou.filter(post => !followingFeedIds.has(post._id.toString()));

			let newFeed = [...followingFeed, ...filteredMainFeed];
			// followingFeed.push(...filteredMainFeed);
			// console.log(mainFeed,followingFeed);
			// let followFeed = [...followingFeed, ...foryou];
			setFollowingFeed(newFeed);
			console.log(newFeed)
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

	function autoResize2() {
		const ele = document.getElementById('tweetArea');
		if(ele){
			ele.style.height = 'auto',
			ele.style.height = ele.scrollHeight + 'px'
		}		
	}

	useEffect(()=>{
		if(tweetText === '' && notFirstTime){
			autoResize2()
		}else{
			setNotFirstTime(true)
		}
	},[tweetText])

	useEffect(()=>{
		function autoResize() {
			this.style.height = 'auto',
			this.style.height = this.scrollHeight + 'px'
		}
		const ele = document.getElementById('tweetArea');
		if(ele){
			ele.addEventListener('input',autoResize,false);
		}

		return () => {
			if (ele) {
			  ele.removeEventListener('input', autoResize, false);
			}
		};
	},[])

	useEffect(()=>{
		if(url2 && url.length<4){
			setUrl(url=>[...url,url2]);
			setUrl2('')
		}
	},[url2])

	const openFileInput = () => {
		if(url.length<4 && !loader && !videoUrl){
			document.getElementById('file1').click();
		}
	}

	const tweet = async() => {
		if(currentUser){
			if(tweetText.length > 2 || url.length>0 || videoUrl){
				setLoader(true);
				if(url.length>0){
					uploadImage();				
				}else if(videoUrl){
					uploadVideo();
				}else{
					tweetNow();
				}
			}			
		}
	}

	const tweetNowWithVideo = async(videoArray) => {
		const text = tweetText || '';
		const user = {
			id:currentUser._id,
			name:currentUser.name,
			image:currentUser.image,
			username:currentUser.username
		}	
		const images = [];	
		const audio = '';
		const videos = videoArray;
		const {data} = await axios.post(createTweet,{text,user,images,audio,videos,public:tweetPublic});
		setUrl([]);
		setAudioUrl('');
		imageUrl = [];
		autoResize2();
		setTweetText('');
		setLoader(false);
		setMainFeed(mainFeed=>[data.post,...mainFeed]);
		const tweets = [data.post._id,...currentUser.tweets]
		const res = await axios.post(`${updateUserTweets}/${currentUser._id}`,{
			tweets
		});
		setCurrentUser(res.data.obj);
	}

	const tweetNow = async(imageArray,audioArray) => {
		const text = tweetText || '';
		const user = {
			id:currentUser._id,
			name:currentUser.name,
			image:currentUser.image,
			username:currentUser.username
		}	
		const images = url.length>0 ? imageArray : [];	
		const audio = audioArray ? audioArray : '';
		const videos = '';
		const {data} = await axios.post(createTweet,{text,user,images,audio,videos,public:tweetPublic});
		setUrl([]);
		setAudioUrl('');
		imageUrl = [];
		autoResize2();
		setTweetText('');
		setLoader(false);
		setMainFeed(mainFeed=>[data.post,...mainFeed]);
		const tweets = [data.post._id,...currentUser.tweets]
		const res = await axios.post(`${updateUserTweets}/${currentUser._id}`,{
			tweets
		});
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
			if(data?.post[0]){
				const post = data?.post[0];
				let posts = [...mainFeed];
				posts[idx] = post;				
				setMainFeed(posts)
			}
		}
	}

	const likeThisTweet = async(j) => {
		if(currentUser){
			const {data} = await axios.get(`${getPostByIdRoute}/${mainFeed[j]._id}`);
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
			}
		}else{
			setShowLoginNow(true)
		}
	}



	const retweetThisTweet = async(j) => {
		if(currentUser){
			const {data} = await axios.get(`${getPostByIdRoute}/${mainFeed[j]._id}`);
			if(data.post[0]){
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
			}
		}else{
			setShowLoginNow(true)
		}
	}
	

	const viewThisTweet = async(j) => {
		if(currentUser){
			const {data} = await axios.get(`${getPostByIdRoute}/${mainFeed[j]._id}`);
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
					const res = await axios.post(`${updatedPostRoute}/${mainFeed[j]._id}`,updatedPost);
					let main = [...mainFeed];
					main[j] = res.data.obj;
					setMainFeed(main);
				}
			}			
		}
	}

	const searchForSong = async() => {
		setSongSearchResults([]);
		const {data} = await axios.get(`${songSearchRoute}/${searchSongValue}`);
		setSongSearchResults(data.data);

	}

	useEffect(()=>{
		if(searchSongValue.length > 3){
			searchForSong()
		}
	},[searchSongValue])

	const openEmojiInput = () => setEmojiInput(!emojiInput)

	const openAudioInput = () => document.getElementById('audioFile').click()

	

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
							<img src={currentUser?.image || 'https://ik.imagekit.io/d3kzbpbila/thejashari_QSzOWJHFV?updatedAt=1690659361414'} 
							onClick={()=>setOpenSidebar(true)}
							className="left-3 absolute top-3 cursor-pointer left-5 h-8 w-8 rounded-full"/>
							<center>
								<img src="https://ik.imagekit.io/d3kzbpbila/thejashari_QSzOWJHFV?updatedAt=1690659361414" 
								className="h-9 cursor-pointer w-9"/>
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
								onClick={()=>{
									if(!loader){
										setOpenTweetVisiblityTab(!openTweetVisiblityTab)
									}
								}}
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
 								onChange={(e)=>{
 									if(!loader){
 										setTweetText(e.target.value)
 									}
 								}}
 								className={`text-xl resize-none overflow-hidden h-7 w-full placeholder:text-gray-500 
 								${loader ? 'text-gray-400/70 dark:text-gray-700/70' : 'text-gray-900 dark:text-gray-100'} 
 								bg-transparent outline-none`}
 								placeholder="Create a trend?!"
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
											className={`rounded-full p-1 hover:bg-red-600 transition-all ${loader && 'hidden'} 
											duration-200 ease-out bg-gray-800 absolute top-[6px] z-20 left-[6px]`}>
												<RxCross2 className="md:h-5 h-4 w-4 md:w-5 text-white"/>
											</div>
											<img src={ur} alt="" className="select-none w-full h-full transition-all duration-300 ease-in-out group-hover:scale-90"/>
										</div>
										))
									}
									{loader &&  <div className="absolute z-5 bg-gray-500/60 h-full w-full animate-pulse"/> }									
								</div>

							}
							{
								url?.length > 0 &&
								<div className="flex gap-2">
									<div 
									onClick={()=>{if(!loader) {setOpenSongSelection(!openSongSelection)}}}
									className={`border-[1.3px] ${audioUrl && 'hidden'} flex items-center border-sky-500 text-sky-500 w-auto mt-4 gap-1 font-semibold
									rounded-full px-2 py-1 hover:bg-gray-200/50 dark:hover:bg-gray-800/70 transition-all duration-300 ease-in-out cursor-pointer`}>
										<AiOutlineSearch className={`h-5 w-5 text-sky-500`}/> {songUrl ? audioFileName : 'Add Music'}
										{songUrl && <RxCross2 onClick={()=>setSongUrl('')} className={`h-5 w-5 text-sky-500`}/> }
									</div>
									<div 
									onClick={()=>{if(!loader) {openAudioInput()}}}
									className={`border-[1.3px] ${songUrl && 'hidden'} flex items-center border-sky-500 text-sky-500 w-auto mt-4 gap-1 font-semibold
									rounded-full px-2 py-1 hover:bg-gray-200/50 dark:hover:bg-gray-800/70 transition-all duration-300 
									ease-in-out cursor-pointer`}>
										<AiOutlinePlusCircle className={`h-5 w-5 text-sky-500`}/> {audioUrl ? audioFileName : 'Add My Music'} 
										{audioUrl && <RxCross2 onClick={()=>setAudioUrl('')} className={`h-5 w-5 text-sky-500`}/> }
									</div>
									<input type="file" id="audioFile" accept="audio/*" 
									value={path6} 
									onChange={(e)=>{setPath6(e.target.value);url6Setter()}}
									hidden
									/>
								</div>
							}
							{
								videoUrl && 	
								<div className="relative rounded-md mt-2 overflow-hidden">
									<div 
									onClick={()=>setVideoUrl('')}
									className={`rounded-full p-1 hover:bg-red-600 transition-all ${loader && 'hidden'} 
									duration-200 ease-out bg-gray-800 absolute top-[10px] z-20 left-[6px]`}>
										<RxCross2 className="md:h-5 h-4 w-4 md:w-5 text-white"/>
									</div>							
									<ReactPlayer url={videoUrl} controls={true} width='100%' height='100%'/>								
								</div>
							}
							
							
							<span className={` text-md font-semibold overflow-hidden ${warnAboutAudio ? 'w-full h-auto mt-4' : 'h-0 w-0'} transition-all duration-300
							ease-in-out text-red-500`}>{warnAboutAudio}</span>
							
							<div className="mt-4 h-[1px] w-full dark:bg-gray-500/80 peer-focus-within:bg-sky-500/70 bg-gray-200/80"/>
							<div className={`${openSongSelection && !audioUrl ? 'h-[300px] border-[1px]' : 'h-[0px]'} peer-focus-within:border-t-sky-500/70 
							transition-all duration-300 ease-in-out	overflow-hidden w-full border-gray-500/80 relative rounded-xl mt-2`}>
								<div className="sticky px-3 py-2 top-0 w-full flex items-center gap-2 border-b-[1px] border-gray-300
								dark:border-gray-700/70 backdrop-blur-md">
									<div onClick={()=>setOpenSongSelection(false)} className="rounded-full 
									dark:hover:bg-gray-700/50 hover:bg-gray-300/50 transition-all	duration-200 ease-in-out cursor-pointer">
										<MdArrowUpward className="text-black dark:text-gray-200 h-6 w-6 "/>
									</div>
									<div className="w-full flex items-center rounded-2xl dark:bg-gray-800/40 
									bg-gray-200/60 px-3 py-2 gap-2 border-gray-800/20 border-[1px] focus-within:border-sky-500">
										<AiOutlineSearch className="h-6 w-6 text-black dark:text-gray-300"/> 
										<input type="text" value={searchSongValue} onChange={(e)=>{
											setSearchSongValue(e.target.value)
										}} className="w-full bg-transparent h-full text-md outline-none 
										ring-0 text-black dark:text-gray-200 placeholder:text-gray-500" 
										placeholder="Search for music"
										/>
									</div>
								</div>
								<div className={`w-full h-full overflow-y-scroll scrollbar-thin scrollbar-thumb-sky-500 
								dark:scrollbar-track-gray-800/50 scrollbar-track-gray-100/50 scrollbar-thumb-rounded-xl`}>
									{
										songSearchResults?.map((res,j)=>(
											<SongCard res={res} j={j} key={j} setSongUrl={setSongUrl} 
											songUrl={songUrl} audioUrl={audioUrl} setAudioUrl={setAudioUrl} 
											searchSongValue={searchSongValue} setSearchSongValue={setSearchSongValue}
											audioFileName={audioFileName} setAudioFileName={setAudioFileName}
											openSongSelection={openSongSelection} setOpenSongSelection={setOpenSongSelection}
											/>
										))
									}

								</div>
							</div>
							<div className="flex items-center justify-between py-3">
								<div className="flex items-center">
									<div className="cursor-pointer rounded-full p-2 hover:bg-sky-200/60 dark:hover:bg-sky-800/40 transition-all duration-200 ease-in-out">
										<BsCardImage onClick={openFileInput} className={`h-5 w-5 ${(url.length<4 && !loader && !videoUrl) ? 'text-sky-500':'text-gray-500'} `}/>
										<input type="file" id="file1" accept="image/*" 
										value={path} multiple="true"
										onChange={(e)=>{setPath(e.target.value);url3Setter()}}
										hidden
										/>
									</div>
									<div className="cursor-pointer rounded-full p-2 hover:bg-sky-200/60 dark:hover:bg-sky-800/40 transition-all duration-200 ease-in-out">
										<MdVideoLibrary onClick={()=>{
											if(url.length < 1 && !loader){
												document.getElementById('file8').click()
											}
										}}
										className={`h-5 w-5 ${url.length > 0 && !loader ? 'text-gray-500' : 'text-sky-500'}`}/>
										<input type="file" id="file8" accept="video/*" 
										value={path8} multiple="true"
										onChange={(e)=>{setPath8(e.target.value);url8Setter()}}
										hidden
										/>
									</div>
									<div className="relative cursor-pointer hidden sm:block rounded-full p-2 hover:bg-sky-200/60 dark:hover:bg-sky-800/40 transition-all duration-200 ease-in-out">
										<BsEmojiSmile onClick={openEmojiInput} className="h-5 w-5 text-sky-500 z-30"/>
										{
											emojiInput &&
											<div className="absolute top-10 -left-[75px] z-30">
												<EmojiPicker theme="dark" onEmojiClick={(emoji)=>{
													if(!loader){
														setTweetText((tweetText)=>{return tweetText+''+emoji.emoji})
													}
												}}/>
											</div>											
										}
									</div>
									<div className="cursor-pointer rounded-full p-2 opacity-50 hover:bg-sky-200/60 dark:hover:bg-sky-800/40 transition-all duration-200 ease-in-out">
										<MdSchedule className="h-5 w-5 text-sky-500"/>
									</div>
									<div className="cursor-pointer rounded-full p-2 opacity-50 hover:bg-sky-200/60 dark:hover:bg-sky-800/40 transition-all duration-200 ease-in-out">
										<HiOutlineLocationMarker className="h-5 w-5 text-sky-500"/>
									</div>
								</div>
								<button 
								onClick={()=>tweet()}
								className={`px-5 py-[6px] select-none rounded-full text-white font-bold ${((tweetText.length>2 || url.length>0 || videoUrl) && !loader) ? 'bg-sky-500 dark:bg-sky-500' : 'bg-sky-300 dark:bg-sky-900'}`}>
									Trend
								</button>
							</div>
						</div>	
					</div>
					
					<div className={`w-full backdrop-blur-lg bg-white/50 dark:bg-[#100C08]/50 flex items-center justify-center overflow-hidden absolute z-30 transition-all duration-300 ease-out 
					${mainFeed.length > 0 ? 'h-[0%]' : 'h-[50%]'}`}>
						<span className="loader4">
							<img src="https://ik.imagekit.io/d3kzbpbila/thejashari_QSzOWJHFV?updatedAt=1690659361414" 
							className="absolute -rotate-[45deg] h-[46px] w-[46px] top-0 bottom-0 left-0 right-0 m-auto" alt=""/>
						</span>
					</div>
					<div className="flex flex-col w-full pb-10 mb-10 h-full">
						{
							mainFeed?.map((main,j)=>{
								
							
								return (
								<div key={j}>
									<TweetCard  main={main} j={j} key={j} setCurrentWindow={setCurrentWindow} currentWindow={currentWindow} 
									calDate={calDate} BsThreeDots={BsThreeDots} FaRegComment={FaRegComment} millify={millify} AiOutlineRetweet={AiOutlineRetweet}
									retweetThisTweet={retweetThisTweet} makeMeSpin={makeMeSpin} likeThisTweet={likeThisTweet} makeMePink={makeMePink}
									AiFillHeart={AiFillHeart} AiOutlineHeart={AiOutlineHeart} currentUser={currentUser} home={home}
									BsGraphUpArrow={BsGraphUpArrow} BsFillShareFill={BsFillShareFill} viewThisTweet={viewThisTweet}
									/>
								</div>
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