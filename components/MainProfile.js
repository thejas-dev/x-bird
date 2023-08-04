import TwitterApi from 'twitter-api-v2';
import {IoMdClose} from 'react-icons/io';
import {AiOutlineSearch} from 'react-icons/ai';
import {HiOutlineUserGroup,HiOutlineCamera} from 'react-icons/hi';
import {useState,useEffect} from 'react'
import {useRouter} from 'next/router'
import Left from './Left';
import Right from './Right'
import Center from './Center'
import Bottom from './Bottom'
import Message from './Message'
import {loginRoutes,registerRoutes,searchProfile,getPostByIdRoute,
	updateUserProfile,updateCategories,updateThemeChangeInfo} from '../utils/ApiRoutes'
import {RxCross2} from 'react-icons/rx'
import Explore from './Explore';
import Tweet from './Tweet';
import Profile from './Profile';
import Bookmark from './Bookmark';
import CategorySelector from './CategorySelector';
import IncomingCallNotify from './IncomingCallNotify';
import VideoCall from './VideoCall';
import GroupVideoCall from './GroupVideoCall'
import axios from 'axios';
import Lists from './Lists'
import {useRecoilState} from 'recoil'
import {currentChatState,chatsState,currentUserState,mainFeedState,displayUserState,
	showLoginNowState,showClipboardState,themeState,homeState,callerIdState,needToRefetchState,
	soundAllowedState,maxImageState,showMaxImageState,msgRevealState
	} from '../atoms/userAtom'
import ImageKit from "imagekit"
import Notifications from './Notifications';

let inGroupCall = false;
let inCall = false;

export default function Main() {
	const [currentWindow,setCurrentWindow] = useState('Profile');
	const [openOverlay,setOpenOverlay] = useState([]);
	const [overlayFor,setOverlayFor] = useState('');
	const [needToReloadProfile,setNeedToReloadProfile] = useState(false);
	const [newMessageSearch,setNewMessageSearch] = useState(false);
	const [searchResult,setSearchResult] = useState([]); 
	const [searchText,setSearchText] = useState('');
	const [currentChat,setCurrentChat] = useRecoilState(currentChatState);
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [theme,setTheme] = useRecoilState(themeState)
	const [chats,setChats] = useRecoilState(chatsState);
	const [selectedUsers,setSelectedUsers] = useState([]);
	const [revealNotify,setRevealNotify] = useState(false);
	const [notify,setNotify] = useState(false);
	const [msgReveal,setMsgReveal] = useRecoilState(msgRevealState);
	const [creatingGroup,setCreatingGroup] = useState(false);
	const [fullScreenLoader,setFullScreenLoader] = useState(false);
	const [editProfileShow,setEditProfileShow] = useState(false);
	const [displayUser,setDisplayUser] = useRecoilState(displayUserState);
	const [name,setName] = useState('');
	const [bio,setBio] = useState('');
	const [userLocation,setUserLocation] = useState('');
	const [image,setImage] = useState('');
	const [backgroundImage,setBackgroundImage] = useState('');
	const [website,setWebsite] = useState('');
	const [imageUploading,setImageUploading] = useState(false);
	const [path3,setPath3] = useState('');
	const [showLoginNow,setShowLoginNow] = useRecoilState(showLoginNowState);
	const [mainFeed,setMainFeed] = useRecoilState(mainFeedState);
	const [path4,setPath4] = useState('');
	const [revealNeedToNotifyLogin,setRevealNeedToNotifyLogin] = useState(true);
	const [showClipboard,setShowClipboard] = useRecoilState(showClipboardState);
	const [showCategorySelector,setShowCategorySelector] = useState(false);
	const [categoryList,setCategoryList] = useState([]);
	const [showThemeMenu,setShowThemeMenu] = useState(false);
	const [home,setHome] = useRecoilState(homeState);
	const [callNow,setCallNow] = useState(false);
	const [currentCaller,setCurrentCaller] = useState('');
	const [currentGroupCaller,setCurrentGroupCaller] = useState('');
	const [acceptedCall,setAcceptedCall] = useState(false);
	const [callerId,setCallerId] = useRecoilState(callerIdState);
	const [needToRefetch,setNeedToRefetch] = useRecoilState(needToRefetchState);
	const [soundAllowed,setSoundAllowed] = useRecoilState(soundAllowedState);
	const [maxImage,setMaxImage] = useRecoilState(maxImageState);
	const [showMaxImage,setShowMaxImage] = useRecoilState(showMaxImageState)					
	const router = useRouter();
	const imagekit = new ImageKit({
	    publicKey : process.env.NEXT_PUBLIC_IMAGEKIT_ID,
	    privateKey : process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE,
	    urlEndpoint : process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT
	});

	useEffect(()=>{
		
		setSoundAllowed(false);
	},[currentWindow])

	// useEffect(() => {
    // const handleRouteChange = (url) => {
    //   const sections = ['home', 'explore', 'profile', 'settings','message','lists','bookmarks'];
    //   const activeSectionFromUrl = url.split('/').pop();
    //   if (sections.includes(activeSectionFromUrl)) {
    //     setCurrentWindow(activeSectionFromUrl);
    //   }
    // };

    // router.events.on('routeChangeComplete', handleRouteChange);

    // return () => {
    //   router.events.off('routeChangeComplete', handleRouteChange);
    // };
  // }, []);

	useEffect(()=>{
		if(notify && currentUser?.notify && currentUser?.notifyVibrate){
			navigator.vibrate([
			  200, 100, 200, 50
			])			
		}
	},[notify])

	useEffect(()=>{
		if(showClipboard){
			setTimeout(()=>{setShowClipboard(false)},3000)
		}
	},[showClipboard])

	useEffect(()=>{
		if(currentUser){
			setName(currentUser?.name);
			setBio(currentUser?.bio);
			setImage(currentUser?.image);
			setBackgroundImage(currentUser?.backgroundImage);
			setUserLocation(currentUser?.location);
			setWebsite(currentUser?.website);
			setCategoryList(currentUser?.categories);
		}
		if(currentUser?.categories?.length < 3){
			setShowCategorySelector(true);
		}
	},[currentUser])

	const imagePathCheck = (path) =>{
		if(path){
			if(path.split('/').includes('data:image')){
				return true;				
			}
		}
	}

	// useEffect(()=>{
	// 	if(location.search){
	// 		const searches = location.search.split('=')
	// 		if(searches.includes('?trend')){
	// 			setCurrentWindow('tweet');
	// 		}else if(searches.includes('?profile')){
	// 			setCurrentWindow('Profile');
	// 		}else if(searches.includes('?explore')){
	// 			setCurrentWindow('Explore');
	// 		}
	// 	}
	// 	console.log("i ran")
	// 	// window.addEventListener('beforeunload',function(event){
	// 	// 	  event.preventDefault();
	// 	// 	  event.returnValue = "Are you sure you want to exit the site ?!"; //"Any text"; //true; //false;
	// 	// 	  return null; //"Any text"; //true; //false;
	// 	// }) 

	// },[])

	useEffect(()=>{
		if(localStorage.getItem('x-bird-theme')){
			if(localStorage.getItem('x-bird-theme') === 'dark'){
				document.getElementById('themeCheckBox').checked = true
			}
		}
	},[theme])

	async function updateProfile() {
		setImageUploading(true)
		const {data} = await axios.post(`${updateUserProfile}/${currentUser?._id}`,{
			name,location:userLocation,bio,image,backgroundImage,website
		})
		setImageUploading(false)
		setEditProfileShow(false);
		setCurrentUser(data.user);
		setDisplayUser(data.user);
	}
	 
	const url1Setter = () =>{
		const file_input = document.getElementById('file3');
		const file = file_input?.files[0];
		setPath3('');
		if(file){
			const reader = new FileReader();
			reader.addEventListener('load',()=>{
				let uploaded_file = reader.result;
				if(imagePathCheck(uploaded_file)){
					uploadImage(uploaded_file);
				}
			})
			reader.readAsDataURL(file);
		}
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

	const uploadImage = async(url) => {
		setImageUploading(true);
		imagekit.upload({
	    file : url, //required
	    folder:"Images",
	    fileName : 'TNS_BIRD',   //required
		}).then(async(response) => {
			setImage(response.url);
			setImageUploading(false);
		}).catch(error => {
		    console.log(error.message)
		});
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

	useEffect(()=>{
		if(searchText){
			findUser()
		}else{
			setSearchResult([]);
		}
	},[searchText])

	useEffect(()=>{
		if(imageUploading){
			const element = document.getElementById('editprofilewindow');
			element.scrollTop = 0;
		}
	},[imageUploading])

	const findUser = async() => {
		const {data} = await axios.post(searchProfile,{
			searchText
		});
		setSearchResult(data.user);
	}

	const modifySelectedUsers = async(user) => {
		if(user._id !== currentUser._id){
			const check2 = await selectedUsers.some(element=>{
				if(element._id === user._id){
					return true;
				}
				return false
			})

			if(!check2){
				setSelectedUsers(selectedUsers=>[...selectedUsers,user]);
			}else{
				const idx = await selectedUsers.findIndex(element=>{
					if(element._id === user._id){
						return true
					}
					return false
				})
				let selected2 = [...selectedUsers];
				await selected2.splice(idx,1);
				setSelectedUsers(selected2);
			}			
		}
	}

	const removeSelectedUser = async(j) => {
		let selected2 = [...selectedUsers];
		selected2.splice(j,1);
		setSelectedUsers(selected2);
	}

	const generateId = () => {
		let id = '';
		for(let i =0; i<10;i++){
			id = id + Math.floor(Math.random()*10).toString();
		}
		return id;
	}

	const nextStep = async() => {
		if(selectedUsers.length===1){
			setSearchText('');
			setMsgReveal(true);
			setCurrentChat(selectedUsers[0])
			setSelectedUsers([]);
			setNewMessageSearch(false);
			router.push('/messages');
		}else if(selectedUsers.length > 1) {
			let name = currentUser.name;
			let _id = [currentUser._id];
			let username = currentUser.username;
			let image = [currentUser.image];
			const group = true;
			const groupId = await generateId()
			const createdAt = new Date().toISOString();

			for(let i = 0; i<selectedUsers.length; i++){
				name = name + ', ' + selectedUsers[i].name;
				username = username + ', ' + selectedUsers[i].username;
				_id = [..._id, selectedUsers[i]._id];
				image = [...image, selectedUsers[i].image];
			}
			const chat = {
				name,_id,image,group,username,createdAt,groupId
			}
			setSearchText('');
			setMsgReveal(true);
			setCurrentChat(chat);
			setSelectedUsers([]);
			setNewMessageSearch(false);
			router.push('/messages');
		}
	}

	const updateCategoriesFunction = async() => {
		setShowCategorySelector(false);
		setMainFeed([]);
		const {data} = await axios.post(`${updateCategories}/${currentUser?._id}`,{
			categories:categoryList
		})
		setCurrentUser(data.user);
		setHome('For you')
		setNeedToRefetch(true)
		if(currentUser?.themeChangeInfo){
			setShowThemeMenu(true);
			setTimeout(()=>{
				document.getElementById('themeCheckBox').checked = false;
				setTheme('light')
				localStorage.setItem('x-bird-theme','light')
			},1000)
			const {data} = await axios.post(`${updateThemeChangeInfo}/${currentUser._id}`,{
				themeChangeInfo:true
			})
			if(data.status){
				setCurrentUser(data.user)
			}
		}else{
			router.push('/');
		}
	}

	const editProfile = () => {
		setEditProfileShow(true)
	}

	

	return(
		<div className="h-[100%] flex w-full justify-center dark:bg-[#100C08]">
			<Left currentWindow  = {currentWindow} setCurrentWindow = {setCurrentWindow} />
			
			<Profile currentWindow={currentWindow} setCurrentWindow={setCurrentWindow} openOverlay={openOverlay} 
			setOpenOverlay={setOpenOverlay} overlayFor={overlayFor} setOverlayFor={setOverlayFor}
			needToReloadProfile={needToReloadProfile} setNeedToReloadProfile={setNeedToReloadProfile} editProfile={editProfile}
			/>
				
			<Right currentWindow  = {currentWindow} setCurrentWindow = {setCurrentWindow} 
			newMessageSearch={newMessageSearch} setNewMessageSearch={setNewMessageSearch} 
			revealNotify={revealNotify} setRevealNotify={setRevealNotify} msgReveal={msgReveal} 
			setMsgReveal={setMsgReveal} notify={notify} setNotify={setNotify} fullScreenLoader={fullScreenLoader}
			setFullScreenLoader={setFullScreenLoader} openOverlay={openOverlay} setOpenOverlay={setOpenOverlay} 
			overlayFor={overlayFor} setOverlayFor={setOverlayFor} needToReloadProfile={needToReloadProfile} 
			setNeedToReloadProfile={setNeedToReloadProfile} callNow={callNow}
			setCallNow={setCallNow} currentCaller={currentCaller} setCurrentCaller={setCurrentCaller}
			currentGroupCaller={currentGroupCaller} setCurrentGroupCaller={setCurrentGroupCaller}
			/>		
			<Bottom  currentWindow  = {currentWindow} setCurrentWindow = {setCurrentWindow} />	
			
			<IncomingCallNotify callNow={callNow} inCall={inCall} inGroupCall={inGroupCall} 
			setCallNow={setCallNow} currentCaller={currentCaller} setCurrentCaller={setCurrentCaller} />	

			<VideoCall currentWindow={currentWindow} setCurrentWindow={setCurrentWindow} callNow={callNow}
			setCallNow={setCallNow} currentCaller={currentCaller} setCurrentCaller={setCurrentCaller}
			acceptedCall={acceptedCall} setAcceptedCall={setAcceptedCall} inCall={inCall} inGroupCall={inGroupCall} />

			<GroupVideoCall currentWindow={currentWindow} setCurrentWindow={setCurrentWindow} callNow={callNow}
			setCallNow={setCallNow} currentCaller={currentCaller} setCurrentCaller={setCurrentCaller}
			acceptedCall={acceptedCall} setAcceptedCall={setAcceptedCall} currentGroupCaller={currentGroupCaller} 
			setCurrentGroupCaller={setCurrentGroupCaller} inCall={inCall} inGroupCall={inGroupCall}
			/>

			<CategorySelector showCategorySelector={showCategorySelector} setShowCategorySelector={setShowCategorySelector}
			imageUploading={imageUploading} updateCategoriesFunction={updateCategoriesFunction} categoryList={categoryList} setCategoryList={setCategoryList}
			currentUser={currentUser}
			/>

			<div className={`fixed dark:bg-black/70 bg-white/20 backdrop-blur-md ${showMaxImage ? 'h-full w-full' : 'h-0 w-0'}
			m-auto z-50 overflow-hidden transition-all duration-200 ease-in`}>
				<div className="h-full flex items-center justify-center w-full relative p-2">
					<div onClick={()=>{setShowMaxImage(false);router.back()}}
					className="absolute md:top-4 top-2 left-2 md:left-5 rounded-full dark:bg-gray-800/70 bg-gray-300/70
					transition-all duration-300 ease-in-out cursor-pointer p-1 dark:hover:bg-gray-700/70">
						<RxCross2 className="text-black dark:text-gray-200 h-6 w-6 z-50"/>

					</div>
					<div className="max-h-[90%] rounded-md overflow-hidden h-[80%] max-w-6xl flex items-center justify-center">
						<img src={maxImage} alt="" className="max-h-full w-full"/>
					</div>

				</div>	

			</div>

			<div className={`fixed w-[180px] text-center bg-green-500 left-0 px-3 py-2 right-0 mx-auto rounded-full border-[1px] border-gray-300/50 ${showClipboard ? 'bottom-3' : '-bottom-[100%]'}
			transition-all duration-200 ease-in-out z-50`}>
				<h1 className="text-md text-white">Copied to clipboard</h1>
			</div>

			<div className={`fixed bg-white px-5 py-3 flex justify-center items-center rounded-t-2xl border-[1px] border-gray-300/60 md:hidden transition-all
			duration-500 ease-in-out gap-3 ${(!currentUser && revealNeedToNotifyLogin) ? 'bottom-0' : '-bottom-[100%]'} left-0 right-0 mx-auto 
			max-w-2xl`}>
				<p 
				onClick={()=>setRevealNeedToNotifyLogin(false)}
				className="text-md text-gray-600">Login for more personalized experience</p>
				<button 
				onClick={()=>router.push('/signIn')} 
				className="bg-sky-500 hover:bg-sky-600 rounded-full px-7 py-3 text-white text-md font-semibold">
					Login
				</button>
			</div>

			<div className={`fixed top-0 ${showThemeMenu ? 'left-0' : 'left-[100%]'} flex items-center justify-center
			h-full w-full z-50 bg-black/40 dark:backdrop-blur-md transition-all duration-200 ease-in-out`}>
				<div className="relative m-auto lg:w-[40%] md:w-[60%] 
				sm:w-[80%] sm:max-h-[85%] overflow-hidden h-full w-full sm:rounded-3xl flex flex-col overflow-y-scroll 
				scrollbar-none">
					<div className="w-full h-full flex items-center justify-center relative">
						<div 
						onClick={()=>setShowThemeMenu(false)}
						className={`fixed h-full w-full cursor-pointer ${!showThemeMenu && 'hidden'}
						transition-all duration-200 ease-in-out top-0 left-0`}>
						</div>
						<label>
						    <input 
						    onChange={()=>{
						    	if(document.getElementById('themeCheckBox').checked){
						    		setTheme('dark') 
						    		localStorage.setItem('x-bird-theme','dark')
						    	}else{
						    		setTheme('light')
						    		localStorage.setItem('x-bird-theme','light')						    		
						    	}
						    }}
						    className="slider" type="checkbox" id="themeCheckBox"/>
						    <div class="switch">
						        <div class="suns"></div>
						        <div class="moons">
						            <div className="star star-1"></div>
						            <div className="star star-2"></div>
						            <div className="star star-3"></div>
						            <div className="star star-4"></div>
						            <div className="star star-5"></div>
						            <div className="first-moon"></div>
						        </div>
						        <div className="sand"></div>
						        <div className="bb8">
						            <div className="antennas">
						                <div className="antenna short"></div>
						                <div className="antenna long"></div>
						            </div>
						            <div className="head">
						                <div className="stripe one"></div>
						                <div className="stripe two"></div>
						                <div className="eyes">
						                    <div className="eye one"></div>
						                    <div className="eye two"></div>
						                </div>
						                <div class="stripe detail">
						                    <div className="detail zero"></div>
						                    <div className="detail zero"></div>
						                    <div className="detail one"></div>
						                    <div className="detail two"></div>
						                    <div className="detail three"></div>
						                    <div className="detail four"></div>
						                    <div className="detail five"></div>
						                    <div className="detail five"></div>
						                </div>
						                <div className="stripe three"></div>
						            </div>
						            <div className="ball">
						                <div className="lines one"></div>
						                <div className="lines two"></div>
						                <div className="ring one"></div>
						                <div className="ring two"></div>
						                <div className="ring three"></div>
						            </div>
						            <div className="shadow"></div>
						        </div>
						    </div>
						</label>
					</div>
				</div>
			</div>

			<div className={`fixed top-0 ${showLoginNow ? 'left-0' : 'left-[100%]'} flex items-center justify-center
			h-full w-full z-50 bg-black/30 dark:backdrop-blur-md transition-all duration-200 ease-in-out`}>
				<div className="relative m-auto border-[1.1px] border-gray-200 dark:border-gray-700 lg:w-[40%] md:w-[60%] 
				sm:w-[80%] sm:max-h-[85%] overflow-hidden h-full w-full sm:rounded-3xl bg-white dark:bg-[#100C08] flex flex-col overflow-y-scroll 
				scrollbar-none">
					<div className="sticky z-40 bg-white/50 dark:bg-[#100C08]/50 backdrop-blur-lg flex items-center justify-between top-0 px-3 py-2 w-full">
						<div className="flex items-center gap-4 px-2 py-3">
							<div 
							onClick={()=>setShowLoginNow(false)}
							className="h-8 w-8 p-1 rounded-full hover:bg-gray-300/40 transition-all 
							duration-200 ease-in-out cursor-pointer">
								<RxCross2 className="h-full w-full text-black dark:text-gray-300"/>
							</div>
							<h1 className="md:text-2xl pb-[1.5px] text-xl text-black font-semibold dark:text-gray-200">Just Swim</h1>
						</div>
					</div>
					<div className="h-full w-full flex flex-col gap-6 mt-[50px] items-center">
						<img src="twitter-icon.png" alt="" className="h-10 w-10"/>
						<h1 className="text-center text-xl text-black dark:text-gray-200 font-semibold">Please login to access interactive features such as posting tweets, making friends, and 
						engaging in conversations.</h1>
						<button 
						onClick={()=>router.push('/signIn')}
						className="px-8 text-xl font-semibold py-2 rounded-full text-white bg-sky-500 
						border-white dark:border-gray-400 dark:bg-sky-600 border-[1px]">
							Login
						</button>


					</div>

				</div>
			</div>

			<div className={`fixed top-0 ${editProfileShow ? 'left-0' : 'left-[100%]'} flex items-center justify-center
			h-full w-full z-50 bg-black/30 dark:backdrop-blur-sm transition-all duration-200 ease-in-out`}>
				<div 
				id="editprofilewindow"
				className="relative m-auto border-[1.1px] border-gray-200 dark:border-gray-700 lg:w-[40%] md:w-[60%] 
				sm:w-[80%] sm:max-h-[85%] overflow-hidden h-full w-full sm:rounded-3xl bg-white dark:bg-[#100C08] flex flex-col overflow-y-scroll 
				scrollbar-none scroll-smooth transition-all duration-200 ease-in-out">
					<div className={`absolute z-50 flex items-center justify-center h-full w-full bg-white/60 dark:bg-black/60 dark:backdrop-blur-md
					${!imageUploading && 'hidden'} `}>
						<span className="loader3 h-14 w-14"/>
					</div>
					<div className="sticky z-40 bg-white/50 dark:bg-[#100C08]/50 backdrop-blur-lg flex items-center justify-between top-0 px-3 py-2 w-full">
						<div className="flex items-center gap-4">
							<div 
							onClick={()=>setEditProfileShow(false)}
							className="h-8 w-8 p-1 rounded-full hover:bg-gray-300/40 dark:hover:bg-gray-700/40 transition-all 
							duration-200 ease-in-out cursor-pointer">
								<RxCross2 className="h-full w-full text-black dark:text-gray-200"/>
							</div>
							<h1 className="md:text-2xl pb-[1.5px] text-xl text-black font-semibold dark:text-gray-200">Edit Profile</h1>
						</div>
						<button 
						onClick={()=>{
							if(name?.length > 3){
								updateProfile()
							}}
						}
						className={`bg-black dark:bg-white text-white dark:text-[#100C08] font-semibold rounded-full ${name?.length < 4 ? 'opacity-50' : 'opacity-100'} px-5 py-2`}>
							Save
						</button>
					</div>
					<div className="relative w-full lg:h-[210px] md:h-[180px] sm:h-[170px] h-[160px] dark:bg-blue-800/20 bg-blue-200/50">
						{
							backgroundImage ?
							<img src={backgroundImage} alt="" className="lg:h-[210px] md:h-[180px] sm:h-[170px] h-[160px] w-full"/>
							:
							<div className="lg:h-[210px] md:h-[180px] sm:h-[170px] h-[160px] w-full"/>

						}
						<div className="flex absolute justify-center top-0 left-0 bottom-0 right-0 items-center m-auto">
							<div className="flex items-center gap-1">
								<div 
								onClick={()=>document.getElementById('file4').click()}
								className="md:h-10 cursor-pointer h-8 w-8 md:w-10 md:p-[6px] p-1 rounded-full bg-black/40 hover:bg-black/30 top-0 left-0 right-0 bottom-0 m-auto">
									<HiOutlineCamera className="h-full w-full text-white"/>
								</div>
								<input type="file" accept="image/*" id="file4"
								value={path4} onChange={(e)=>{setPath4(e.target.value);url2Setter()}}
								hidden/>
								{
									backgroundImage &&
									<div 
									onClick={()=>setBackgroundImage('')}
									className="md:h-10 cursor-pointer h-8 w-8 md:w-10 md:p-[6px] p-1 rounded-full bg-black/40 hover:bg-red-600/30 top-0 left-0 right-0 bottom-0 m-auto">
										<RxCross2 className="h-full w-full text-white"/>
									</div>
								}
							</div>
						</div>
						<div className="p-1 cursor-pointer absolute lg:-bottom-[36%] md:-bottom-[40%] -bottom-[35%] bg-white dark:bg-[#100C08] rounded-full left-3 md:left-5">
							<div className="relative" >
								<div 
								onClick={()=>document.getElementById('file3').click()}
								className="absolute md:h-10 h-8 w-8 md:w-10 md:p-[6px] p-1 rounded-full bg-black/40 hover:bg-black/30 top-0 left-0 right-0 bottom-0 m-auto">
									<HiOutlineCamera className="h-full w-full text-white"/>
								</div>
								<input type="file" accept="image/*" id="file3"
								value={path3} onChange={(e)=>{setPath3(e.target.value);url1Setter()}}
								hidden/>
								<img src={image} alt="" className="md:h-[150px] h-[100px] z-10 md:w-[150px] w-[100px] rounded-full"/>
							</div>
						</div>
					</div>
					<div className="md:mt-[80px] mt-[65px] flex flex-col px-3 py-2 w-full gap-5 pb-7">
						<div className="w-full flex flex-col border-[1.5px] px-2 py-1 rounded-lg focus-within:border-sky-400 dark:border-gray-700/60 border-gray-300/60">
							<h1 className="text-sm text-gray-500 dark:text-gray-400" id="name" >Name</h1>
							<input type="text" placeholder="Enter your name" 
							onFocus={()=>document.getElementById('name').classList.add('text-sky-500')}
							onBlur={()=>document.getElementById('name').classList.remove('text-sky-500')}
							value={name}
							onChange={(e)=>setName(e.target.value)}
							className="w-full text-lg
							text-black placeholder:text-gray-500/70 dark:placeholder:text-gray-400/70 bg-transparent dark:text-gray-200 outline-none "/>
						</div>	

						<div className="w-full flex flex-col border-[1.5px] px-2 py-1 rounded-lg focus-within:border-sky-400 dark:border-gray-700/60 border-gray-300/60">
							<h1 className="text-sm text-gray-500 dark:text-gray-400" id="bio" >Bio</h1>
							<textarea type="text" placeholder="Enter your bio here" 
							onFocus={()=>document.getElementById('bio').classList.add('text-sky-500')}
							onBlur={()=>document.getElementById('bio').classList.remove('text-sky-500')}
							value={bio}
							onChange={(e)=>setBio(e.target.value)}
							className="w-full text-lg
							text-black placeholder:text-gray-500/70 dark:placeholder:text-gray-400/70 dark:text-gray-200 bg-transparent resize-none h-[100px]"/>
						</div>	

						<div className="w-full flex flex-col border-[1.5px] px-2 py-1 rounded-lg focus-within:border-sky-400 dark:border-gray-700/60 border-gray-300/60">
							<h1 className="text-sm text-gray-500 dark:text-gray-400" id="location" >Location</h1>
							<input type="text" placeholder="Location" 
							onFocus={()=>document.getElementById('location').classList.add('text-sky-500')}
							onBlur={()=>document.getElementById('location').classList.remove('text-sky-500')}
							value={userLocation}
							onChange={(e)=>setUserLocation(e.target.value)}
							className="w-full text-lg
							text-black placeholder:text-gray-500/70 dark:placeholder:text-gray-400/70 dark:text-gray-200 bg-transparent outline-none "/>
						</div>

						<div className="w-full flex flex-col border-[1.5px] px-2 py-1 rounded-lg focus-within:border-sky-400 dark:border-gray-700/60 border-gray-300/60">
							<h1 className="text-sm text-gray-500 dark:text-gray-400" id="website" >Website (separate by comma for multiple URLs)</h1>
							<input type="text" placeholder="Website url" 
							onFocus={()=>document.getElementById('website').classList.add('text-sky-500')}
							onBlur={()=>document.getElementById('website').classList.remove('text-sky-500')}
							value={website}
							onChange={(e)=>setWebsite(e.target.value)}
							className="w-full text-lg
							text-black placeholder:text-gray-500/70 dark:placeholder:text-gray-400/70 dark:text-gray-200 bg-transparent outline-none "/>
						</div>


					</div>



				</div>
			</div>


			{
				newMessageSearch &&
				<div className="fixed flex items-center justify-center h-full w-full z-50 bg-black/30 dark:backdrop-blur-md">
					<div className="relative m-auto lg:w-[40%] md:w-[60%] sm:w-[80%] sm:max-h-[85%] h-full w-full sm:rounded-3xl 
					border-[1px] border-gray-200/50 dark:border-gray-700/50 bg-white dark:bg-[#100C08] py-3 flex flex-col">
						<div className="flex w-full justify-between items-center top-0 px-4 items-center gap-5">
							<div className="flex gap-5 w-full items-center">
								<div 
								onClick={()=>{
									setNewMessageSearch(false);
									setCreatingGroup(false)
								}}
								className="p-2 hover:bg-gray-300 dark:hover:bg-gray-700/50 cursor-pointer transition-all duration-200 ease-in-out rounded-full">
									<IoMdClose className="h-5 w-5 cursor-pointer text-black dark:text-gray-300"/>
								</div>
								<h1 className="text-xl select-none text-black font-semibold dark:text-gray-300">{
									creatingGroup ? 
									'Create a group'
									:
									'New Message'
								}</h1>
							</div>
							<button 
							onClick={nextStep}
							className={`text-white dark:text-black font-semibold py-1 px-4 ${selectedUsers.length>0 ? 'bg-black dark:bg-white cursor-pointer':'bg-black/60 dark:bg-white/60 cursor-not-allowed' } rounded-full`}>Next</button>
						</div>
						<div className="flex mt-4 mb-4 px-6 w-full gap-4 ">
							<AiOutlineSearch className="h-6 w-6 text-sky-600"/>
							<input type="text" className="bg-transparent outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400 
							dark:text-gray-200 text-black w-full"
							placeholder="Search people"
							value={searchText}
							onChange={(e)=>setSearchText(e.target.value)}
							/>
						</div>
						<div className="bg-gray-300/50 dark:bg-gray-700/50 h-[1.7px] w-full"/>
						<div 
						onClick={()=>setCreatingGroup(true)}
						className={`py-[14px] ${selectedUsers.length>0 && 'hidden'} ${creatingGroup && 'hidden'} hover:bg-gray-200/40 dark:hover:bg-gray-800/40 border-b-[1.5px] 
						dark:border-gray-800/60 border-gray-200/60 transition-all duration-200 ease-in-out
						cursor-pointer px-4 flex items-center gap-3`}>
							<div className="p-2 rounded-full border-[1px] border-gray-300 dark:border-gray-700">
								<HiOutlineUserGroup className="h-5 w-5 text-sky-500"/>
							</div>
							<h1 className="text-sky-500 dark:text-sky-500 font-semibold text-lg">Create a group</h1>
						</div>
						<div className={`py-3 ${!selectedUsers.length>0 && 'hidden'} border-b-[1.5px] border-gray-200/60 
						dark:border-gray-800/60 transition-all duration-200 ease-in-out	px-4 
						flex items-center flex-wrap overflow-y-scroll scrollbar scrollbar-w-[3px] scrollbar-thumb-sky-500 gap-1`}>
							{
								selectedUsers.map((user,i)=>(
									<div key={i} className='flex items-center p-[2px] px-[5px] hover:bg-gray-200/70 dark:hover:bg-gray-800/70 transition-all duration-200 ease-in-out
									cursor-pointer rounded-full gap-2 border-[1px] dark:border-gray-700/80 border-gray-300/80'>
										{
											user?.group ? 
											<div className="h-5 w-5 rounded-full overflow-hidden grid grid-cols-2">
												{
													user?.image?.map((img,j)=>{
														if(user.image.length === 3){
															if(j<2){
																return (
																	<img src={img} key={j} className="object-cover w-full h-full" alt=""/>
																)
															}
														}else{
															if(j<4){
																return (
																	<img src={img} key={j} className="object-cover w-full h-full" alt=""/>
																)
															}	
														}
													})
												}
											</div>
											:
											<img src={user.image} alt="" className="h-5 w-5 rounded-full"/>
										}
										
										<h1 className="text-md select-none font-semibold dark:text-gray-300 text-black">{user.name}</h1>
										<IoMdClose 
										onClick={()=>removeSelectedUser(i)}
										className="text-sky-500 select-none hover:text-red-500 transition-all duration-200 ease-in h-5 w-5"/>
									</div>
								))
							}
						</div>
						<div className="flex flex-col h-full overflow-y-scroll scrollbar-thin 
						scrollbar-thumb-sky-400 scrollbar-track-gray-200 dark:scrollbar-track-gray-800">
							{
								searchResult?.length>0?
									<>
									{
										searchResult?.map((res,k)=>(
											<div 
											key={k}
											onClick={()=>{
												modifySelectedUsers(res)
											}}
											className="flex z-40 cursor-pointer gap-[7px] w-full px-4 hover:bg-gray-200/50 dark:hover:bg-gray-800/50 transition-all duration-200 ease-in-out py-3">
												<img src={res.image} className={`h-12 select-none w-12 ${currentUser._id === res._id && 'opacity-50' } rounded-full`}/>
												<div className="flex flex-col truncate shrink">
													<span className={`text-black dark:text-gray-200 text-md truncate select-none font-semibold m-0 p-0 
													${currentUser._id === res._id && 'opacity-50' }`}>{res.name}</span>
													<span className={`text-gray-500 dark:text-gray-400 truncate select-none text-md m-0 p-0
													${currentUser._id === res._id && 'opacity-50' }`}>@{res.username}</span>
												</div>
											</div>

										))
									}

									
									</>
									:
									currentUser.chats.map((res,i)=>(
										<div key={i}
										onClick={()=>{
											modifySelectedUsers(res);
										}}
										className={`flex z-40 ${res?.group && 'hidden'} overflow-hidden cursor-pointer gap-[7px] w-full px-4 w-full hover:bg-gray-200/50 
										dark:hover:bg-gray-800/50 transition-all duration-200 ease-in-out py-3`}>
											{
												res?.group ? 
												<div className="h-12 w-12 rounded-full overflow-hidden grid grid-cols-2">
													{
														res?.image?.map((img,j)=>{
															if(res.image.length === 3){
																if(j<2){
																	return (
																		<img src={img} key={j} className="object-cover w-full h-full" alt=""/>
																	)
																}
															}else{
																if(j<4){
																	return (
																		<img src={img} key={j} className="object-cover w-full h-full" alt=""/>
																	)
																}	
															}
														})
													}
												</div>
												:
												<img src={res.image} alt="" className="h-12 w-12 rounded-full"/>
											}										
											<div className="flex flex-col truncate shrink">
												<span className="text-black dark:text-gray-200 text-md truncate font-semibold m-0 p-0">{res.name}</span>
												<span className="text-gray-500 truncate text-md m-0 p-0">@{res.username}</span>
											</div>
										</div>

									))
							}
						</div>
					</div>
				</div>
			}
			{
				fullScreenLoader &&
				<div className="fixed flex items-center justify-center h-full w-full z-50 bg-black/40">
					<span className="loader6 shadow-xl shadow-sky-500/30"/>
				</div>
			}
				
			<div className={`fixed flex items-center justify-center ${openOverlay.length>0 ? 'left-0' : 'left-[100%]' } transition-all 
			duration-300 ease-in-out w-full h-full z-50 bg-black/30 dark:backdrop-blur-md `}>
				<div className="relative m-auto lg:w-[40%] md:w-[60%] border-[1px] dark:border-gray-700/50 border-gray-300/50 sm:w-[80%] sm:max-h-[85%] h-full w-full sm:rounded-3xl bg-white dark:bg-[#100C08] pb-3 overflow-y-scroll 
				scrollbar-none flex flex-col">
					<div className="flex pt-3 sticky top-0 bg-white dark:bg-[#100C08]/50 backdrop-blur-lg items-center gap-5 px-2">
						<div 
						onClick={()=>{
							setOpenOverlay([]);
							setOverlayFor('');
						}}
						className="p-2 hover:bg-gray-300 dark:hover:bg-gray-700/50 cursor-pointer transition-all duration-200 ease-in-out rounded-full">
							<IoMdClose className="h-5 w-5 cursor-pointer text-black dark:text-gray-200"/>
						</div>
						<h1 className="text-xl select-none text-black dark:text-gray-200 font-semibold">{overlayFor}</h1>
					</div>
					<div className="pt-7 flex flex-col gap-1 max-w-[100%]">
						<>
						{
							openOverlay?.map((user,j)=>(
								<div 
								onClick={()=>{
										setOpenOverlay([]);
										setOverlayFor('');
										window.history.replaceState({id:100},'Default',`?profile=${user.id || user._id}`);
										if(currentWindow === 'Profile'){
											setNeedToReloadProfile(true);
										}else{
											setCurrentWindow('Profile')
										}
									}}
									className="max-w-[100%] gap-3 flex cursor-pointer hover:bg-gray-300/40 dark:hover:bg-gray-800/40 p-2 px-4 transition-all 
									duration-200 rounded-lg ease-in-out " key={j}>
									<img src={user.image} 
									onClick={()=>{
										setOpenOverlay([]);
										setOverlayFor('');
										window.history.replaceState({id:100},'Default',`?profile=${user.id || user._id}`);
										if(currentWindow === 'Profile'){
											setNeedToReloadProfile(true);
										}else{
											setCurrentWindow('Profile')
										}
									}}
									className="h-12 w-12 rounded-full"/>
									<div className='flex w-full overflow-hidden flex-col'>
										<div className="flex items-center justify-between">
											<div className="flex flex-col truncate shrink">
												<h1
												onClick={()=>{
													setOpenOverlay([]);
													setOverlayFor('');
													window.history.replaceState({id:100},'Default',`?profile=${user.id || user._id}`);
													if(currentWindow === 'Profile'){
														setNeedToReloadProfile(true);
													}else{
														setCurrentWindow('Profile')
													}
												}}
												className="text-lg truncate font-semibold text-black dark:text-gray-200 select-none hover:cursor-pointer hover:underline">
													{user?.name}
												</h1>
												<h1 
												onClick={()=>{
													
													setOpenOverlay([]);
													setOverlayFor('');
													window.history.replaceState({id:100},'Default',`?profile=${user.id || user._id}`);
													if(currentWindow === 'Profile'){
														setNeedToReloadProfile(true);
													}else{
														setCurrentWindow('Profile')
													}
												}}
												className="text-gray-500 text-md truncate select-none">@{user?.username}</h1>
											</div>
											{
												user?.followers?.some(element=>{
													if(element.id === currentUser?._id){
														return true;
													}
													return false
												})
												?
												<button className="rounded-full text-black bg-transparent px-5 py-2 border-gray-300/70 border-[1.7px] shadow-sm"
												onClick={()=>{
												
													setOpenOverlay([]);
													setOverlayFor('');
													window.history.replaceState({id:100},'Default',`?profile=${user.id || user._id}`);
													if(currentWindow === 'Profile'){
														setNeedToReloadProfile(true);
													}else{
														setCurrentWindow('Profile')
													}
												}}
												>Following</button>
												:
												(user.id || user._id) !== currentUser._id && 
												<button className="rounded-full text-white dark:text-black dark:bg-white bg-black px-5 py-2 hover:bg-gray-900"
												onClick={()=>{
												
													setOpenOverlay([]);
													setOverlayFor('');
													window.history.replaceState({id:100},'Default',`?profile=${user.id || user._id}`);
													if(currentWindow === 'Profile'){
														setNeedToReloadProfile(true);
													}else{
														setCurrentWindow('Profile')
													}
												}}
												>Follow</button>
											}
										</div>
									</div>
								</div>
							))
						}


						</>
					</div>
				</div>
			</div>
			
			<div className={`fixed flex gap-2 items-center px-4 pr-7 py-2 top-2 shadow-xl hover:shadow-sky-600/60 shadow-sky-600/40 ${notify ? 'left-2':'-left-[50%]'} 
			bg-gray-50 dark:bg-gray-900 z-50 rounded-xl transition-all duration-300 ease-in-out border-gray-300/60 dark:border-gray-700/60 border-[1.4px]`}>
				<img src={revealNotify?.user?.image}
				alt=" "
				className="h-9 w-9 rounded-full"/>
				<div className="flex flex-col">
					<h1 className="text-black dark:text-gray-200 hover:underline text-md font-semibold">
						{
							revealNotify?.user?.name.length > 20 ? 
							revealNotify?.user?.name.substring(0,17) + '...'
							:
							revealNotify?.user?.name
						}
					</h1>
					<h1 className="text-gray-600 dark:text-gray-400 md:text-md text-sm">{
						revealNotify?.newData?.message.length > 35 ?
						revealNotify?.newData?.message.substring(0,30) + '...'	
						:
						revealNotify?.newData?.message

					}</h1>
				</div>
				<div className="absolute top-[5px] right-1">
					<div 
					onClick={()=>{
						setNotify(false);
						setTimeout(()=>{
							setRevealNotify('');
						},400)
					}}
					className="rounded-full cursor-pointer">
						<RxCross2 className="h-4 w-4 text-gray-800 dark:text-gray-200"/>
					</div>
				</div>

			</div>

		</div>

	) 
}


