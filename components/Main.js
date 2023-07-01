import TwitterApi from 'twitter-api-v2';
import {IoMdClose} from 'react-icons/io';
import {AiOutlineSearch} from 'react-icons/ai';
import {HiOutlineUserGroup} from 'react-icons/hi';
import {useState,useEffect} from 'react'
import Left from './Left';
import Right from './Right'
import Center from './Center'
import Bottom from './Bottom'
import Message from './Message'
import {loginRoutes,registerRoutes,searchProfile} from '../utils/ApiRoutes'
import {RxCross2} from 'react-icons/rx'
import Explore from './Explore';
import Tweet from './Tweet';
import Profile from './Profile';
import Bookmark from './Bookmark';
import axios from 'axios';
import {useRecoilState} from 'recoil'
import {currentChatState,chatsState,currentUserState} from '../atoms/userAtom'


export default function Main() {
	const [currentWindow,setCurrentWindow] = useState('Home');
	const [openOverlay,setOpenOverlay] = useState([]);
	const [overlayFor,setOverlayFor] = useState('');
	const [needToReloadProfile,setNeedToReloadProfile] = useState(false);
	const [newMessageSearch,setNewMessageSearch] = useState(false);
	const [searchResult,setSearchResult] = useState([]); 
	const [searchText,setSearchText] = useState('');
	const [currentChat,setCurrentChat] = useRecoilState(currentChatState);
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [chats,setChats] = useRecoilState(chatsState);
	const [selectedUsers,setSelectedUsers] = useState([]);
	const [revealNotify,setRevealNotify] = useState(false);
	const [notify,setNotify] = useState(false);
	const [msgReveal,setMsgReveal] = useState(false);
	const [creatingGroup,setCreatingGroup] = useState(false);
	const [fullScreenLoader,setFullScreenLoader] = useState(false);

	useEffect(()=>{
		if(location.search){
			const searches = location.search.split('=')
			if(searches.includes('?tweet')){
				setCurrentWindow('tweet');
			}else if(searches.includes('?profile')){
				setCurrentWindow('Profile');
			}
		}

	},[])

	useEffect(()=>{
		if(searchText){
			findUser()
		}else{
			setSearchResult([]);
		}
	},[searchText])

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
			setCurrentWindow('Messages');
			setNewMessageSearch(false);
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
			setCurrentWindow('Messages');
			setNewMessageSearch(false);
		}
	}

	

	return(
		<div className="h-[100%] flex w-full justify-center">
			<Left currentWindow  = {currentWindow} setCurrentWindow = {setCurrentWindow} />
			{
				currentWindow === 'Messages'?
				<Message currentWindow  = {currentWindow} setCurrentWindow = {setCurrentWindow} 
				newMessageSearch={newMessageSearch} setNewMessageSearch={setNewMessageSearch} msgReveal={msgReveal} 
				setMsgReveal={setMsgReveal}
				/>
				:
				currentWindow === 'Explore'?
				<Explore currentWindow={currentWindow} setCurrentWindow={setCurrentWindow} />
				:
				currentWindow === 'tweet'?
				<Tweet currentWindow={currentWindow} setCurrentWindow={setCurrentWindow} openOverlay={openOverlay} 
				setOpenOverlay={setOpenOverlay} overlayFor={overlayFor} setOverlayFor={setOverlayFor} />
				:
				currentWindow === 'Profile'?
				<Profile currentWindow={currentWindow} setCurrentWindow={setCurrentWindow} openOverlay={openOverlay} 
				setOpenOverlay={setOpenOverlay} overlayFor={overlayFor} setOverlayFor={setOverlayFor}
				needToReloadProfile={needToReloadProfile} setNeedToReloadProfile={setNeedToReloadProfile}
				/>
				:
				currentWindow === 'Bookmarks' ?
				<Bookmark currentWindow={currentWindow} setCurrentWindow={setCurrentWindow} openOverlay={openOverlay}
				setOpenOverlay={setOpenOverlay} overlayFor={overlayFor} setOverlayFor={setOverlayFor} />
				:
				<Center currentWindow  = {currentWindow} setCurrentWindow = {setCurrentWindow}  />

			}
			<Right currentWindow  = {currentWindow} setCurrentWindow = {setCurrentWindow} 
			newMessageSearch={newMessageSearch} setNewMessageSearch={setNewMessageSearch} 
			revealNotify={revealNotify} setRevealNotify={setRevealNotify} msgReveal={msgReveal} 
			setMsgReveal={setMsgReveal} notify={notify} setNotify={setNotify} fullScreenLoader={fullScreenLoader}
			setFullScreenLoader={setFullScreenLoader} openOverlay={openOverlay} setOpenOverlay={setOpenOverlay} 
			overlayFor={overlayFor} setOverlayFor={setOverlayFor} needToReloadProfile={needToReloadProfile} 
			setNeedToReloadProfile={setNeedToReloadProfile}
			/>		
			<Bottom  currentWindow  = {currentWindow} setCurrentWindow = {setCurrentWindow} />	
			{
				newMessageSearch &&
				<div className="fixed flex items-center justify-center h-full w-full z-50 bg-black/30">
					<div className="relative m-auto lg:w-[40%] md:w-[60%] sm:w-[80%] sm:max-h-[85%] h-full w-full sm:rounded-3xl bg-white py-3 flex flex-col">
						<div className="flex w-full justify-between items-center top-0 px-4 items-center gap-5">
							<div className="flex gap-5 w-full items-center">
								<div 
								onClick={()=>{
									setNewMessageSearch(false);
								}}
								className="p-2 hover:bg-gray-300 cursor-pointer transition-all duration-200 ease-in-out rounded-full">
									<IoMdClose className="h-5 w-5 cursor-pointer text-black"/>
								</div>
								<h1 className="text-xl select-none text-black font-semibold">{
									setCreatingGroup ? 
									'Create a group'
									:
									'New Message'
								}</h1>
							</div>
							<button 
							onClick={nextStep}
							className={`text-white font-semibold py-1 px-4 ${selectedUsers.length>0 ? 'bg-black cursor-pointer':'bg-black/60 cursor-not-allowed' } rounded-full`}>Next</button>
						</div>
						<div className="flex mt-4 mb-4 px-6 w-full gap-4 ">
							<AiOutlineSearch className="h-6 w-6 text-sky-600"/>
							<input type="text" className="bg-transparent outline-none placeholder:text-gray-500 text-black w-full"
							placeholder="Search people"
							value={searchText}
							onChange={(e)=>setSearchText(e.target.value)}
							/>
						</div>
						<div className="bg-gray-300/50 h-[1.7px] w-full"/>
						<div 
						onClick={()=>setCreatingGroup(true)}
						className={`py-[14px] ${selectedUsers.length>0 && 'hidden'} ${creatingGroup && 'hidden'} hover:bg-gray-200/40 border-b-[1.5px] border-gray-200/60 transition-all duration-200 ease-in-out
						cursor-pointer px-4 flex items-center gap-3`}>
							<div className="p-2 rounded-full border-[1px] border-gray-300">
								<HiOutlineUserGroup className="h-5 w-5 text-sky-500"/>
							</div>
							<h1 className="text-sky-500 font-semibold text-lg">Create a group</h1>
						</div>
						<div className={`py-3 ${!selectedUsers.length>0 && 'hidden'} border-b-[1.5px] border-gray-200/60 transition-all duration-200 ease-in-out
						px-4 flex items-center flex-wrap overflow-hidden gap-1`}>
							{
								selectedUsers.map((user,i)=>(
									<div className='flex items-center p-[2px] px-[5px] hover:bg-gray-200/70 transition-all duration-200 ease-in-out
									cursor-pointer rounded-full gap-2 border-[1px] border-gray-300/80'>
										{
											user?.group ? 
											<div className="h-5 w-5 rounded-full overflow-hidden grid grid-cols-2">
												{
													user?.image?.map((img,j)=>{
														if(user.image.length === 3){
															if(j<2){
																return (
																	<img src={img} className="object-cover w-full h-full" alt=""/>
																)
															}
														}else{
															if(j<4){
																return (
																	<img src={img} className="object-cover w-full h-full" alt=""/>
																)
															}	
														}
													})
												}
											</div>
											:
											<img src={user.image} alt="" className="h-5 w-5 rounded-full"/>
										}
										
										<h1 className="text-md select-none font-semibold text-black">{user.name}</h1>
										<IoMdClose 
										onClick={()=>removeSelectedUser(i)}
										className="text-sky-500 select-none hover:text-red-500 transition-all duration-200 ease-in h-5 w-5"/>
									</div>
								))
							}
						</div>
						<div className="flex flex-col overflow-y-scroll scrollbar-thin 
						scrollbar-thumb-sky-400 scrollbar-track-gray-200">
							{
								searchResult.length>0?
									searchResult.map((res)=>(
										<div 
										onClick={()=>{
											modifySelectedUsers(res)
										}}
										className="flex z-40 overflow-hidden cursor-pointer gap-[7px] w-full px-4 w-full hover:bg-gray-200/50 transition-all duration-200 ease-in-out py-3">
											<img src={res.image} className={`h-12 select-none w-12 ${currentUser._id === res._id && 'opacity-50' } rounded-full`}/>
											<div className="flex flex-col truncate shrink">
												<span className={`text-black text-md truncate select-none font-semibold m-0 p-0 
												${currentUser._id === res._id && 'opacity-50' }`}>{res.name}</span>
												<span className={`text-gray-500 truncate select-none text-md m-0 p-0
												${currentUser._id === res._id && 'opacity-50' }`}>@{res.username}</span>
											</div>
										</div>

									))
									:
									currentUser.chats.map((res)=>(
										<div 
										onClick={()=>{
											modifySelectedUsers(res);
										}}
										className="flex z-40 overflow-hidden cursor-pointer gap-[7px] w-full px-4 w-full hover:bg-gray-200/50 transition-all duration-200 ease-in-out py-3">
											{
												res?.group ? 
												<div className="h-12 w-12 rounded-full overflow-hidden grid grid-cols-2">
													{
														res?.image?.map((img,j)=>{
															if(res.image.length === 3){
																if(j<2){
																	return (
																		<img src={img} className="object-cover w-full h-full" alt=""/>
																	)
																}
															}else{
																if(j<4){
																	return (
																		<img src={img} className="object-cover w-full h-full" alt=""/>
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
												<span className="text-black text-md truncate font-semibold m-0 p-0">{res.name}</span>
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
				
			<div className={`fixed flex items-center justify-center ${openOverlay.length>0 ? 'left-0' : 'left-[100%]' } transition-all duration-300 ease-in-out w-full h-full z-50 bg-black/30 `}>
				<div className="relative m-auto lg:w-[40%] md:w-[60%] sm:w-[80%] sm:max-h-[100%] h-full w-full sm:rounded-3xl bg-white px-4 py-3 overflow-y-scroll 
				scrollbar-none flex flex-col">
					<div className="flex sticky top-0 items-center gap-5">
						<div 
						onClick={()=>{
							setOpenOverlay([]);
							setOverlayFor('');
						}}
						className="p-2 hover:bg-gray-300 cursor-pointer transition-all duration-200 ease-in-out rounded-full">
							<IoMdClose className="h-5 w-5 cursor-pointer text-black"/>
						</div>
						<h1 className="text-xl select-none text-black font-semibold">{overlayFor}</h1>
					</div>
					<div className="pt-7 flex flex-col gap-3">
						{
							openOverlay.map((user,j)=>(
								<div className="w-full gap-3 flex" key={j}>
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
									<div className='flex w-full flex-col'>
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
												className="text-lg truncate font-semibold text-black select-none hover:cursor-pointer hover:underline">
													{user?.name}
												</h1>
												<h1 
												onClick={()=>{
													setCurrentWindow('Profile')
													setOpenOverlay([]);
													setOverlayFor('');
													window.history.replaceState({id:100},'Default',`?profile=${user.id || user._id}`);
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
													setCurrentWindow('Profile')
													setOpenOverlay([]);
													setOverlayFor('');
													window.history.replaceState({id:100},'Default',`?profile=${user.id || user._id}`);
												}}
												>Following</button>
												:
												(user.id || user._id) !== currentUser._id && 
												<button className="rounded-full text-white bg-black px-5 py-2 hover:bg-gray-900"
												onClick={()=>{
													setCurrentWindow('Profile')
													setOpenOverlay([]);
													setOverlayFor('');
													window.history.replaceState({id:100},'Default',`?profile=${user.id || user._id}`);
												}}
												>Follow</button>
											}
										</div>
									</div>
								</div>
							))
						}
					</div>
				</div>
			</div>
			
			<div className={`fixed flex gap-2 items-center px-3 pr-7 bg-white py-2 top-2 ${notify ? 'left-2':'-left-[50%]'} z-50 rounded-xl transition-all duration-300 ease-in-out border-gray-300/60 border-[1px]`}>
				<img src={revealNotify?.user?.image}
				alt=" "
				className="h-9 w-9 rounded-full"/>
				<div className="flex flex-col">
					<h1 className="text-black text-md font-semibold">
						{
							revealNotify?.user?.name.length > 20 ? 
							revealNotify?.user?.name.substring(0,17) + '...'
							:
							revealNotify?.user?.name
						}
					</h1>
					<h1 className="text-gray-600 md:text-md text-sm">{
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
						<RxCross2 className="h-4 w-4 text-gray-800"/>
					</div>
				</div>

			</div>

		</div>

	) 
}



// 
// 
// {}