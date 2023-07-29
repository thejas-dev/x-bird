import {RiSearchLine} from 'react-icons/ri';
import {AiOutlineSetting} from 'react-icons/ai'
import {useState,useEffect} from 'react'
import axios from 'axios';
import {findPostByText,updateUserRetweets,updatedPostRoute,getPostByIdRoute,
	updateUser,getAllPosts,findPostByCategories,updateShowScrollInfo,getTrendingPosts} from '../utils/ApiRoutes'
import {BsThreeDots,BsGraphUpArrow,BsFillShareFill} from 'react-icons/bs'
import {FaRegComment} from 'react-icons/fa';
import millify from 'millify';
import {AiOutlineRetweet,AiFillHeart,AiOutlineHeart} from 'react-icons/ai';
import {HiOutlineArrowLeft} from 'react-icons/hi';
import {useRecoilState} from 'recoil'
import {currentUserState,showLoginNowState,mainFeedState,sidebarState,searchTextState,
	bottomHideState,currentHeadingState} from '../atoms/userAtom'
import {socket} from '../service/socket';
import TweetCard from './TweetCard';
import DateDiff from 'date-diff';


export default function Explore({currentWindow,setCurrentWindow}) {
	
	const [headings,setHeadings]  = useState([])
	const [currentHeading,setCurrentHeading] = useRecoilState(currentHeadingState)
	const [searchText,setSearchText] = useRecoilState(searchTextState);
	const [postLoading,setPostLoading] = useState(false);
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [mainFeed,setMainFeed] = useRecoilState(mainFeedState)
	const [searchPost,setSearchPost] = useState([]);
	const [showLoginNow,setShowLoginNow] = useRecoilState(showLoginNowState);
	const [postFound,setPostFound] = useState(true);
	const [showScrollInfo,setShowScrollInfo] = useState(false);
	const [openSidebar,setOpenSidebar] = useRecoilState(sidebarState);
  	const [bottomHide,setBottomHide] = useRecoilState(bottomHideState)	


	useEffect(()=>{
		if(searchText){
			searchPostByText()
		}
	},[searchText])

	const updateScrollInfoToUser = async() => {
		const {data} = await axios.post(`${updateShowScrollInfo}/${currentUser._id}`,{
			showScrollInfo:true
		})
		setCurrentUser(data.user);
	}

	useEffect(()=>{
		if(!currentUser?.showScrollInfo){
			setShowScrollInfo(true);
			updateScrollInfoToUser()
		}
		const ele = document.getElementById('headingsBar');
		let x = 0;
		let y = 0;
		ele.addEventListener('mousedown',(e)=>{
			x = e.screenX
		})
		ele.addEventListener('mouseup',(e)=>{
			y = e.screenX;
			ele.scroll({
				left:ele.scrollLeft + (x - y),
				behavior:"smooth"
			})
		})
	},[])

	useEffect(()=>{
		let ele = document.getElementById('exploreArea');
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

	const searchPostByText = async() => {
		setPostLoading(true);
		const {data} = await axios.post(findPostByText,{text:searchText});
		if(data.status){
			setPostFound(true)
			setSearchPost(data.post.reverse());
		}else{
			setPostFound(false)
		}
		setPostLoading(false)
	}


	const fetchForYou = async() => {
		setPostLoading(true)
		const {data} = await axios.post(getAllPosts,{
			categories:currentUser?.categories
		});
		if(data?.postsWithData){
			setSearchPost(data.postsWithData)
			setPostLoading(false)
		}else{
			setSearchPost(data.data.reverse())
			setPostLoading(false)			
		}
	}

	const fetchPostsByCategories = async() => {
		setPostLoading(true)
		const {data} = await axios.post(findPostByCategories,{
			categories:currentHeading
		});
		if(data.status){
			setPostFound(true)
			setSearchPost(data.post.reverse());
		}else{
			setPostFound(false)
		}
		setPostLoading(false)
	}

	useEffect(()=>{
		if(currentHeading !== 'For you'){
			setSearchText('');
		}
		if(currentHeading !== 'For you' && currentHeading !== 'Trending'){
			fetchPostsByCategories()
		}else if(currentHeading === 'For you'){
			if(!searchText){
				setPostLoading(true);
				if(mainFeed.length > 0){
					setSearchPost(mainFeed);
					setPostFound(true)
					setPostLoading(false);
				}else{
					fetchForYou()
				}
			}
		}else if(currentHeading === 'Trending'){
			fetchTrendingPosts()
		}
	},[currentHeading])

	const fetchTrendingPosts = async() => {
		setPostLoading(true)
		const {data} = await axios.get(getTrendingPosts);
		if(data.status){
			setPostFound(true)
			setSearchPost(data.trends);
		}else{
			setPostFound(false)
		}
		setPostLoading(false)
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
			const res = splitres[1] + ' ' + splitres[2]
			return res
		} 
	}

	const retweetThisTweet = async(j) => {
		if(currentUser){
			const {data} = await axios.get(`${getPostByIdRoute}/${searchPost[j]._id}`);
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
			const res = await axios.post(`${updatedPostRoute}/${searchPost[j]._id}`,updatedPost);
			let main = [...searchPost];
			main[j] = res.data.obj;
			setSearchPost(main);

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
			socket.emit('refetch-post',searchPost[j]._id)
		}else{
			setShowLoginNow(true)
		}
	}

	const likeThisTweet = async(j) => {
		if(currentUser){
			const {data} = await axios.get(`${getPostByIdRoute}/${searchPost[j]._id}`);
			const post = data.post[0];
			let likes = post.likes;
			const user = {
				name:currentUser.name,
				id:currentUser._id,
				username:currentUser.username,
				image:currentUser.image
			}
			const check = likes.some(element=>{
				if(element.id === user.id){
					return true;
				}
				return false
			})
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
			const res = await axios.post(`${updatedPostRoute}/${searchPost[j]._id}`,updatedPost);
			const main = [...searchPost];
			main[j] = res.data.obj;
			setSearchPost(main);

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
			socket.emit('refetch-post',searchPost[j]._id)
			
		}else{
			setShowLoginNow(true)
		}
	}

	const viewThisTweet = async(j) => {
		if(currentUser){
			const {data} = await axios.get(`${getPostByIdRoute}/${searchPost[j]._id}`);
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
				const res = await axios.post(`${updatedPostRoute}/${searchPost[j]._id}`,updatedPost);
				let main = [...searchPost];
				main[j] = res.data.obj;
				setSearchPost(main);
			}
		}
	}

	const makeMeSpin = (j) => {
		const element = document.getElementById(`retweet-${j}`)
		element.classList.add('animate-bounce');
	}

	const makeMePink = (j) => {
		const element = document.getElementById(`like-${j}`)		
	}

	useEffect(()=>{
		const data = [
		{
			title:'For you'
		},
		{
			title:'Trending'
		},
		{
			title:'News'
		},
		{
			title:'Sports'
		},
		{
			title:'Entertainment'
		},
		{
			title:'Movies'
		},
		{
			title:'Memes'
		},
		{
			title:'Technology'
		},{
			title:'Politics'
		},
		{
			title:'Gaming'
		},{
			title:'Food'
		},{
			title:'Health'
		},{
			title:'Travel'
		},{
			title:'Education'
		},{
			title:'Business and Finance'
		},{
			title:'Sarcasm'
		},{
			title:'Social'
		},{
			title:'Personal development'
		}
		]
		setHeadings(data)
		if(!searchText){
			fetchForYou()
		}
	},[])

	return (
		<div id="exploreArea" className={`lg:w-[44.6%] md:w-[70%] xs:w-[90%] w-[100%] flex flex-col h-full border-r-[1.3px] border-gray-200 dark:border-gray-600 relative 
		scrollbar-none ${postLoading ? 'overflow-hidden':'overflow-y-scroll'} scroll-smooth`}>
			<div className="w-full xs:hidden flex items-center pt-3 justify-center">
				<img src={currentUser?.image || 'https://ik.imagekit.io/d3kzbpbila/thejashari_QSzOWJHFV?updatedAt=1690659361414'} 
				onClick={()=>setOpenSidebar(true)}
				className="left-3 absolute top-3 cursor-pointer left-5 h-8 w-8 rounded-full"/>
				<center>
					<img src="twitter-icon.png" className="h-9 cursor-pointer w-9"/>
				</center>
			</div>
			<div className="mt-2 xs:hidden block bg-gray-200/40 dark:bg-gray-700/40 w-full h-[1px]"/>
			<div 
			onClick={()=>setShowScrollInfo(false)}
			className={`${showScrollInfo ? 'fixed' : 'hidden'} left-0 top-0 bg-black/70 backdrop-blur-md z-20 
			h-full w-full flex flex-col justify-center items-center`}>
				<h1 className="text-white md:text-3xl text-xl font-semibold text-center">Scroll / Slide at this area for more categories</h1>
			</div>
			<div className="flex items-center w-full md:px-5 px-3 lg:gap-7 md:gap-4 gap-3 mt-2">
				<div className="rounded-full overflow-hidden bg-gray-200/80 dark:bg-gray-800/80 w-full flex items-center p-[10px] px-4 gap-3">
					<RiSearchLine className="h-5 w-5 text-gray-500"/>
					<input 
					value={searchText} onChange={(e)=>setSearchText(e.target.value)}
					type="text" className="w-full placeholder:font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600 
					outline-none bg-transparent font-semibold text-gray-800 dark:text-gray-300" placeholder="Search a trend"/>
				</div>
				<div className="p-2 hover:bg-gray-300 dark:hover:bg-gray-800/50 rounded-full cursor-pointer transition-all duration-200 ease-in-out">
					<AiOutlineSetting className="h-5 w-5 text-black dark:text-gray-200"/>
				</div>	
			</div>
			<div id="headingsBar" 
			onClick={()=>setShowScrollInfo(false)}
			className={`mt-[6px] border-b-[1px] border-gray-200/80 dark:border-gray-800/80 ${searchText && 'h-[0px]'} h-[48px]
			transition-all duration-300 ease-in-out flex items-center w-full overflow-x-scroll md:scrollbar-none relative 
			scrollbar-none scroll-smooth bg-white dark:bg-transparent z-30`}>
				
				{
					headings.map((head,i)=>(
						<div key={i}
						onClick={()=>{
							setCurrentHeading(head.title);
							if(i === 0){
								if(currentHeading === 'For you'){
									setSearchText('');
									fetchForYou()
								}
							}
						}}
						className={`relative whitespace-nowrap w-[100%] md:px-7 px-4 flex items-center justify-center 
						${currentHeading === head.title ? 'text-black dark:text-gray-100':'text-gray-500 dark:text-gray-600'} py-3 dark:md:hover:bg-gray-800/40 md:hover:bg-gray-200/70 
						transition-bg duration-200 font-semibold select-none cursor-pointer ease-in-out `}>
							{head.title}
							<div className={`absolute bottom-0 w-[50%] rounded-full h-[4px] ${currentHeading === head.title ? 'bg-sky-500':'bg-transparent'}`}/>
						</div>

					))
				}
			</div>
			<div className="xs:h-[81%] h-[72%] w-full relative flex flex-col">
				<div className={`absolute z-50 ${!postLoading && 'hidden'} bg-white/80 dark:bg-gray-900/80 flex items-center justify-center h-[100vh] w-full`}>
					<div class="spinner">
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					</div>
				</div>
				{
					postFound ?
					searchPost?.map((main,j)=>{
						return (
						<TweetCard  main={main} j={j} key={j} setCurrentWindow={setCurrentWindow} calDate={calDate}
						BsThreeDots={BsThreeDots} FaRegComment={FaRegComment} millify={millify} AiOutlineRetweet={AiOutlineRetweet}
						retweetThisTweet={retweetThisTweet} makeMeSpin={makeMeSpin} likeThisTweet={likeThisTweet} makeMePink={makeMePink}
						AiFillHeart={AiFillHeart} AiOutlineHeart={AiOutlineHeart} currentUser={currentUser}
						BsGraphUpArrow={BsGraphUpArrow} BsFillShareFill={BsFillShareFill} viewThisTweet={viewThisTweet}
						/>

						)
					})
					:
					<div className="h-full bg-sky-100/30 dark:bg-gray-800/30 w-full flex flex-col items-center justify-center" >
						<div class="iloader"></div>
						<h1 className="mt-5 text-xl font-semibold text-black dark:text-gray-300 ">/ 404 Not Found /</h1>
					</div>
				}

			</div>
		</div>

	)
}