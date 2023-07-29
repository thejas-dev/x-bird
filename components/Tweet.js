import {HiOutlineArrowLeft} from 'react-icons/hi';
import {useEffect,useState} from 'react';
import {BsCardImage,BsThreeDots,BsEmojiSmile,BsBookmark,BsFillShareFill,BsGraphUpArrow,
	BsBookmarkFill} from 'react-icons/bs';
import {AiOutlineRetweet,AiOutlineHeart,AiFillHeart} from 'react-icons/ai';
import {TbGif} from 'react-icons/tb';
import {RxCross2} from 'react-icons/rx';
import {HiOutlineLocationMarker} from 'react-icons/hi';
import {findPostRoute} from '../utils/ApiRoutes';
import {FaRegComment} from 'react-icons/fa';
import axios from 'axios'
import millify from 'millify';
import {currentUserState,loaderState,showLoginNowState,showClipboardState} from '../atoms/userAtom';
import {useRecoilState} from 'recoil'
import {getPostByIdRoute,updateUser,updatedPostRoute,updateUserRetweets,updateUserBookmarks} from '../utils/ApiRoutes';
import EmojiPicker from 'emoji-picker-react';
import {MdSchedule} from 'react-icons/md';
import ImageKit from "imagekit";
import DateDiff from 'date-diff';
import CommentCard from './CommentCard';
import GifPicker from 'gif-picker-react';

let imageUrl = [];

export default function Tweet({currentWindow,setCurrentWindow,setOpenOverlay,openOverlay,
	overlayFor,setOverlayFor}) {
	// body...
	const [currentPost,setCurrentPost] = useState('');
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [replyText,setReplyText] = useState('');
	const [reveal,setReveal] = useState(false);
	const [url,setUrl] = useState([]);
	const [url2,setUrl2] = useState('')
	const [path,setPath] = useState('');
	const [emojiInput,setEmojiInput] = useState(false);
	const [loader,setLoader] = useRecoilState(loaderState);
	const [showLoginNow,setShowLoginNow] = useRecoilState(showLoginNowState);
	const [gifInput,setGifInput] = useState(false);
	const [gifWidth,setGifWidth] = useState('31em');	
	const [showClipboard,setShowClipboard] = useRecoilState(showClipboardState);
	const [liked,setLiked] = useState(false);
	const imagekit = new ImageKit({
	    publicKey : process.env.NEXT_PUBLIC_IMAGEKIT_ID,
	    privateKey : process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE,
	    urlEndpoint : process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT
	});

	useEffect(()=>{
		if(window.innerWidth){
			setInterval(()=>{
				// console.log(window.innerWidth)
				if(window.innerWidth < 500 && window.innerWidth >= 400){
					setGifWidth('24em')
				}else if(window.innerWidth < 400 && window.innerWidth >= 360){
					setGifWidth('20em')
				}else if(window.innerWidth < 359 && window.innerWidth >= 300){
					setGifWidth('19em')
				}else if(window.innerWidth < 299 && window.innerWidth >= 260){
					setGifWidth('15em')
				}else if(window.innerWidth < 259){
					setGifWidth('10em')
				}else{
					setGifWidth('31em')
				}
			},1000)
		}
	},[])

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
		}else{
			const splitres = date2?.toString().split(' ')
			const res = splitres[1] + ' ' + splitres[2]
			return res
		}
	}

	useEffect(()=>{
		const fetchData = async() => {
			try{
				const {data} = await axios.get(`${findPostRoute}/${location.search.split('=')[1]}`);
				setCurrentPost(data.post[0]);
			}catch(ex){
				setCurrentWindow('Home')
			}
		}

		fetchData();
	},[])

	const makeMePink = (j) => {
		const element = document.getElementById(`commentlike-${j}`)	
	}

	const makeMePink2 = () => {
		const element = document.getElementById(`like`)	
	}

	const makeMePink3 = () => {
		const element = document.getElementById(`bookmark`)
		element.classList.add('text-orange-500','animate-bounce')
	}
	
	const removeImage = (i) => {
		let newArr = [...url];
		newArr.splice(i,1);
		setUrl(newArr);
	}

	useEffect(()=>{
		if(currentPost){
			if(currentPost?.likes?.some(element=>{
				if(element.id === currentUser?._id){
					return true;
				}
				return false
			})){
				setLiked(true)
			}else{
				setLiked(false)
			}
		}

	},[currentPost])

	const commentThisTweet = async(imageArray) => {
		if(currentUser){
			const {data} = await axios.get(`${getPostByIdRoute}/${currentPost._id}`);
			const post = data.post[0];
			let comments = post.comments;
			const user = {
				name:currentUser.name,
				id:currentUser._id,
				username:currentUser.username,
				image:currentUser.image
			}
			// console.log(comments)
			const images = url.length>0 ? imageArray : [];
			const text = replyText || '';
			const likes = [];
			const views = [currentUser._id];
			const randomNumber = Math.floor(Math.random() * 9000000000) + 1000000000;
			const id = randomNumber.toString();
			const createdAt = new Date();
			const newComment = {
				user,images,likes,views,createdAt,text,id
			}
			setUrl([]);
			imageUrl = []
			setReplyText('');
			comments = [newComment,...comments]
			const updatedPost = {...post, 'comments':comments }
			const res = await axios.post(`${updatedPostRoute}/${currentPost._id}`,updatedPost);
			setCurrentPost(res.data.obj);
			setLoader(false);
		}
	}

	const sendGifMessage = async(e) => {
		if(currentUser){
			const {data} = await axios.get(`${getPostByIdRoute}/${currentPost._id}`);
			const post = data.post[0];
			let comments = post.comments;
			const user = {
				name:currentUser.name,
				id:currentUser._id,
				username:currentUser.username,
				image:currentUser.image
			}
			// console.log(comments)
			const images = url.length>0 ? imageArray : [];
			const text = e || '';
			const likes = [];
			const views = [currentUser._id];
			const randomNumber = Math.floor(Math.random() * 9000000000) + 1000000000;
			const id = randomNumber.toString();
			const createdAt = new Date();
			const newComment = {
				user,images,likes,views,createdAt,text,id
			}
			setUrl([]);
			imageUrl = [];
			setReplyText('');
			comments = [newComment,...comments]
			const updatedPost = {...post, 'comments':comments }
			const res = await axios.post(`${updatedPostRoute}/${currentPost._id}`,updatedPost);
			setCurrentPost(res.data.obj);
			setLoader(false);
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
				commentThisTweet([...imageUrl,response.url])
				imageUrl = [...imageUrl,response.url];	
			}else{
				imageUrl = [...imageUrl,response.url];
				uploadImage(i+1)
			}
		}).catch(error => {
		    console.log(error.message)
		});
	}

	const likeThisTweet = async() => {
		if(currentUser){
			const {data} = await axios.get(`${getPostByIdRoute}/${currentPost?._id}`);
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
			const res = await axios.post(`${updatedPostRoute}/${currentPost?._id}`,updatedPost);
			setCurrentPost(res.data.obj);
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
		}else{
			setShowLoginNow(true)
		}
	}

	const retweetThisTweet = async() => {
		if(currentUser){
			const {data} = await axios.get(`${getPostByIdRoute}/${currentPost._id}`);
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
			const res = await axios.post(`${updatedPostRoute}/${currentPost._id}`,updatedPost);
			setCurrentPost(res.data.obj);

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
			
		}else{
			setShowLoginNow(true)
		}
	}

	const likeThisComment = async(ID) => {
		if(currentUser){
			const {data} = await axios.get(`${getPostByIdRoute}/${currentPost?._id}`);
			const post = data.post[0];
			let comments = post.comments;
			const user = {
				name:currentUser.name,
				id:currentUser._id,
				username:currentUser.username,
				image:currentUser.image
			}

			const idx = comments.findIndex(element=>{
				if(element.id === ID){
					return true
				}
				return false
			})

			const check = comments[idx].likes.some(element=>{
				if(element.id === user.id){
					return true;
				}
				return false
			})

			// console.log(check)

			if(!check){
				comments[idx].likes = [user,...comments[idx].likes]; 
			}else{
				const idx2 = comments[idx].likes.findIndex(element=>{
					if(element.id === user.id){
						return true
					}
					return false
				})
				comments[idx].likes.splice(idx2,1);
			}
			
			// console.log(comments[idx]) 
			
			const updatedPost = {...post, 'comments':comments }
			const res = await axios.post(`${updatedPostRoute}/${currentPost?._id}`,updatedPost);
			setCurrentPost(res.data.obj)

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
		}else{
			setShowLoginNow(true)
		}
	}

	const bookmarkThisTweet = async() => {
		if(currentUser){
			const {data} = await axios.get(`${getPostByIdRoute}/${currentPost._id}`);
			const post = data.post[0];
			let book = post.bookmarks;
			const user = {
				name:currentUser.name,
				id:currentUser._id,
				username:currentUser.username,
				image:currentUser.image
			}
			const check = book.some(element=>{
				if(element.id === user.id){
					return true;
				}
				return false
			})
			if(!check){
				book.push(user);
			}else{
				const idx = book.findIndex(element=>{
					if(element.id === user.id){
						return true
					}
					return false
				})
				book.splice(idx,1);
			}
			const updatedPost = {...post, 'bookmarks':book }
			const res = await axios.post(`${updatedPostRoute}/${currentPost._id}`,updatedPost);
			setCurrentPost(res.data.obj);


			const check2 = await currentUser.bookmarks.some(element=>{
				if(element === currentPost._id){
					return true;
				}
				return false
			})
			
			if(!check2){
				const bookmarks = [currentPost._id, ...currentUser.bookmarks];
				const result = await axios.post(`${updateUserBookmarks}/${currentUser._id}`,{
					bookmarks
				})
				setCurrentUser(result.data.obj);
			}else{
				const idx = await currentUser.bookmarks.findIndex(element=>{
					if(element === currentPost._id){
						return true
					}
					return false
				})
				let bookmarks = [...currentUser.bookmarks];
				await bookmarks.splice(idx,1);
				const result = await axios.post(`${updateUserBookmarks}/${currentUser._id}`,{
					bookmarks
				})
				setCurrentUser(result.data.obj);
			}

		}else{
			setShowLoginNow(true)
		}
	}

	const viewThisComment = async(ID) => {
		if(currentUser){
			const {data} = await axios.get(`${getPostByIdRoute}/${currentPost?._id}`);
			const post = data.post[0];
			let comments = post.comments;
		
			const idx = comments?.findIndex(element=>{
				if(element.id === ID){
					return true
				}
				return false
			})

			const check = comments[idx]?.views?.some(element=>{
				if(element === currentUser._id){
					return true;
				}
				return false
			})

			// console.log(check)

			if(!check){
				comments[idx].views = [currentUser._id,...comments[idx].views]; 
				const updatedPost = {...post, 'comments':comments }
				const res = await axios.post(`${updatedPostRoute}/${currentPost?._id}`,updatedPost);
				setCurrentPost(res.data.obj)
			}			
		}

	}


	function tConvert(i) {
		let split = i.split('T');
		const date = split[0];
		let time = split[1].split('.')[0]
	    // Check correct time format and split into components
	    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

	    if (time.length > 1) { // If time format correct
	      time = time.slice(1); // Remove full string match value


	      time[2] = Number(time[2]) + 30;

	      if(Number(time[2])>60){
	        time[2] = Number(time[2]) -60
	        if(time[2]<10){
	          time[2] = 0+ time[2].toString()
	        }
	        time[0] = Number(time[0]) + 1
	      }

	      time[0] = Number(time[0]) + 5;
	      time[5] = +time[0] < 12 || time[0] === 24 ? ' AM' : ' PM'; // Set AM/PM
	      time[0] = +time[0] % 12 || 12; // Adjust hours
	      
	      time.splice(3,1)
	      
	    }
	    return time.join(''); // return adjusted time or original string
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

	const replyTweet = () => {
		if(replyText || url.length>0){
			setLoader(true);
			if(url.length>0){
				uploadImage()				
			}else{
				commentThisTweet();
			}
		}
	}

	useEffect(()=>{
		if(url2 && url.length<4){
			setUrl(url=>[...url,url2]);
			setUrl2('')
		}
	},[url2])

	const dConvert = (i) => {
		var date = new Date(i);		
		date = date.toString().split(' ');
		return date[1] + ' ' + date[2] + ',' + date[3];
	}

	const openFileInput = () => {
		if(url.length<2 && !loader){
			document.getElementById('file1').click();
		}
	}

	const openEmojiInput = () => setEmojiInput(!emojiInput)
	

	return (
		<div className="lg:w-[44.6%] relative md:w-[70%] xs:w-[90%] w-[100%] flex flex-col h-full border-r-[1.3px] border-gray-200 dark:border-gray-600 scrollbar-none overflow-y-scroll">
			<div className="sticky top-0 gap-6 w-full backdrop-blur-lg z-30 flex items-center md:px-4 px-2 py-3 bg-white/50 dark:bg-[#100C08]/50">
				<HiOutlineArrowLeft 
				onClick={()=>{setCurrentPost('');setCurrentWindow('Home');}}
				className="h-[18px] cursor-pointer w-[18px] text-black dark:text-gray-200"/>
				<h1 className="select-none text-xl text-black font-semibold dark:text-gray-200">Trend</h1>
			</div>
			<div className="pt-4 flex flex-col w-full md:px-4 px-2">
				<div 
				onClick={()=>{
					setCurrentWindow('Profile')
					window.history.replaceState({id:100},'Default',`?profile=${currentPost.user.id}`);
				}}
				className="flex items-center gap-3">
					<img src={currentPost?.user?.image} alt="" className="h-12 w-12 rounded-xl"/> 
					<div className="flex flex-col">
						<h1 className="text-lg truncate font-semibold text-black dark:text-gray-100 select-none hover:cursor-pointer hover:underline">
							{currentPost?.user?.name}
						</h1>
						<h1 className="text-gray-500 text-md truncate select-none">@{currentPost?.user?.username}</h1>
					</div>
				</div>
				<div className="pt-3 w-full">
					<h1 className="w-full break-words text-lg text-black dark:text-gray-200">{currentPost?.text}</h1>
				</div>
				<div className={`rounded-2xl mt-3 grid rounded-2xl ${currentPost?.images?.length>1 ? 'grid-cols-2' : 'grid-cols-1'} gap-1 overflow-hidden`}>
					{
						currentPost?.images?.length>0 &&
						currentPost?.images?.map((ur,i)=>(
						<div className="relative group flex items-center justify-center cursor-pointer overflow-hidden" key={i}>
							<div className="absolute h-full w-full z-10 transition-all duration-200 
							ease-in-out group-hover:bg-gray-500/10"/>
							<img src={ur} alt="" className="select-none w-full aspect-square transition-all duration-300 ease-in-out"/>
						</div>
						))

					}
				</div>
				<div className="mt-2 flex">
					<h1 className="hover:underline text-gray-600 dark:text-gray-400 text-md cursor-pointer whitespace-nowrap">
						{currentPost && tConvert(currentPost?.createdAt)} - {currentPost && dConvert(currentPost?.createdAt)} - <span className="text-black dark:text-gray-200">{currentPost && millify(currentPost?.views?.length)}</span> views
					</h1>
				</div>
				<div className="h-[1px] w-[99%] mx-auto bg-gray-300/50 dark:bg-gray-700/50 w-full mt-4"/>
				<div className="mt-4 flex md:gap-5 gap-3">
					<h1 
					onClick={()=>{setOpenOverlay(currentPost.retweetedBy);setOverlayFor('Retweeted By')}}
					className="text-black dark:text-gray-200 text-md font-semib?old cursor-pointer whitespace-nowrap">
						{currentPost && millify(currentPost?.retweetedBy?.length)} <span className="hover:underline text-gray-500">Retweets</span>
					</h1>
					<h1 
					onClick={()=>{setOpenOverlay(currentPost?.likes);setOverlayFor('Liked By')}}
					className="text-black dark:text-gray-200 text-md font-semibold cursor-pointer whitespace-nowrap">
						{currentPost && millify(currentPost?.likes?.length)} <span className="hover:underline text-gray-500">Likes</span>
					</h1>
					<h1 className="text-black dark:text-gray-200 text-md font-semibold cursor-pointer whitespace-nowrap">
						{currentPost && millify(currentPost?.bookmarks?.length)} <span className="hover:underline text-gray-500">Bookmarks</span>
					</h1>
				</div>
				<div className="h-[1px] w-[99%] mx-auto bg-gray-300/50 dark:bg-gray-700/50 w-full mt-4"/>
				<div className="mt-2 lg:pr-10 md:pr-2 pr-0 justify-between w-full md:w-[85%] lg:w-[100%] xl:w-[90%] flex items-center flex-wrap">
					<div className="flex cursor-pointer group md:gap-[6px] gap-[3px] items-center">
						<div className="p-[10px] group-hover:bg-sky-300/30 dark:group-hover:bg-sky-700/30 transition-all duration-200 ease-in-out rounded-full">
							<FaRegComment className="h-4 w-4 group-hover:text-sky-500 transition-all duration-200 ease-in-out text-gray-600"/>
						</div>
					</div>
					<div 
					onClick={()=>{retweetThisTweet()}}
					className="flex cursor-pointer group md:gap-[6px] gap-[3px] items-center">
						<div className="p-[10px] group-hover:bg-green-300/30 dark:group-hover:bg-green-700/30 transition-all duration-200 ease-in-out rounded-full">
							<AiOutlineRetweet className={`h-5 group-hover:text-green-500 transition-all duration-200 ease-in-out w-5 text-gray-600
							${currentPost?.retweetedBy?.some(element=>{
								if(element.id === currentUser?._id){
									return true;
								}
								return false
							}) &&  'text-green-500' }
							`}/>
						</div>
					</div>
					<div
					onClick={()=>{
						likeThisTweet();
						if(currentUser){
							makeMePink2()
						}
						setLiked(!liked)
					}}
					className="flex cursor-pointer group md:gap-[6px] gap-[3px] items-center">
						<div className="p-[10px] group-hover:bg-pink-300/30 dark:group-hover:bg-pink-700/30 transition-all duration-200 ease-in-out rounded-full">
							{
								liked ? 
								<AiFillHeart id={`like`} className="h-5 group-hover:text-pink-500 transition-all duration-200 ease-in-out w-5 text-pink-600
								focus:scale-75 transition-all duration-800 ease-in-out"/>
								:
								<AiOutlineHeart 
								id={`like`}
								className="h-5 group-hover:text-pink-500 transition-all duration-200 ease-in-out w-5 text-gray-600
								focus:scale-75 transition-all duration-800 ease-in-out"/>
							}	
						</div>
						
					</div>
					<div 
					onClick={()=>{
						bookmarkThisTweet();
						if(currentUser){
							makeMePink3();
						}
					}}
					className="flex cursor-pointer group md:gap-[6px] gap-[3px] items-center">
						<div className="p-[10px] group-hover:bg-sky-300/30 dark:group-hover:bg-sky-700/30 transition-all duration-200 ease-in-out rounded-full">
							{
								currentUser?.bookmarks?.some(element=>{
									if(element === currentPost?._id){
										return true;
									}
									return false
								}) ? 
								<BsBookmarkFill id={`bookmark`} className="h-5 group-hover:text-sky-500 transition-all duration-200 ease-in-out w-5 text-sky-600"/>
								:
								<BsBookmark 
								id={`bookmark`}
								className="h-5 group-hover:text-sky-500 transition-all duration-200 ease-in-out w-5 text-gray-600"/>
							}
						</div>
					</div>
					<div 
					onClick={()=>{
						// console.log(location.toString() + '?tweet=' + main._id)
						navigator.clipboard.writeText(location.toString())
						setShowClipboard(true)
					}}
					className="flex cursor-pointer group md:gap-[6px] gap-[3px] items-center">
						<div className="p-[10px] group-hover:bg-sky-300/30 dark:group-hover:bg-sky-700/30 transition-all duration-200 ease-in-out rounded-full">
							<BsFillShareFill className="h-4 w-4 group-hover:text-sky-500 transition-all duration-200 ease-in-out text-gray-600"/>
						</div>
					</div>
				</div>
				<div className={`h-[1px] w-[99%] mx-auto bg-gray-300/50 dark:bg-gray-700/50 ${!currentUser && 'hidden'} w-full mt-2`}/>
				<div className={`mt-4 flex flex-col ${!currentUser && 'hidden'} w-full`}>
					{
						loader && <div class="loader h-[3px] w-full mb-2"></div>
					}
					<div className="flex items-center w-full gap-3">
						<img src={currentUser?.image} alt="" className={`h-12 w-12  ${loader && 'select-none'}  rounded-full shadow-md`}/>
						<textarea type="text" value={replyText}
						onClick={()=>{setReveal(true)}} 
						onChange={(e)=>setReplyText(e.target.value)}
						placeholder="Trend your reply!"
						className={`text-xl resize-none h-7 overflow-hidden placeholder:text-gray-500 dark:text-gray-200 text-black w-full outline-none bg-transparent ${loader && 'select-none'} `}/>
						<button 
						onClick={replyTweet}
						className={`px-5 py-2 ${reveal && 'hidden'} ${replyText ? 'bg-sky-500':'bg-sky-300/70 dark:bg-sky-700/70'} text-white rounded-full`}>Reply</button>
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
							{loader &&  <div className="absolute z-5 bg-gray-500/60 dark:bg-gray-400/60 h-full w-full animate-pulse"/> }									
						</div>

					}
					{	
						reveal &&
						<div className={`${loader && 'select-none'} flex items-center pl-14 mt-3 justify-between pr-2`}>
							<div className="flex items-center gap-1">
								<div onClick={openFileInput} className="cursor-pointer rounded-full p-2 hover:bg-sky-200/60 dark:hover:bg-sky-800/30 transition-all duration-200 ease-in-out">
									<BsCardImage className={`h-5 ${loader && 'select-none'} w-5 ${url.length<2 ? 'text-sky-500':'text-gray-500'} `}/>
									<input type="file" id="file1" accept="image/*" 
									value={path}
									onChange={(e)=>setPath(e.target.value)}
									hidden
									/>
								</div>
								<div className="hover:bg-sky-200/80 dark:hover:bg-sky-800/30 relative transition-all box-border duration-200 ease-in-out p-2 rounded-full cursor-pointer">
									<TbGif onClick={()=>setGifInput(!gifInput)} className="text-sky-500 h-[18px] w-[18px]"/>
									<div className={`absolute z-50 ${gifInput ? '-left-10' : '-left-[1000px]'} bottom-12 transition-all duration-200 ease-in-out`} >
								      <GifPicker tenorApiKey={process.env.NEXT_PUBLIC_TERNOR} height="250px" width={gifWidth} 
								      autoFocusSearch="true" theme="dark"  onGifClick={(e)=>{
								      		setGifInput(false);
								      		sendGifMessage(e?.url)
								      }} />
								    </div>							
								</div>
								<div className="relative cursor-pointer hidden sm:block rounded-full p-2 hover:bg-sky-200/30 dark:hover:bg-sky-800/30 transition-all duration-200 ease-in-out">
									<BsEmojiSmile onClick={openEmojiInput} className="h-5 w-5 text-sky-500 z-30"/>
									{
										emojiInput &&
										<div className="absolute top-10 -left-[75px] z-30">
											<EmojiPicker theme="dark" onEmojiClick={(emoji)=>{
												setReplyText((replyText)=>{return replyText+' '+emoji.emoji})
											}}/>
										</div>											
									}
								</div>
								<div className="cursor-pointer rounded-full p-2 hover:bg-sky-200/60 dark:hover:bg-sky-800/30 transition-all duration-200 ease-in-out">
									<HiOutlineLocationMarker className="h-5 w-5 text-sky-500"/>
								</div>
							</div>
							<div className={`${loader && 'select-none'}`}>
								<button 
								onClick={replyTweet}
								className={`px-5 py-2 ${replyText || url.length>0 ? 'bg-sky-500':'bg-sky-300/70 dark:bg-sky-700/70'} ${loader && 'bg-sky-300/70 dark:bg-sky-700/70'} text-white rounded-full`}>Reply</button>
							</div>
						</div>
					}
				</div>
				<div className="h-[1px] w-[99%] mx-auto bg-gray-300/50 dark:bg-gray-700/50 w-full mt-3"/>
				<div className="pb-14 flex flex-col w-full">
					{
						currentPost?.comments?.map((comment,i)=>(
							<CommentCard key={i}
							comment={comment} i={i} calDate={calDate} BsThreeDots={BsThreeDots}
							likeThisComment={likeThisComment} makeMePink={makeMePink} currentUser={currentUser}
							millify={millify} BsGraphUpArrow={BsGraphUpArrow} AiOutlineHeart={AiOutlineHeart} 
							AiFillHeart={AiFillHeart} viewThisComment={viewThisComment} currentWindow={currentWindow}
							setCurrentWindow={setCurrentWindow}
							/>
						))
					}
				</div>
			</div>	








			
		</div>


	)
}