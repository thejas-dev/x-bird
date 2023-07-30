import {MdPostAdd} from 'react-icons/md';
import {useState,useEffect} from 'react';
import {useRecoilState} from 'recoil'
import {currentUserState,currentListState,bottomHideState,showLoginNowState} from '../atoms/userAtom'
import {BiArrowBack} from 'react-icons/bi';
import {AiOutlineSearch,AiOutlineRetweet,AiFillHeart,AiOutlineHeart} from 'react-icons/ai';
import {FaRegComment} from 'react-icons/fa';
import millify from 'millify';
import {BsThreeDots,BsGraphUpArrow,BsFillShareFill} from 'react-icons/bs';
import {updateUserLists,searchProfile,getAllListMemPosts,updateUser,
	getPostByIdRoute,updatedPostRoute,updateUserRetweets} from '../utils/ApiRoutes';
import {RxCross2} from 'react-icons/rx';
import {IoMdPersonAdd} from 'react-icons/io';
import {RiSearch2Fill,RiFileList3Line} from 'react-icons/ri';
import axios from 'axios';
import TweetCard from './TweetCard';
import DateDiff from 'date-diff';
import {socket} from '../service/socket';
import EditListComponent from './EditListComponent';
import ImageKit from "imagekit"

export default function Lists({currentWindow,setCurrentWindow}) {
	// body...
	const [loading,setLoading] = useState(false);
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [searchValue,setSearchValue] = useState('');
	const [newListReveal,setNewListReveal] = useState(false);
	const [newListName,setNewListName] = useState('');
	const [newListDescription,setNewListDescription] = useState('');
	const [imageUploading,setImageUploading] = useState(false);
	const [currentList,setCurrentList] = useRecoilState(currentListState);
	const [listOpen,setListOpen] = useState(false);
	const [revealListMembers,setRevealListMembers] = useState(false);
	const [revealAddMembers,setRevealAddMembers] = useState(false);
	const [addMembersSearchResult,setAddMembersSearchResult] = useState([]);
	const [listMembers,setListMembers] = useState([]);
	const [searchText,setSearchText] = useState('');
 	const [bottomHide,setBottomHide] = useRecoilState(bottomHideState);
 	const [listMembersIds,setListMembersIds] = useState([]);
 	const [showLoginNow,setShowLoginNow] = useRecoilState(showLoginNowState);
 	const [listMembersTweets,setListMembersTweets] = useState([]);
 	const [name,setName] = useState('');
 	const [description,setDescription] = useState('');
 	const [editListShow,setEditListShow] = useState(false);
 	const [backgroundImage,setBackgroundImage] = useState('');
	const [path4,setPath4] = useState('');
 	const imagekit = new ImageKit({
	    publicKey : process.env.NEXT_PUBLIC_IMAGEKIT_ID,
	    privateKey : process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE,
	    urlEndpoint : process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT
	});


	useEffect(()=>{
		setListMembersTweets([]);
		if(currentList){
			let listMem = [...currentList?.members]
			setListMembers(listMem);
			setName(currentList?.name);
			setDescription(currentList?.description);
			setBackgroundImage(currentList?.backgroundImage);			
		}
	},[currentList])

	const searchUsers = async(searchText) => {
		const {data} = await axios.post(searchProfile,{
			searchText
		})
		if(data?.user){
			setAddMembersSearchResult(data.user.slice(0,3));
		}else{
			setAddMembersSearchResult([])
		}
	}

	useEffect(()=>{
		if(searchText){
			searchUsers(searchText)
		}else{
			setAddMembersSearchResult([]);
		}
	},[searchText])

	const addNewList = async() => {
		setImageUploading(true);
		let currList = {
			name:newListName,
			description:newListDescription,
			members:[],
			backgroundImage:'https://th.bing.com/th/id/R.e33a470fc45adbdec1ea3ea7508893a2?rik=pqdkXe7Fm13ZYQ&riu=http%3a%2f%2fsocialmediainvestigation.com%2fwp-content%2fuploads%2f2015%2f07%2fiStock_000027835386Large.jpg&ehk=jFjZ4j6dWie5Tvxfna%2b1MA4%2b3qV2JH62SjdhP6VgR6A%3d&risl=&pid=ImgRaw&r=0'
		}
		let newLists = [currList,...currentUser?.lists];
		const {data} = await axios.post(`${updateUserLists}/${currentUser._id}`,{
			lists:newLists
		})
		setCurrentUser(data.user);
		setImageUploading(false);
		setNewListReveal(false);
	}

	const checkForAlreadyPresent = (user) => {
		for(let i = 0; i<= listMembers?.length; i++){
			if(listMembers[i]?.id === user?._id){
				return true
			}
		}
	}

	const addMember = (user) => {
		let newUser = {
			image:user.image,
			id:user._id,
			name:user.name,
			username:user.username
		}
		let mem = listMembers;
		mem = [newUser,...mem];
		setListMembers(mem)
	}

	const removeMember = async(user) => {
		let mem  = [...listMembers];
		const idx = mem.findIndex(element=>{
			if(element.id === user.id){
				return true
			}
			return false
		})
		mem.splice(idx,1);
		setListMembers(mem)
	}

	const saveTweetMembers = async() => {
		let currList = currentList;
		currList = {...currList, 'members':listMembers}
		setCurrentList(currList)
		let lists = [...currentUser.lists];

		const idx = lists.findIndex(element=>{
			if(element.name === currentList.name){
				return true
			}
			return false
		})
		lists[idx] = currList;
		const {data} = await axios.post(`${updateUserLists}/${currentUser._id}`,{
			lists
		})
		setCurrentUser(data.user)
	}

	useEffect(()=>{
		if(listMembers.length > 0){
			const ids = listMembers.map((mem)=>(mem.id));
			setListMembersIds(ids)
		}
	},[listMembers])

	useEffect(()=>{
		if(listMembersIds.length > 0){
			fetchListMemPosts()
		}
	},[listMembersIds])

	const fetchListMemPosts = async() => {
		const {data} = await axios.post(getAllListMemPosts,{
			following:listMembersIds
		})
		console.log(data.postsWithData);
		setListMembersTweets(data.postsWithData);
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

	const makeMePink = (j) => {
		const element = document.getElementById(`like-${j}`)		
	}

	const makeMeSpin = (j) => {
		const element = document.getElementById(`retweet-${j}`)
		element.classList.add('animate-bounce');
	}

	const likeThisTweet = async(j) => {
		if(currentUser){
			const {data} = await axios.get(`${getPostByIdRoute}/${listMembersTweets[j]._id}`);
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
			const res = await axios.post(`${updatedPostRoute}/${listMembersTweets[j]._id}`,updatedPost);
			const main = [...listMembersTweets];
			main[j] = res.data.obj;
			setListMembersTweets(main);

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
			socket.emit('refetch-post',listMembersTweets[j]._id)
			
		}else{
			setShowLoginNow(true)
		}
	}

	const retweetThisTweet = async(j) => {
		if(currentUser){
			const {data} = await axios.get(`${getPostByIdRoute}/${listMembersTweets[j]._id}`);
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
			const res = await axios.post(`${updatedPostRoute}/${listMembersTweets[j]._id}`,updatedPost);
			let main = [...listMembersTweets];
			main[j] = res.data.obj;
			setListMembersTweets(main);

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
			socket.emit('refetch-post',listMembersTweets[j]._id)
		}else{
			setShowLoginNow(true)
		}
	}

	const viewThisTweet = async(j) => {
		if(currentUser){
			const {data} = await axios.get(`${getPostByIdRoute}/${listMembersTweets[j]._id}`);
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
				const res = await axios.post(`${updatedPostRoute}/${listMembersTweets[j]._id}`,updatedPost);
				let main = [...listMembersTweets];
				main[j] = res.data.obj;
				setListMembersTweets(main);
			}
		}
	}

	const updateList = async() => {
		setImageUploading(true)
		
		let currList = currentList;
		let currName = currentList.name;
		currList = {...currList, 'name':name, 'description':description, 'backgroundImage':backgroundImage};
		setCurrentList(currList)
		let lists = [...currentUser.lists];

		const idx = lists.findIndex(element=>{
			if(element.name === currName){
				return true
			}
			return false
		})
		lists[idx] = currList;
		const {data} = await axios.post(`${updateUserLists}/${currentUser._id}`,{
			lists
		})
		setCurrentUser(data.user);
		setImageUploading(false)
		setEditListShow(false);
	}

	const url2Setter = () =>{
		const file_input = document.getElementById('file4');
		const file = file_input?.files[0];
		setPath4('');
		if(file){
			const reader = new FileReader();
			reader.addEventListener('load',()=>{
				let uploaded_file = reader.result;
				if(imagePathCheck(uploaded_file)){
					uploadBackgroundImage(uploaded_file);
				}
			})
			reader.readAsDataURL(file);			
		}
	}

	const imagePathCheck = (path) =>{
		if(path){
			if(path.split('/').includes('data:image')){
				return true;				
			}
		}
	}

	const uploadBackgroundImage = async(url) => {
		setImageUploading(true);
		imagekit.upload({
	    file : url, //required
	    folder:"Images",
	    fileName : 'TNS_BIRD',   //required
		}).then(async(response) => {
			setBackgroundImage(response.url);
			setImageUploading(false);
		}).catch(error => {
		    console.log(error.message)
		});
	}

	return (
		<div className="lg:w-[44.6%] relative  md:w-[70%] xs:w-[90%] w-[100%] flex flex-col h-full border-r-[1.3px] border-gray-200 dark:border-gray-600 scrollbar-none overflow-y-scroll">
			<EditListComponent name={name} setName={setName} description={description} setDescription={setDescription}
			backgroundImage={backgroundImage} setBackgroundImage={setBackgroundImage} editListShow={editListShow} 
			updateList={updateList} imageUploading={imageUploading} setEditListShow={setEditListShow} url2Setter={url2Setter} 
			setRevealListMembers={setRevealListMembers} setPath4={setPath4} path4={path4}
			/>
			<div className={`fixed z-50 top-0 ${revealListMembers ? 'left-0' : '-left-[100%]'} h-full w-full bg-black/30 dark:backdrop-blur-sm 
			flex transition-all duration-300 ease-in-out items-center justify-center`}>
				<div className="relative m-auto border-[1.1px] border-gray-200 dark:border-gray-700 lg:w-[40%] md:w-[60%] 
				sm:w-[80%] sm:max-h-[85%] overflow-hidden h-full w-full sm:rounded-3xl bg-white dark:bg-[#100C08] 
				flex flex-col overflow-y-scroll	scrollbar-none scroll-smooth transition-all duration-200 ease-in-out">
					<div className="sticky z-40 bg-white/50 dark:bg-[#100C08]/50 backdrop-blur-lg flex items-center justify-between top-0 px-3 py-3 
					border-b-[1px] border-gray-300/50 dark:border-gray-700/50 w-full">
						<div className="flex items-center gap-4">
							<div 
							onClick={()=>{saveTweetMembers();setRevealListMembers(false);setBottomHide(false);setSearchText('');}}
							className="h-8 w-8 p-1 rounded-full hover:bg-gray-300/40 dark:hover:bg-gray-700/40 transition-all 
							duration-200 ease-in-out cursor-pointer">
								<RxCross2 className="h-full w-full text-black dark:text-gray-200"/>
							</div>
							<h1 className="md:text-2xl pb-[1.5px] text-xl dark:text-gray-200 text-black font-semibold">Edit Members</h1>
						</div>
						<button
						onClick={()=>setRevealAddMembers(!revealAddMembers)} 
						className="bg-black text-white dark:text-black dark:bg-white font-semibold rounded-full px-5 py-2 hover:shadow-lg shadow-sky-500">
							<IoMdPersonAdd classList="h-6 w-6"/>
						</button>
					</div>
					<div className={`w-full ${!revealAddMembers ? 'h-[0%]' : ' px-5 py-3 border-b-[1px] dark:border-gray-700/40 border-gray-300/40'} 
					transition-all duration-200 ease-in-out	flex items-center gap-3 `}>
						<div className={`bg-gray-200/50 dark:bg-gray-800/50 border-[1px] border-transparent focus-within:border-sky-400
						rounded-full w-full ${revealAddMembers ? 'h-auto px-4 py-2' : 'h-[0%]'} transition-all duration-200 ease-in-out
						 overflow-hidden peer`}>
							<input type="text" className="w-full outline-none bg-transparent text-black dark:text-gray-200 
							dark:placeholder:text-gray-400 placeholder:text-gray-500 text-md" 
							placeholder="Search peoples" value={searchText}
							onChange={(e)=>setSearchText(e.target.value)}
							/>
						</div>
						<RiSearch2Fill className={`${revealAddMembers ? 'w-7 h-7' : 'w-0 h-0'} transition-all duration-200 ease-in-out text-gray-400 transition-all duration-100 ease-in-out 
						peer-focus-within:text-sky-500 hover:text-sky-500 cursor-pointer`}/>
					</div>	
					{
						addMembersSearchResult?.length > 0 &&
						<>
						<center>
							<div className="xs:w-[90%] w-[95%] mt-4 overflow-y-scroll scrollbar-none rounded-2xl border-[1px] dark:border-gray-600/50 border-gray-400/50">
								{
									addMembersSearchResult.map((main,j)=>(
										<div 
										onClick={()=>{
											if(!checkForAlreadyPresent(main)){
												addMember(main)
											}
										}} key={j}
										className="w-full hover:bg-gray-200/30 dark:hover:bg-gray-800/40 cursor-pointer transition-all 
										duration-200 ease-in-out px-2 py-2 flex gap-1 items-center overflow-hidden relative">
											{
												checkForAlreadyPresent(main) &&
												<div className="absolute h-full w-full z-50 bg-gray-300/40 dark:bg-gray-700/40 top-0 left-0"/>
											}
											<img src={main.image} alt="" className="rounded-full h-10 w-10 hover:shadow-lg"/>
											<div className="flex flex-col w-full items-start shrink">
												<span className="text-md text-black dark:text-gray-200 font-semibold truncate">{
													main?.name.length > 25 ? 
													`${main?.name?.slice(0,25)} ...`
													:
													main?.name

												}</span>
												<span className="text-sm text-gray-500 font-semibold truncate">@{
													main?.username?.length > 25 ? 
													`${main?.username?.slice(0,25)} ...`
													:
													main?.username

												}</span>
											</div>
										</div>
									))
								}
							</div>
						</center>
						<div className="w-full bg-gray-300/30 dark:bg-gray-700/30 mt-4 h-[1px]"/>
						</>	
					}
					<div className="w-full flex flex-col mb-5">
						{
							listMembers.length > 0 ?
							listMembers.map((user,j)=>(
								<div key={j} className="w-full xs:px-6 px-3 py-3 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 cursor-pointer transition-all 
								duration-100 ease-in-out flex items-center justify-between">
									<div className="flex items-center gap-2 overflow-hidden">
										<img src={user?.image} alt="" className="h-10 select-none w-10 rounded-full"/>
										<div className="flex flex-col w-full items-start shrink select-none">
											<span className="text-md hidden xs:block sm:hidden text-black dark:text-gray-200 font-semibold shrink truncate">{
												user?.name.length > 25 ? 
												`${user?.name?.slice(0,25)} ...`
												:
												user?.name

											}</span>
											<span className="text-sm hidden xs:block sm:hidden text-gray-500 font-semibold truncate">@{
												user?.username?.length > 25 ? 
												`${user?.username?.slice(0,25)} ...`
												:
												user?.username

											}</span>
											<span className="text-md xs:hidden text-black dark:text-gray-200 font-semibold shrink truncate">{
												user?.name.length > 12 ? 
												`${user?.name?.slice(0,12)} ...`
												:
												user?.name

											}</span>
											<span className="text-sm xs:hidden text-gray-500 font-semibold truncate">@{
												user?.username?.length > 12 ? 
												`${user?.username?.slice(0,12)} ...`
												:
												user?.username

											}</span>
											<span className="text-md sm:block hidden text-black dark:text-gray-200 font-semibold shrink truncate">{
												user?.name
											}</span>
											<span className="text-sm sm:block hidden text-gray-500 font-semibold truncate">@{
												user?.username
											}</span>
										</div>
									</div>
									<button 
									onClick={()=>removeMember(user)}
									className="text-white px-3 py-1 rounded-full text-md font-semibold bg-red-500">
										Remove
									</button>
								</div>

							))
							:
							<div className="w-full flex-col h-full py-10 flex justify-center items-center">
								<img src="https://abs.twimg.com/responsive-web/client-web/calculator-with-egg-paper-400x200.v1.3f0e1a39.png" alt=""
								className=""/>
								<h1 className="md:text-3xl text-xl font-bold dark:text-gray-200 text-black mt-3">Add members here</h1>
							</div>
						}
					</div>
				</div>
			</div>

			<div className={`absolute w-full z-40 h-full bg-white dark:bg-[#100C08] ${listOpen ? 'left-0' : '-left-[100%]' } transition-all duration-300 
			ease-in-out`}>
				<div className="h-full w-full flex flex-col relative overflow-y-scroll scroll-smooth scrollbar-none">
					<div className="cursor-pointer absolute top-0 md:gap-4 gap-1 bg-gray-100/30 hover:bg-gray-100/80 w-full backdrop-blur-lg z-30 
					flex items-center md:px-4 border-b-[1px] border-gray-200/50 dark:border-gray-800/60 hover:dark:bg-gray-900/60 transition-all duration-300 ease-in-out px-2 py-1 bg-white/50 dark:dark:bg-[#100C08]/50">
						<div 
						onClick={()=>{
							setListOpen(false)
						}}
						className="grid items-center p-1 hover:bg-gray-400/20 rounded-full transition-all duration-200 ease-in-out cursor-pointer select-none">
							<BiArrowBack className="h-5 w-5 text-black dark:text-gray-200"/>
						</div>
						<div className="w-full flex flex-col px-3">
							<span className="md:text-xl text-lg text-black dark:text-gray-200 font-semibold">{currentList?.name}</span>
							<span className="md:text-sm text-sm text-gray-500">@{currentUser?.username}</span>
						</div>
						
					</div>
					<img src={currentList?.backgroundImage || "https://th.bing.com/th/id/R.e33a470fc45adbdec1ea3ea7508893a2?rik=pqdkXe7Fm13ZYQ&riu=http%3a%2f%2fsocialmediainvestigation.com%2fwp-content%2fuploads%2f2015%2f07%2fiStock_000027835386Large.jpg&ehk=jFjZ4j6dWie5Tvxfna%2b1MA4%2b3qV2JH62SjdhP6VgR6A%3d&risl=&pid=ImgRaw&r=0"} 
					alt="" className="w-full  mt-[60px]" />
					<div className="w-full flex flex-col items-center mt-3">
						<h1 className="text-xl font-bold text-black dark:text-gray-100">{currentList?.name}</h1>
						<div 
						onClick={()=>{
							setCurrentWindow('Profile')
							window.history.replaceState({id:100},'Default',`?profile=${currentUser?._id}`);
						}}
						className="flex items-center mt-3 flex-wrap gap-1 cursor-pointer">
							<img src={currentUser?.image} alt="" className="h-5 w-5 rounded-full"/>
							<span className="text-md text-black dark:text-gray-200 font-semibold hover:underline">{currentUser?.name}</span>
							<span className="text-md text-gray-500 font-semibold">@{currentUser?.username}</span>
						</div>
						<div 
						onClick={()=>{setRevealListMembers(true);setBottomHide(true)}}
						className="flex cursor-pointer items-center mt-2 gap-1">
							<span className="text-md font-semibold text-black dark:text-gray-200">{currentList?.members?.length}</span>
							<span className="text-md hover:underline text-gray-500">members</span>	
						</div>
						<button 
						onClick={()=>setEditListShow(true)}
						className="rounded-full px-6 hover:bg-gray-100/70 transition-all ease-in-out duration-200
						text-black dark:text-gray-100 py-1 border-gray-400/40 dark:border-gray-700/40 dark:hover:bg-gray-800/80 mt-3 border-[1px] font-semibold">
							Edit List
						</button>
						<div className="h-[1px] w-full bg-gray-300/40 mt-5"/>
						{
							listMembersTweets.length > 0 ?
							<div className="mb-10 h-full w-full flex flex-col">
								{
									listMembersTweets.map((main,j)=>{
										
									
										return (
										<TweetCard  main={main} j={j} key={j} setCurrentWindow={setCurrentWindow} calDate={calDate} currentWindow={currentWindow}
										BsThreeDots={BsThreeDots} FaRegComment={FaRegComment} millify={millify} AiOutlineRetweet={AiOutlineRetweet}
										retweetThisTweet={retweetThisTweet} makeMeSpin={makeMeSpin} likeThisTweet={likeThisTweet} makeMePink={makeMePink}
										AiFillHeart={AiFillHeart} AiOutlineHeart={AiOutlineHeart} currentUser={currentUser}
										BsGraphUpArrow={BsGraphUpArrow} BsFillShareFill={BsFillShareFill} viewThisTweet={viewThisTweet}
										/>

									)}
									)
								}
							</div>
							:
							<div className="w-full flex-col flex items-center mt-[100px]">
								<img src="https://abs.twimg.com/responsive-web/client-web/calculator-with-egg-paper-400x200.v1.3f0e1a39.png" alt=""
								className=""/>
								<h1 className="text-black dark:text-gray-100 mt-7 font-bold text-3xl">No Tweets Here</h1>
								<p className="text-gray-500 text-md mt-2 mb-[100px]">Tweets from list members will be visible here.</p>
							</div>
						}
					</div>

				</div>
			</div>
			<div className={`${newListReveal  ? 'left-0' : 'left-[100%]'} z-50 transition-all duration-300 ease-in-out fixed top-0 h-full w-full 
			bg-black/30 dark:backdrop-blur-sm flex items-center justify-center`}>
				<div className="relative m-auto border-[1.1px] border-gray-200 dark:border-gray-800 lg:w-[40%] md:w-[60%] 
				sm:w-[80%] sm:max-h-[65%] overflow-hidden h-full w-full sm:rounded-3xl bg-white dark:bg-[#100C08] flex flex-col overflow-y-scroll 
				scrollbar-none">
					<div className={`absolute z-50 flex items-center justify-center h-full w-full bg-white/60 dark:bg-black/70 ${!imageUploading && 'hidden'} `}>
						<span className="loader3 h-14 w-14"/>
					</div>
					<div className="sticky z-40 bg-white/50 dark:bg-[#100C08]/50 backdrop-blur-lg flex items-center justify-between top-0 px-5 py-3 w-full">
						<div className="flex items-center gap-4">
							<div 
							onClick={()=>setNewListReveal(false)}
							className="h-8 w-8 p-1 rounded-full hover:bg-gray-300/40 dark:hover:bg-gray-700/40 transition-all 
							duration-200 ease-in-out cursor-pointer">
								<RxCross2 className="h-full w-full text-black dark:text-gray-100"/>
							</div>
							<h1 className="md:text-2xl pb-[1.5px] text-xl text-black dark:text-gray-100 font-semibold">New List</h1>
						</div>
						<button 
						onClick={()=>{
							if(newListName.length > 3){
								addNewList()
							}
						}}
						className={`${newListName.length > 3 ? 'bg-black dark:bg-white' : 'bg-gray-500'} text-white dark:text-black font-semibold rounded-full px-5 py-2`}>
							Save
						</button>
					</div>
					<div className="w-full flex flex-col gap-5 px-5 py-3">
						<div className="w-full flex flex-col border-[1.5px] px-2 py-1 rounded-lg 
						focus-within:border-sky-400 dark:focus-within:border-sky-400 dark:border-gray-700 border-gray-300/60">
							<h1 className="text-sm text-gray-500" id="nameEle" >Name</h1>
							<input type="text" placeholder="List name" 
							onFocus={()=>document.getElementById('nameEle').classList.add('text-sky-500')}
							onBlur={()=>document.getElementById('nameEle').classList.remove('text-sky-500')}
							value={newListName}
							onChange={(e)=>setNewListName(e.target.value)}
							className="w-full text-lg bg-transparent dark:placeholder:text-gray-400/70 dark:text-gray-100
							text-black placeholder:text-gray-500/70 outline-none "/>
						</div>
						<div className="w-full flex flex-col border-[1.5px] px-2 py-1 rounded-lg 
						focus-within:border-sky-400 dark:border-gray-700 border-gray-300/60">
							<h1 className="text-sm text-gray-500" id="bio" >Description</h1>
							<textarea type="text" placeholder="List description" 
							onFocus={()=>document.getElementById('bio').classList.add('text-sky-500')}
							onBlur={()=>document.getElementById('bio').classList.remove('text-sky-500')}
							value={newListDescription}
							onChange={(e)=>setNewListDescription(e.target.value)}
							className="w-full text-lg bg-transparent dark:placeholder:text-gray-400/70 dark:text-gray-100
							text-black placeholder:text-gray-500/70 outline-none resize-none h-[100px]"/>
						</div>		
					</div>
				</div>
			</div>
			<div className="sticky top-0 gap-1 w-full backdrop-blur-lg z-30 flex items-center md:px-4 px-2 py-3 
			dark:bg-[#100C08]/50 bg-white/50">
				<div 
				onClick={()=>setCurrentWindow('Home')}
				className="grid items-center p-1 hover:bg-gray-400/30 rounded-full transition-all duration-200 ease-in-out cursor-pointer select-none">
					<BiArrowBack className="h-7 w-7 text-black dark:text-gray-200"/>
				</div>
				<div className="w-full flex items-center rounded-full gap-2 
				bg-gray-200/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 border-[1px] focus-within:border-sky-500 px-3 py-2">
					<AiOutlineSearch className="h-6 w-6 text-gray-600 dark:text-gray-400"/>
					<input type="text" placeholder="Search Lists"  
					value={searchValue} onChange={(e)=>setSearchValue(e.target.value)}
					className="w-full text-md outline-none p-1 text-black dark:text-gray-100 placeholder:text-gray-600 dark:placeholder:text-gray-400 bg-transparent"/>
				</div>
				<div 
				onClick={()=>setNewListReveal(true)}
				className="grid items-center p-1 hover:bg-gray-400/30 rounded-full transition-all duration-200 ease-in-out cursor-pointer select-none">
					<MdPostAdd className="h-7 w-7 text-black dark:text-gray-200"/>
				</div>
			</div>
			<div className={`h-full w-full backdrop-blur-lg bg-white dark:bg-[#100C08] flex items-center justify-center absolute z-50 ${!loading && 'hidden'}`}>
				<span className="loader3"></span>
			</div>
			<div className="w-full flex flex-col md:px-4 px-2 py-2">	
				<h1 className="md:text-2xl text-xl text-black dark:text-gray-200 font-semibold">Your Lists</h1>
				<div className={`w-full flex ${currentUser?.lists?.length < 1 && 'hidden'} gap-2 py-7 flex-col`}>
					{
						currentUser?.lists?.map((list,j)=>(
							<div key={j} 
							onClick={()=>{setCurrentList(list);setListOpen(true)}}
							className="w-full hover:bg-gray-200/40 dark:hover:bg-gray-800/50 cursor-pointer transition-all duration-200
							ease-in-out flex items-center gap-4 px-3 py-2 rounded-xl">
								<div className="p-3 rounded-lg bg-sky-300/50 dark:bg-sky-700/50">
									<RiFileList3Line className="h-8 w-8 text-blue-700 dark:text-blue-300"/>
								</div>
								<div className="flex-col flex">
									<p className="text-lg font-bold text-black dark:text-gray-200">{list?.name} <span className="text-gray-400 dark:text-gray-600 font-normal text-md"> •  {list?.members?.length} members</span></p>
									<p className="text-md text-gray-600 dark:text-gray-400 flex items-center gap-1"><img src={currentUser?.image} alt="" className="rounded-full h-5 w-5"/> <span className="text-black dark:text-gray-300 font-semibold">{currentUser?.name}</span> <span className="sm:flex hidden">@{currentUser?.username}</span></p>
								</div>

							</div>
						))
					}
				</div>
				<div className={`${currentUser?.lists?.length < 1 ? 'grid' : 'hidden'} w-full h-[200px] items-center`}>
					<h1 className="text-md text-gray-600 dark:text-gray-400 text-center">Nothing to see here yet — create favorite Lists to see your favorite posts.</h1>
				</div>
				<div className="mt-5 bg-gray-500/20 h-[1px] w-full"/>
			</div>

		</div>


	)
}
